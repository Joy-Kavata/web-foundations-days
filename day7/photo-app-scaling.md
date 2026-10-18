# SnapShare Scaling Plan

## 1. Assumptions and Daily Active Users (DAU)
- **Registered Users:** 10,000,000
- **Activity Rate:** 10% of registered users are active daily.
- **Daily Active Users (DAU):** 10,000,000 × 10% = **1,000,000 DAU**
- **User Actions:** Each active user uploads 1 photo per day and views 50 feed pages per day.
- **File Sizes:** Average photo size is 2 MB; thumbnail size is 50 KB (0.05 MB).
- **Time Conversion:** 1 day = 86,400 seconds. Peak multiplier = 5×.

---

## 2. Quantitative Estimates
- **Uploads per Second (Average):** 
  - 1,000,000 photos / 86,400 seconds = **~11.57 uploads/sec**
- **Uploads per Second (Peak):** 
  - 11.57 × 5 = **~58 uploads/sec**
- **Feed Views per Second (Average):** 
  - (1,000,000 users × 50 feed views) / 86,400 seconds = 50,000,000 / 86,400 = **~578.7 feed views/sec**
- **Feed Views per Second (Peak):** 
  - 578.7 × 5 = **~2,893.5 feed views/sec**
- **Photo Storage per Year:** 
  - Size per photo + thumbnail = 2 MB + 0.05 MB = 2.05 MB
  - Daily storage = 1,000,000 uploads × 2.05 MB = 2,050,000 MB = **2.05 TB/day**
  - Yearly storage = 2.05 TB × 365 days = **748.25 TB/year**

---

## 3. System Load Characteristics
- **Read-Heavy vs. Write-Heavy:** The system is overwhelmingly **read-heavy**. Users view 50 feed pages for every 1 photo they upload (a 50:1 read-to-write ratio).
- **Design Implications:** Because it is read-heavy, the architecture must focus heavily on scaling reads using a Content Delivery Network (CDN) for static assets, caching layers for feed data, and read replicas for the database to prevent bottlenecks.

---

## 4. Storage Architecture for Photos
- **Why Photos Should Not Be in the Database:** Relational databases are optimized for structured tabular data, fast indexing, and ACID transactions. Storing large binary files (BLOBs) like 2 MB photos inside a database would bloat database size, slow down queries, exhaust memory, and make backups slow and expensive.
- **Where They Should Go Instead:** Photos and thumbnails should be stored in **Object Storage** (such as AWS S3), which is specifically designed to store unstructured binary files cost-effectively and scale infinitely.

---

## 5. Architecture Diagram

```text
       [ Clients / Mobile Apps ]
                   │
                   ▼
             [ CDN (Cloudflare) ] ──(caches static photos/thumbnails)
                   │
                   ▼
         [ Load Balancer (LB) ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   [ App Server 1 ]    [ App Server 2 ]
         │                   │
         ├──► [ Cache (Redis) ] (caches user feeds & sessions)
         │
         ├──► [ Database Primary ] (handles writes: user profiles, posts metadata)
         │         │
         │         └──► [ Database Read Replica ] (handles heavy read queries)
         │
         ├──► [ Object Storage ] (stores raw 2MB photos & 50KB thumbnails)
         │
         └──► [ Message Queue (RabbitMQ/SQS) ] ──► [ Background Worker ] (generates thumbnails)

       ## 6. Component Explanations
        - **CDN (Content Delivery Network):** Serves cached photos and thumbnails from geographically distributed edge servers close to users to minimize latency and offload traffic from origin servers.
        - **Load Balancer:** Distributes incoming user requests evenly across application server instances to prevent bottlenecks and ensure high availability.
        - **App Servers:** Stateless application servers that execute core business logic, perform authentication, and coordinate database/storage operations.
        - **Cache (Redis):** Stores frequently requested feed data and user session information in memory to deliver ultra-fast read responses without querying the primary database.
        - **Database Primary:** Serves as the single authority for write operations, ensuring data integrity for user profiles, follow relationships, and post metadata.
        - **Database Read Replica:** Asynchronously replicates data from the primary database to handle heavy feed and profile read queries independently.
        - **Object Storage (AWS S3):** Provides scalable and cost-effective storage for large unstructured binary media, including original 2 MB photos and generated 50 KB thumbnails.
        - **Message Queue & Background Worker:** Receives asynchronous thumbnail creation tasks from app servers and processes heavy image compression jobs in the background without delaying user responses.

       ## 7. Step-by-Step Upload Flow
        1. **Client Request:** The mobile app or web client initiates an HTTP POST request containing the photo file and post metadata to the Load Balancer, which routes it to an available stateless App Server.
        2. **Raw File Storage:** The App Server immediately streams the original 2 MB image file to Object Storage and receives a unique object key/URL in response.
        3. **Metadata Persistence:** The App Server writes a new record containing post metadata (author ID, timestamp, caption, raw photo URL) into the Database Primary.
        4. **Asynchronous Hand-off:** The App Server pushes a thumbnail generation task (containing the post ID and raw photo URL) to the Message Queue.
        5. **Immediate Client Response:** The App Server immediately returns an HTTP `201 Created` status to the client, allowing the user to continue using the application without waiting for image processing.
        6. **Background Worker Execution:** A Background Worker pulls the task from the Message Queue, downloads the original image from Object Storage, generates a compressed 50 KB thumbnail, uploads the thumbnail back to Object Storage, and updates the post record in the database with the thumbnail URL.

        ## 8. Operational Trade-Offs

        ### Trade-Off 1: Asynchronous Processing vs. Immediate Media Availability
        - **Decision:** Thumbnail generation is decoupled using a message queue rather than computed synchronously during the HTTP request.
        - **Trade-Off:** Users receive immediate upload confirmation and lower request latency, but followers viewing the feed within milliseconds of the upload may briefly see a placeholder until the background worker finishes generating and saving the 50 KB thumbnail.

        ### Trade-Off 2: Read Replicas & Replication Lag vs. Strict Read Consistency
        - **Decision:** Heavy read queries (feed views) are routed to read replicas rather than forcing all reads through the primary database.
        - **Trade-Off:** The database gains massive read scaling capability, but a slight replication lag (typically milliseconds) means a user might not immediately see their newly created post on their own feed if the read replica has not synchronized with the primary database yet.
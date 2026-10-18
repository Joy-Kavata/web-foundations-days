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
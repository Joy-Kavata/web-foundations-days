# School Database Design Specification

## Table Explanations
- **`students`**: Stores personal and contact records for each student enrolled in the institution, ensuring unique email identification.
- **`courses`**: Stores available academic units or subjects offered by the school, identified by a unique course code.
- **`enrolments`**: Acts as a junction table connecting students to courses, while also recording the academic grade achieved in that specific course.

## Relationships
- **Students and Courses (Many-to-Many)**: A single student can enroll in multiple courses, and a single course can have many students enrolled. 
- **Why a Join Table is Needed**: Relational databases cannot directly handle many-to-many relationships within two tables without causing data redundancy. The `enrolments` join table breaks this relationship down into two one-to-many relationships (`students` to `enrolments`, and `courses` to `enrolments`), while providing a place to store attributes specific to that relationship, such as the `grade`.

## Database Indexing
- **Index to Add**: `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
- **Reason**: Since queries frequently look up student enrolments or filter by student IDs, this index speeds up search operations, `JOIN` executions, and `LEFT JOIN` performance across large datasets.

## SQL vs. NoSQL Selection
For a school database managing students, courses, and grades, a **Relational SQL database** is the optimal choice. Academic data is highly structured, strongly related, and depends on strict constraints (such as foreign keys and unique rules) to maintain data integrity. Furthermore, operations like calculating student counts per course or tracking grade changes require complex joins and ACID compliance, which relational databases handle natively and securely.
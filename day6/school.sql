CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL
);

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    -- Rule preventing a student from enrolling in the same course twice
    UNIQUE(student_id, course_id)
);

-- Insert 4 students
INSERT INTO students (name, email) VALUES 
('Alice Mwangi', 'alice@example.com'),
('Brian Kiprop', 'brian@example.com'),
('Cynthia Akinyi', 'cynthia@example.com'),
('Diana Ochieng', 'diana@example.com');

-- Insert 3 courses
INSERT INTO courses (title, code) VALUES 
('Database Systems', 'CS101'),
('Web Development', 'CS102'),
('Data Structures', 'CS103');

-- Insert 5 enrolments linking students and courses
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'B+'), -- Alice in Database Systems
(1, 2, 'A'),  -- Alice in Web Development
(2, 1, 'C+'), -- Brian in Database Systems
(2, 3, 'B'),  -- Brian in Data Structures
(3, 2, 'A-'); -- Cynthia in Web Development

-- Query 1: All courses for one student
SELECT c.title, c.code, e.grade 
FROM courses c 
JOIN enrolments e ON c.id = e.course_id 
JOIN students s ON s.id = e.student_id 
WHERE s.name = 'Alice Mwangi';

-- Query 2: All students on one course 
SELECT s.name, s.email, e.grade 
FROM students s 
JOIN enrolments e ON s.id = e.student_id 
JOIN courses c ON c.id = e.course_id 
WHERE c.title = 'Database Systems';

-- Query 3: The number of students per course
SELECT c.title, c.code, COUNT(e.student_id) AS student_count 
FROM courses c 
LEFT JOIN enrolments e ON c.id = e.course_id 
GROUP BY c.id, c.title, c.code;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email 
FROM students s 
LEFT JOIN enrolments e ON s.id = e.student_id 
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;
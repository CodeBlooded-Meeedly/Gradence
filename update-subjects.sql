-- First, clear existing data
DELETE FROM votes;
DELETE FROM subjects;

-- Remove the description column from subjects table
ALTER TABLE subjects DROP COLUMN IF EXISTS description;

-- Insert new subjects
INSERT INTO subjects (name) VALUES
  ('Principles of Programming with C++'),
  ('Data Structures and Algorithms'),
  ('Object Oriented Programming with Java'),
  ('Database Management Systems'),
  ('Operating Systems'),
  ('Computer Networks'),
  ('Software Engineering'),
  ('Introduction to Artificial Intelligence'),
  ('Foundations of Machine Learning'),
  ('Computer Graphics'),
  ('Computer Organization and Architecture'),
  ('Computer Security and Cryptography'),
  ('Computer Vision'),
  ('Cybersecurity'),
  ('Data Science'),
  ('Digital Image Processing'),
  ('Digital Signal Processing'),
  ('Introduction to Natural Language Processing'),
  ('Blockchain Technology'),
  ('Internet of Things'),
  ('Software Project Management'),
  ('Software Architecture and Design Patterns'),
  ('Software Development Tools and Environments'),
  ('Software Quality Assurance and Testing'),
  ('Mobile Computing'),
  ('Cloud Computing'),
  ('Semantic Web Mining'),
  ('Data Visualization'),
  ('North American Art History');
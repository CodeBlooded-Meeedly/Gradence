-- Add vote_weight column to votes table
ALTER TABLE votes
ADD COLUMN vote_weight INTEGER NOT NULL DEFAULT 1; 
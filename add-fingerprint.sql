-- Add fingerprint_id column to votes table
ALTER TABLE public.votes
ADD COLUMN IF NOT EXISTS fingerprint_id TEXT;

-- Add a unique constraint to prevent a user (UUID) from voting on the same subject more than once.
-- This provides a server-side guarantee of one vote per user per subject.
ALTER TABLE public.votes
ADD CONSTRAINT votes_subject_id_user_id_key UNIQUE (subject_id, user_id);

-- Optional: Add a policy to check for fingerprint duplicates as a secondary check.
-- This is commented out by default as it's a stricter, non-traditional constraint.
CREATE POLICY "Check for duplicate fingerprints"
ON public.votes
FOR INSERT
WITH CHECK (
  NOT EXISTS (
    SELECT 1
    FROM public.votes v
    WHERE v.subject_id = subject_id
    AND v.fingerprint_id = fingerprint_id
  )
); 
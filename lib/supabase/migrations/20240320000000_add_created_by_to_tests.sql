-- Add created_by column to tests table
ALTER TABLE tests
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Create index for created_by column
CREATE INDEX IF NOT EXISTS idx_tests_created_by ON tests(created_by);

-- Update existing tests to set created_by to NULL (if needed)
UPDATE tests SET created_by = NULL WHERE created_by IS NOT NULL; 
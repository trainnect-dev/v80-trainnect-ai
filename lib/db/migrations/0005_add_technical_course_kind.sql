-- Add the 'technical-course' kind to the Document table
ALTER TABLE "Document" 
ALTER COLUMN "text" TYPE VARCHAR 
USING "text"::VARCHAR;

-- Update the check constraint to include the new kind
ALTER TABLE "Document" 
DROP CONSTRAINT IF EXISTS "Document_text_check";

ALTER TABLE "Document" 
ADD CONSTRAINT "Document_text_check" 
CHECK ("text" IN ('text', 'code', 'image', 'sheet', 'technical-course'));

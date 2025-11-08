-- Add user_id columns to tables for authenticated access
ALTER TABLE validation_history ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE container_details ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop the insecure public access policies
DROP POLICY IF EXISTS "Allow public read access to container_details" ON container_details;
DROP POLICY IF EXISTS "Allow public insert to container_details" ON container_details;
DROP POLICY IF EXISTS "Allow public read access to validation_history" ON validation_history;
DROP POLICY IF EXISTS "Allow public insert to validation_history" ON validation_history;

-- Create secure authenticated-only policies for container_details
CREATE POLICY "Authenticated users can read their own container_details"
  ON container_details FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can insert their own container_details"
  ON container_details FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own container_details"
  ON container_details FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own container_details"
  ON container_details FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Create secure authenticated-only policies for validation_history
CREATE POLICY "Authenticated users can read their own validation_history"
  ON validation_history FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can insert their own validation_history"
  ON validation_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own validation_history"
  ON validation_history FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own validation_history"
  ON validation_history FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
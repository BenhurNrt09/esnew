-- Enable RLS on favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own favorites
CREATE POLICY "Users can view their own favorites" 
ON favorites FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy to allow users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
ON favorites FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
ON favorites FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

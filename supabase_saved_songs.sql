-- Enable RLS on saved_songs table
ALTER TABLE public.saved_songs ENABLE ROW LEVEL SECURITY;

-- 1. READ Policy: Users can see only their own saved songs
CREATE POLICY "Users can view their own saved songs" 
ON public.saved_songs FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 2. INSERT Policy: Users can only save songs to their own account
CREATE POLICY "Users can insert their own saved songs" 
ON public.saved_songs FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. DELETE Policy: Users can unsave (delete) their own songs
CREATE POLICY "Users can delete their own saved songs" 
ON public.saved_songs FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'saved_songs';

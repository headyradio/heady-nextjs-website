-- Drop table if exists to start fresh (WARNING: This deletes existing messages)
-- DROP TABLE IF EXISTS public.live_chat_messages;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar_url TEXT,
    user_id UUID REFERENCES auth.users(id),
    is_guest BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read messages
CREATE POLICY "Anyone can read live chat messages" 
ON public.live_chat_messages FOR SELECT 
USING (true);

-- Policy: Anyone can insert messages (Guest access)
CREATE POLICY "Anyone can insert live chat messages" 
ON public.live_chat_messages FOR INSERT 
WITH CHECK (true);

-- Policy: Users can update their own messages (optional)
CREATE POLICY "Users can update their own messages" 
ON public.live_chat_messages FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table public.live_chat_messages;

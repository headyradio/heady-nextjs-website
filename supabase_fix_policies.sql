-- FORCE ENABLE GUEST CHAT
-- Run this entire script in Supabase SQL Editor

-- 1. Ensure table exists
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

-- 2. Drop OLD policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read live chat messages" ON public.live_chat_messages;
DROP POLICY IF EXISTS "Anyone can insert live chat messages" ON public.live_chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.live_chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.live_chat_messages;

-- 3. Enable RLS
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Create NEW Permissive Policies
-- Allow EVERYONE to read
CREATE POLICY "Anyone can read live chat messages" 
ON public.live_chat_messages FOR SELECT 
USING (true);

-- Allow EVERYONE to post (Including Guests)
CREATE POLICY "Anyone can insert live chat messages" 
ON public.live_chat_messages FOR INSERT 
WITH CHECK (true);

-- 5. Fix Realtime
-- Remove and re-add to publication to ensure it works
alter publication supabase_realtime drop table public.live_chat_messages;
alter publication supabase_realtime add table public.live_chat_messages;

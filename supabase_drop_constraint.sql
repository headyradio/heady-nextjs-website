-- FIX: Drop the restrictive constraint that is blocking messages
ALTER TABLE public.live_chat_messages DROP CONSTRAINT IF EXISTS one_sender;

-- Optional: Add a corrected constraint if you want to ensure data integrity
-- This ensures that either a user_id is present OR it's a guest message
-- ALTER TABLE public.live_chat_messages ADD CONSTRAINT one_sender CHECK (
--   (user_id IS NOT NULL) OR (is_guest = true)
-- );

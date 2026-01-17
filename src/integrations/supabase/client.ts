// Supabase client for Next.js (browser-side)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Validate environment variables before creating client
// This prevents white screen if env vars are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Supabase environment variables are missing!\n' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.\n' +
    'The app will continue to load, but Supabase features will not work.'
  );
}

// Create client with fallback to prevent crashes
// Use placeholder values if env vars are missing so createClient doesn't throw
const safeUrl = SUPABASE_URL || 'https://placeholder.supabase.co';
const safeKey = SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient<Database>(safeUrl, safeKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// If env vars are missing, mark the client as invalid
// Components can check this before making requests
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
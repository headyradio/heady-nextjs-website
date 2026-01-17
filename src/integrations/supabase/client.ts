// Supabase client for Next.js (browser-side)
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Supabase environment variables are missing!\n' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.\n' +
    'The app will continue to load, but Supabase features will not work.'
  );
}

const safeUrl = SUPABASE_URL || 'https://placeholder.supabase.co';
const safeKey = SUPABASE_ANON_KEY || 'placeholder-key';

// Use createBrowserClient from @supabase/ssr
// This automatically handles cookies for auth, which is required
// for the server-side auth callback to work correctly (PKCE flow).
export const supabase = createBrowserClient<Database>(safeUrl, safeKey);

// If env vars are missing, mark the client as invalid
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
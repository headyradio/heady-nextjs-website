// Supabase client for server-side usage (Server Components, Route Handlers, etc.)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const safeUrl = SUPABASE_URL || 'https://placeholder.supabase.co';
const safeKey = SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Creates a Supabase client for use in Server Components.
 * Uses the anon key for public read-only access (no auth/cookies needed).
 */
export function createServerSupabaseClient() {
  return createClient<Database>(safeUrl, safeKey);
}

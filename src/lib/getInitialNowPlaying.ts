/**
 * Get initial "Now Playing" data from server-side fetch
 * This runs before React hydration to provide immediate data
 */

import { Transmission } from '@/hooks/useRadioBoss';

export interface InitialNowPlayingData {
  nowPlaying: Transmission | null;
  stationName: string;
  listenersCount: number;
  isLive: boolean;
  lastUpdate: string;
}

/**
 * Fetches initial now playing data from Supabase Edge Function
 * This should be called before React hydration for SSR-like behavior
 * NOTE: This function is designed for client-side use only
 */
export async function getInitialNowPlaying(): Promise<InitialNowPlayingData> {
  // Return fallback immediately if we're on the server
  if (typeof window === 'undefined') {
    return {
      nowPlaying: null,
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: new Date().toISOString(),
    };
  }

  try {
    // Use Supabase Edge Function for client-side fetch
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase environment variables not configured');
      throw new Error('Supabase environment variables not configured');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-now-playing`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
        },
        cache: 'no-store',
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Only log if not an abort error (which is expected on timeout)
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn('Failed to fetch initial now playing data:', error.message);
    }
    
    // Return fallback data silently
    return {
      nowPlaying: null,
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: new Date().toISOString(),
    };
  }
}

/**
 * Get initial data from window object (injected by server)
 * This is used when data is pre-rendered into HTML
 */
export function getInitialNowPlayingFromWindow(): InitialNowPlayingData | null {
  if (typeof window === 'undefined') return null;
  
  const data = (window as any).__INITIAL_NOW_PLAYING__;
  if (data) {
    // Clean up after reading
    delete (window as any).__INITIAL_NOW_PLAYING__;
    return data;
  }
  
  return null;
}


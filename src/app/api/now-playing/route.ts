import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// Server-side Supabase client for logging transmissions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServer = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// In-memory cache with 5-second TTL (background poller keeps this fresh)
let cache: {
  data: NowPlayingResponse;
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 1000; // 5 seconds

// Track the last logged track to avoid duplicate inserts
let lastLoggedTrackKey: string | null = null;

export interface NowPlayingTrack {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  play_started_at: string;
  duration?: string | null;
  album_art_url?: string | null;
  genre?: string | null;
  year?: string | null;
  artwork_id?: string | null;
  listeners_count?: number;
}

export interface NowPlayingResponse {
  nowPlaying: NowPlayingTrack | null;
  recentTracks: NowPlayingTrack[];
  stationName: string;
  listenersCount: number;
  isLive: boolean;
  lastUpdate: string;
}

async function fetchFromRadioBoss(): Promise<NowPlayingResponse> {
  try {
    const response = await fetch(RADIOBOSS_API_URL, {
      headers: {
        'Accept': 'application/json',
      },
      // Bypass Next.js fetch cache - we manage our own cache
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RadioBoss API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse current track from the nested RadioBoss format
    const currentTrack = data.currenttrack_info?.['@attributes'];
    const listeners = data.listeners || Number(currentTrack?.LISTENERS) || 0;
    
    // Build artwork URL with a track-identity cache key.
    // RadioBoss uses a static URL (artwork/364.jpg) that changes content when
    // the track changes but the URL stays the same. Next.js Image caches by URL,
    // so we append a hash of the track identity to force a fresh fetch per song.
    let artworkUrl = data.links?.artwork || null;
    if (artworkUrl && currentTrack?.TITLE) {
      const trackKey = encodeURIComponent(`${currentTrack.ARTIST}-${currentTrack.TITLE}`);
      artworkUrl = `${artworkUrl}?t=${trackKey}`;
    }

    const nowPlaying: NowPlayingTrack | null = currentTrack?.TITLE ? {
      id: `current-${currentTrack.TITLE}-${currentTrack.LASTPLAYED}`,
      title: currentTrack.TITLE || 'Unknown',
      artist: currentTrack.ARTIST || 'Unknown Artist',
      album: currentTrack.ALBUM || null,
      play_started_at: currentTrack.LASTPLAYED || new Date().toISOString(),
      duration: currentTrack.DURATION || null,
      album_art_url: artworkUrl,
      genre: currentTrack.GENRE || null,
      year: currentTrack.YEAR || null,
      artwork_id: null,
      listeners_count: listeners,
    } : null;

    // Parse recent tracks
    const recentTracks: NowPlayingTrack[] = (data.recent || []).map((track: any) => ({
      id: `recent-${track.artworkid}-${track.started}`,
      title: track.tracktitle || 'Unknown',
      artist: track.trackartist || 'Unknown Artist',
      album: null,
      play_started_at: track.started || new Date().toISOString(),
      duration: null,
      album_art_url: track.artworkid 
        ? `https://c22.radioboss.fm/w/artwork/${track.artworkid}/364.jpg`
        : null,
      genre: null,
      year: null,
      artwork_id: track.artworkid || null,
      listeners_count: listeners,
    }));

    return {
      nowPlaying,
      recentTracks,
      stationName: data.station_name || 'E.T. Radio',
      listenersCount: listeners,
      isLive: data.live === true,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching from RadioBoss:', error);
    // Return fallback data
    return {
      nowPlaying: null,
      recentTracks: [],
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: new Date().toISOString(),
    };
  }
}

// Log a new transmission to Supabase
async function logTransmission(track: NowPlayingTrack) {
  if (!supabaseServer) {
    console.warn('[RadioBoss Poller] Supabase not configured, skipping transmission log');
    return;
  }

  const trackKey = `${track.artist}-${track.title}-${track.play_started_at}`;
  
  // Skip if we already logged this exact track instance
  if (trackKey === lastLoggedTrackKey) return;

  try {
    const { error } = await supabaseServer
      .from('transmissions')
      .insert({
        title: track.title,
        artist: track.artist,
        album: track.album || null,
        play_started_at: track.play_started_at,
        duration: track.duration || null,
        album_art_url: track.album_art_url || null,
        genre: track.genre || null,
        year: track.year || null,
        artwork_id: track.artwork_id || null,
        listeners_count: track.listeners_count || 0,
      });

    if (error) {
      // Ignore duplicate key errors (track already logged)
      if (error.code === '23505') {
        console.log(`[RadioBoss Poller] Track already logged: ${track.title}`);
      } else {
        console.error('[RadioBoss Poller] Error logging transmission:', error);
      }
    } else {
      console.log(`[RadioBoss Poller] Logged transmission: ${track.artist} - ${track.title}`);
    }
    
    lastLoggedTrackKey = trackKey;
  } catch (err) {
    console.error('[RadioBoss Poller] Failed to log transmission:', err);
  }
}

// Background poller: automatically refresh the cache every 5 seconds
// NOTE: On Vercel serverless, this won't persist between cold starts,
// but the GET handler below handles logging independently.
let pollerStarted = false;

function startBackgroundPoller() {
  if (pollerStarted) return;
  pollerStarted = true;
  
  console.log('[RadioBoss Poller] Starting background poller (every 5s)');
  
  // Initial fetch
  fetchFromRadioBoss().then(data => {
    cache = { data, timestamp: Date.now() };
    console.log(`[RadioBoss Poller] Initial fetch: ${data.nowPlaying?.title || 'no track'}`);
  });
  
  // Poll every 5 seconds (keeps cache warm for local dev)
  setInterval(async () => {
    try {
      const data = await fetchFromRadioBoss();
      cache = { data, timestamp: Date.now() };
    } catch (err) {
      console.error('[RadioBoss Poller] Error:', err);
    }
  }, 5000);
}

// Start the poller when this module is first loaded
startBackgroundPoller();

// Force dynamic rendering (no static caching on Vercel)
export const dynamic = 'force-dynamic';

export async function GET() {
  // Always fetch fresh data from RadioBoss
  const data = await fetchFromRadioBoss();
  
  const previousTrack = cache?.data?.nowPlaying?.title;
  
  // Update cache
  cache = {
    data,
    timestamp: Date.now(),
  };

  // Log to Supabase if track changed (or on first request)
  if (data.nowPlaying && data.nowPlaying.title !== previousTrack) {
    // Don't await - fire and forget so we don't slow down the response
    logTransmission(data.nowPlaying).catch(err => {
      console.error('[Now Playing API] Failed to log transmission:', err);
    });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
    },
  });
}

import { NextResponse } from 'next/server';

// Use Edge Runtime for sub-50ms cold starts (vs ~2-5s for Node.js)
// This is critical for fast now-playing data delivery
export const runtime = 'edge';

// Enable dynamic rendering - data changes frequently
export const dynamic = 'force-dynamic';

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// Cache TTL for CDN (in seconds)
const CACHE_TTL_SECONDS = 15;
const STALE_WHILE_REVALIDATE_SECONDS = 30;

export interface NowPlayingResponse {
  nowPlaying: {
    id: string;
    title: string;
    artist: string;
    album: string | null;
    play_started_at: string;
    duration?: string | null;
    album_art_url?: string | null;
    genre?: string | null;
    year?: string | null;
  } | null;
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
    
    // Parse the RadioBoss API response format
    const nowPlaying = data.artist && data.title ? {
      id: `${data.artist}-${data.title}-${Date.now()}`,
      title: data.title || 'Unknown',
      artist: data.artist || 'Unknown Artist',
      album: data.album || null,
      play_started_at: new Date().toISOString(),
      duration: data.duration ? String(data.duration) : null,
      album_art_url: data.cover || null,
      genre: data.genre || null,
      year: data.year ? String(data.year) : null,
    } : null;

    return {
      nowPlaying,
      stationName: data.station_name || 'E.T. Radio',
      listenersCount: data.listeners || 0,
      isLive: data.is_live === true || data.is_live === 'true',
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching from RadioBoss:', error);
    // Return fallback data
    return {
      nowPlaying: null,
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: new Date().toISOString(),
    };
  }
}

export async function GET() {
  // Fetch fresh data - let Vercel CDN handle caching via headers
  const data = await fetchFromRadioBoss();

  // Return with CDN cache headers
  // s-maxage: cache at CDN for 15 seconds
  // stale-while-revalidate: serve stale content for 30s while fetching fresh
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
    },
  });
}

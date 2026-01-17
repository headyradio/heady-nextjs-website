import { NextResponse } from 'next/server';

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// In-memory cache with 30-second TTL
let cache: {
  data: NowPlayingResponse;
  timestamp: number;
} | null = null;

const CACHE_TTL = 30 * 1000; // 30 seconds

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
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  }

  // Fetch fresh data
  const data = await fetchFromRadioBoss();
  
  // Update cache
  cache = {
    data,
    timestamp: Date.now(),
  };

  return NextResponse.json(data, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}

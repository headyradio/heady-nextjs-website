import { NextResponse } from 'next/server';
import { easternToUtc } from '@/utils/easternToUtc';

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// In-memory artwork cache: artist+title → artwork URL (persists across polls)
// Only caches successful lookups — failed/null results are retried later
const artworkCache = new Map<string, string>();
const ARTWORK_CACHE_MAX = 500;

// Track which keys we've already attempted (to avoid hammering iTunes for unknown tracks)
// Reset periodically so we retry failed lookups
const artworkAttempted = new Set<string>();
const ATTEMPT_RESET_INTERVAL = 5 * 60 * 1000; // Reset failed attempts every 5 minutes

function normalizeForComparison(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchArtworkFromiTunes(artist: string, title: string): Promise<string | null> {
  const cacheKey = `${artist}|||${title}`.toLowerCase();
  const cached = artworkCache.get(cacheKey);
  if (cached) return cached;

  // Skip if we already tried and failed recently
  if (artworkAttempted.has(cacheKey)) return null;
  artworkAttempted.add(cacheKey);

  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&limit=5`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const text = await res.text();
    // iTunes returns a non-JSON error message when rate limited
    if (!text.startsWith('{')) return null;
    const data = JSON.parse(text);
    const results = data.results || [];

    // Find the best matching result by checking if the artist name matches
    const normalizedArtist = normalizeForComparison(artist);
    const match = results.find((r: any) => {
      const resultArtist = normalizeForComparison(r.artistName || '');
      return resultArtist.includes(normalizedArtist) || normalizedArtist.includes(resultArtist);
    });

    // Fall back to first result only if no artist match found
    const result = match || results[0];
    const url = result?.artworkUrl100?.replace('100x100bb', '600x600bb') ?? null;

    if (url) {
      if (artworkCache.size >= ARTWORK_CACHE_MAX) {
        const firstKey = artworkCache.keys().next().value;
        if (firstKey) artworkCache.delete(firstKey);
      }
      artworkCache.set(cacheKey, url);
    }
    return url;
  } catch {
    return null;
  }
}

// In-memory cache with 5-second TTL (background poller keeps this fresh)
let cache: {
  data: NowPlayingResponse;
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 1000; // 5 seconds

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
    // the track changes but the URL stays the same.
    let artworkUrl = data.links?.artwork || null;
    if (artworkUrl && currentTrack?.TITLE) {
      const trackKey = encodeURIComponent(`${currentTrack.ARTIST}-${currentTrack.TITLE}`);
      artworkUrl = `${artworkUrl}?t=${trackKey}`;
    }

    // If RadioBoss doesn't provide artwork, fall back to iTunes
    if (!artworkUrl && currentTrack?.TITLE) {
      artworkUrl = await fetchArtworkFromiTunes(
        currentTrack.ARTIST || 'Unknown Artist',
        currentTrack.TITLE
      );
    }

    const nowPlaying: NowPlayingTrack | null = currentTrack?.TITLE ? {
      id: `current-${currentTrack.TITLE}-${currentTrack.LASTPLAYED}`,
      title: currentTrack.TITLE || 'Unknown',
      artist: currentTrack.ARTIST || 'Unknown Artist',
      album: currentTrack.ALBUM || null,
      play_started_at: currentTrack.LASTPLAYED ? easternToUtc(currentTrack.LASTPLAYED) : new Date().toISOString(),
      duration: currentTrack.DURATION || null,
      album_art_url: artworkUrl,
      genre: currentTrack.GENRE || null,
      year: currentTrack.YEAR || null,
      artwork_id: null,
      listeners_count: listeners,
    } : null;

    // Parse recent tracks — artwork will be filled in by the background artwork fetcher
    const recentTracks: NowPlayingTrack[] = (data.recent || []).map((track: any) => {
      const cacheKey = `${(track.trackartist || '').toLowerCase()}|||${(track.tracktitle || '').toLowerCase()}`;
      return {
        id: `recent-${track.tracktitle}-${track.started}`,
        title: track.tracktitle || 'Unknown',
        artist: track.trackartist || 'Unknown Artist',
        album: null as string | null,
        play_started_at: track.started ? easternToUtc(track.started) : new Date().toISOString(),
        duration: null as string | null,
        album_art_url: artworkCache.get(cacheKey) || null,
        genre: null as string | null,
        year: null as string | null,
        artwork_id: null as string | null,
        listeners_count: listeners,
      };
    });

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

// Background poller: refresh the track data every 5 seconds
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

  // Poll every 5 seconds
  setInterval(async () => {
    try {
      const data = await fetchFromRadioBoss();
      const oldTrack = cache?.data?.nowPlaying?.title;
      cache = { data, timestamp: Date.now() };

      if (data.nowPlaying?.title !== oldTrack) {
        console.log(`[RadioBoss Poller] Track changed: ${data.nowPlaying?.title || 'none'}`);
      }
    } catch (err) {
      console.error('[RadioBoss Poller] Error:', err);
    }
  }, 5000);

  // Background artwork fetcher: gradually fill in missing artwork for recent tracks
  // Runs every 30 seconds, fetches up to 3 artworks per cycle to stay under rate limits
  setInterval(async () => {
    if (!cache?.data?.recentTracks) return;

    const tracksNeedingArt = cache.data.recentTracks.filter(t => {
      const key = `${t.artist}|||${t.title}`.toLowerCase();
      return !artworkCache.has(key) && !artworkAttempted.has(key);
    });

    // Fetch up to 3 per cycle with 500ms delays
    const batch = tracksNeedingArt.slice(0, 3);
    for (const track of batch) {
      await fetchArtworkFromiTunes(track.artist, track.title);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Update cache data with any newly fetched artwork
    if (cache?.data) {
      cache.data.recentTracks = cache.data.recentTracks.map(t => {
        const key = `${t.artist.toLowerCase()}|||${t.title.toLowerCase()}`;
        const art = artworkCache.get(key);
        return art ? { ...t, album_art_url: art } : t;
      });
    }
  }, 30000);

  // Reset attempted set periodically so we retry failed lookups
  setInterval(() => {
    artworkAttempted.clear();
    console.log('[RadioBoss Poller] Reset artwork retry list');
  }, ATTEMPT_RESET_INTERVAL);
}

// Start the poller when this module is first loaded
startBackgroundPoller();

export async function GET() {
  // If cache is fresh, return it immediately
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
      },
    });
  }

  // Cache is stale or empty — fetch fresh
  const data = await fetchFromRadioBoss();

  cache = {
    data,
    timestamp: Date.now(),
  };

  return NextResponse.json(data, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
    },
  });
}

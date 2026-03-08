import { HomePageContent } from '@/components/HomePageContent';
import { easternToUtc } from '@/utils/easternToUtc';

export interface NowPlayingData {
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

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// Server-side data fetching - called at request time
async function getNowPlaying(): Promise<NowPlayingData> {
  try {
    // Fetch directly from RadioBoss API on the server (faster than internal API route)
    const response = await fetch(RADIOBOSS_API_URL, {
      headers: { 'Accept': 'application/json' },
      // Cache for 30 seconds, revalidate in background
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    // Parse current track from the nested RadioBoss format
    const currentTrack = data.currenttrack_info?.['@attributes'];
    const listeners = data.listeners || Number(currentTrack?.LISTENERS) || 0;

    // Build artwork URL with cache-busting track key
    let artworkUrl = data.links?.artwork || null;
    if (artworkUrl && currentTrack?.TITLE) {
      const trackKey = encodeURIComponent(`${currentTrack.ARTIST}-${currentTrack.TITLE}`);
      artworkUrl = `${artworkUrl}?t=${trackKey}`;
    }

    const nowPlaying = currentTrack?.TITLE ? {
      id: `${currentTrack.ARTIST}-${currentTrack.TITLE}-${Date.now()}`,
      title: currentTrack.TITLE || 'Unknown',
      artist: currentTrack.ARTIST || 'Unknown Artist',
      album: currentTrack.ALBUM || null,
      play_started_at: currentTrack.LASTPLAYED ? easternToUtc(currentTrack.LASTPLAYED) : new Date().toISOString(),
      duration: currentTrack.DURATION || null,
      album_art_url: artworkUrl,
      genre: currentTrack.GENRE || null,
      year: currentTrack.YEAR || null,
    } : null;

    return {
      nowPlaying,
      stationName: data.station_name || 'E.T. Radio',
      listenersCount: listeners,
      isLive: data.live === true,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching now playing:', error);
    // Return fallback data - component will fetch on client side
    return {
      nowPlaying: null,
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: new Date().toISOString(),
    };
  }
}

// This is a Server Component - it fetches data on the server
export default async function HomePage() {
  // Fetch initial data server-side - this runs at request time
  const initialData = await getNowPlaying();

  // Pass the data to the client component
  return <HomePageContent initialData={initialData} />;
}

import { HomePageContent } from '@/components/HomePageContent';

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

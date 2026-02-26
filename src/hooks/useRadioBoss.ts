import { useState, useEffect, useCallback, useRef } from 'react';
import { getInitialNowPlayingFromWindow, getInitialNowPlaying, type InitialNowPlayingData } from '@/lib/getInitialNowPlaying';

const RADIOBOSS_API_URL = '/api/now-playing';
const SMART_POLL_INTERVAL = 10000; // 10 seconds (server cache is 5s, this is fast enough)
const CACHE_KEY = 'heady_radio_cache';

// Load cached data from localStorage
const loadCachedData = (): RadioBossData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cache is less than 5 minutes old
      if (parsed.lastUpdate && Date.now() - new Date(parsed.lastUpdate).getTime() < 5 * 60 * 1000) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load cached data:', err);
  }
  return null;
};

// Save data to localStorage cache
const saveCachedData = (data: RadioBossData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save cached data:', err);
  }
};

// Convert InitialNowPlayingData to RadioBossData format
const convertInitialData = (initial: InitialNowPlayingData): RadioBossData => {
  return {
    nowPlaying: initial.nowPlaying,
    recentTracks: initial.nowPlaying ? [initial.nowPlaying] : [],
    stationName: initial.stationName,
    listenersCount: initial.listenersCount,
    isLive: initial.isLive,
    lastUpdate: new Date(initial.lastUpdate),
  };
};

export interface Transmission {
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
  listeners_count?: number | null;
  created_at?: string | null;
  dj_name?: string | null;
}

export interface RadioBossData {
  nowPlaying: Transmission | null;
  recentTracks: Transmission[];
  stationName: string;
  listenersCount: number;
  isLive: boolean;
  lastUpdate: Date | null;
}

// Type for server-side initial data (matches API route response)
export interface InitialServerData {
  nowPlaying: Transmission | null;
  stationName: string;
  listenersCount: number;
  isLive: boolean;
  lastUpdate: string;
}

export const useRadioBoss = (initialServerData?: InitialServerData) => {
  // Create initial state lazily, prioritizing server data > window data > cache > empty
  const getInitialState = (): RadioBossData => {
    // First priority: Server-side initial data (passed from SSR)
    if (initialServerData?.nowPlaying) {
      return {
        nowPlaying: initialServerData.nowPlaying,
        recentTracks: [initialServerData.nowPlaying],
        stationName: initialServerData.stationName,
        listenersCount: initialServerData.listenersCount,
        isLive: initialServerData.isLive,
        lastUpdate: new Date(initialServerData.lastUpdate),
      };
    }
    
    if (typeof window === 'undefined') {
      // During SSR without initial data
      return {
        nowPlaying: initialServerData?.nowPlaying || null,
        recentTracks: [],
        stationName: initialServerData?.stationName || 'E.T. Radio',
        listenersCount: initialServerData?.listenersCount || 0,
        isLive: initialServerData?.isLive || false,
        lastUpdate: initialServerData ? new Date(initialServerData.lastUpdate) : null,
      };
    }
    
    // Second priority: Window data (legacy approach)
    const windowData = getInitialNowPlayingFromWindow();
    if (windowData) {
      return convertInitialData(windowData);
    }
    
    // Third priority: LocalStorage cache
    const cachedData = loadCachedData();
    if (cachedData) {
      return cachedData;
    }
    
    // Default empty state
    return {
      nowPlaying: null,
      recentTracks: [],
      stationName: 'E.T. Radio',
      listenersCount: 0,
      isLive: false,
      lastUpdate: null,
    };
  };
  
  const [data, setData] = useState<RadioBossData>(getInitialState);
  // Only show loading if we have no initial data at all
  const [isLoading, setIsLoading] = useState(() => {
    // If we have server data, no loading needed
    if (initialServerData?.nowPlaying) return false;
    if (typeof window === 'undefined') return false;
    const windowData = getInitialNowPlayingFromWindow();
    const cachedData = loadCachedData();
    return !windowData && !cachedData;
  });
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(() => {
    // If we have server data, already initialized
    if (initialServerData?.nowPlaying) return true;
    if (typeof window === 'undefined') return false;
    const windowData = getInitialNowPlayingFromWindow();
    const cachedData = loadCachedData();
    return !!windowData || !!cachedData;
  });
  
  // Track logged transmissions with timestamps to avoid re-logging
  // (Client-side logging removed, should be handled by server/Edge API)
  const lastDataRef = useRef<string | null>(null);

  const fetchRadioData = useCallback(async () => {
    try {
      const response = await fetch(RADIOBOSS_API_URL);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const apiData = await response.json();
      
      // Quick check if data actually changed based on our Next.js API shape
      const dataHash = JSON.stringify({
        current: apiData.nowPlaying?.title,
      });
      
      if (lastDataRef.current === dataHash && !isLoading) {
        // Data hasn't changed, skip update
        return;
      }
      
      lastDataRef.current = dataHash;
      setIsLoading(true);
      setError(null);

      const nowPlaying = apiData.nowPlaying as Transmission | null;

      // Use recent tracks from the API (the server-side poller keeps this fresh)
      const recentTracks: Transmission[] = (apiData.recentTracks || []) as Transmission[];

      const newData = {
        nowPlaying,
        recentTracks,
        stationName: apiData.stationName || 'E.T. Radio',
        listenersCount: apiData.listenersCount || 0,
        isLive: apiData.isLive ?? !!nowPlaying,
        lastUpdate: new Date(),
      };
      
      setData(newData);
      saveCachedData(newData); // Save to cache
      setIsInitialized(true);
    } catch (err) {
      console.error('Error fetching radio data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch radio data');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initial fetch - only if we don't have initial data
  useEffect(() => {
    if (!isInitialized) {
      // Try to fetch from Edge Function first (faster, cached)
      getInitialNowPlaying()
        .then((initialData) => {
          if (initialData.nowPlaying) {
            const converted = convertInitialData(initialData);
            setData(converted);
            saveCachedData(converted);
            setIsInitialized(true);
            setIsLoading(false);
          } else {
            // Fall back to direct API call
            fetchRadioData();
          }
        })
        .catch(() => {
          // Fall back to direct API call if Edge Function fails
          fetchRadioData();
        });
    }
  }, [isInitialized, fetchRadioData]);

  // Smart polling - check more frequently but only update if changed
  // Start polling after initial data is loaded
  useEffect(() => {
    if (!isInitialized) return;
    
    const interval = setInterval(fetchRadioData, SMART_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRadioData, isInitialized]);

  return {
    ...data,
    isLoading,
    error,
    refresh: fetchRadioData,
  };
};

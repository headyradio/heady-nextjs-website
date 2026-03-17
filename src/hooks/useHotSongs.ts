import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transmission } from './useRadioBoss';
import { isStationIdTrack } from '@/utils/stationFiltering';

interface HotSong extends Transmission {
  playCount: number;
}

export const useHotSongs = (limit: number = 40) => {
  return useQuery({
    queryKey: ['hot-songs', limit],
    queryFn: async () => {
      // Get transmissions from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('transmissions')
        .select('*')
        .gte('play_started_at', sevenDaysAgo.toISOString())
        .order('play_started_at', { ascending: false })
        .limit(2000);

      if (error) {
        console.error('Error fetching hot songs:', error);
        throw error;
      }

      // Filter out unwanted entries
      const filteredData = data?.filter(transmission => {
        const artist = transmission.artist?.toLowerCase() || '';
        const title = transmission.title?.toLowerCase() || '';

        // Filter out station IDs
        if (isStationIdTrack(transmission)) {
          return false;
        }
        
        // Filter out Unknown Artist and Extraterrestrial Radio
        return !(
          (artist === 'unknown artist' && title === 'unknown') ||
          (artist === 'heady' && title.includes('extraterrestrial radio'))
        );
      });

      // Group by artist + title and count plays
      const songMap = new Map<string, HotSong>();
      
      filteredData?.forEach(transmission => {
        const key = `${transmission.artist.toLowerCase()}-${transmission.title.toLowerCase()}`;
        
        if (songMap.has(key)) {
          const existing = songMap.get(key)!;
          existing.playCount++;
          // Keep the most recent play time
          if (new Date(transmission.play_started_at) > new Date(existing.play_started_at)) {
            songMap.set(key, {
              ...transmission,
              playCount: existing.playCount
            });
          }
        } else {
          songMap.set(key, {
            ...transmission,
            playCount: 1
          });
        }
      });

      // Sort by play count and get top songs
      const topSongs = Array.from(songMap.values())
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, limit);

      // Batch-fetch permanent artwork from the songs table.
      // The album_art_url in transmissions often points to RadioBoss's dynamic
      // artwork endpoint which always serves the *currently playing* track's art,
      // not the original track's art. The songs table has stable TIDAL URLs.
      const songKeys = [...new Set(
        topSongs.map(t => `${t.artist.toLowerCase()}|||${t.title.toLowerCase()}`)
      )];

      if (songKeys.length > 0) {
        const { data: songsData } = await supabase
          .from('songs')
          .select('song_key, album_art_url')
          .in('song_key', songKeys);

        if (songsData) {
          const artworkMap = new Map<string, string>();
          for (const song of songsData) {
            if (song.album_art_url) {
              artworkMap.set(song.song_key, song.album_art_url);
            }
          }

          for (const song of topSongs) {
            const key = `${song.artist.toLowerCase()}|||${song.title.toLowerCase()}`;
            const stableArt = artworkMap.get(key);
            if (stableArt) {
              song.album_art_url = stableArt;
            }
          }
        }
      }

      return topSongs;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (aligned with ISR strategy for homepage)
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};


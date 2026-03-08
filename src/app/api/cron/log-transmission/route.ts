import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchTidalTrack } from '@/lib/tidal';
import { easternToUtc } from '@/utils/easternToUtc';

const RADIOBOSS_API_URL = 'https://c22.radioboss.fm/api/info/364?key=FZPFZ5DNHQOP';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface RadioBossTrack {
  tracktitle: string;
  trackartist: string;
  started: string;
  artworkid?: string;
}

interface RadioBossCurrentTrack {
  TITLE: string;
  ARTIST: string;
  ALBUM?: string;
  LASTPLAYED?: string;
  DURATION?: string;
  GENRE?: string;
  YEAR?: string;
  LISTENERS?: string;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (in production)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch current data from RadioBoss
    const response = await fetch(RADIOBOSS_API_URL, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`RadioBoss API error: ${response.status}`);
    }

    const data = await response.json();
    const logged: string[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    // Parse current track
    const currentTrack: RadioBossCurrentTrack | undefined = data.currenttrack_info?.['@attributes'];
    const recentTracks: RadioBossTrack[] = data.recent || [];
    const listeners = data.listeners || Number(currentTrack?.LISTENERS) || 0;

    // Build artwork URL for current track
    let artworkUrl = data.links?.artwork || null;
    if (artworkUrl && currentTrack?.TITLE) {
      const trackKey = encodeURIComponent(`${currentTrack.ARTIST}-${currentTrack.TITLE}`);
      artworkUrl = `${artworkUrl}?t=${trackKey}`;
    }

    // Collect all tracks to log (current + recent)
    const tracksToLog: Array<{
      title: string;
      artist: string;
      album: string | null;
      play_started_at: string;
      duration: string | null;
      album_art_url: string | null;
      genre: string | null;
      year: string | null;
      artwork_id: string | null;
      listeners_count: number;
    }> = [];

    // Add current track — prefer recent[].started timestamp since LASTPLAYED is often stale
    if (currentTrack?.TITLE && currentTrack?.ARTIST) {
      const matchingRecent = recentTracks.find(
        t => t.tracktitle === currentTrack.TITLE && t.trackartist === currentTrack.ARTIST
      );
      const rawTimestamp = matchingRecent?.started || currentTrack.LASTPLAYED || '';
      const playStartedAt = rawTimestamp ? easternToUtc(rawTimestamp) : new Date().toISOString();

      tracksToLog.push({
        title: currentTrack.TITLE,
        artist: currentTrack.ARTIST,
        album: currentTrack.ALBUM || null,
        play_started_at: playStartedAt,
        duration: currentTrack.DURATION || null,
        album_art_url: artworkUrl,
        genre: currentTrack.GENRE || null,
        year: currentTrack.YEAR || null,
        artwork_id: null,
        listeners_count: listeners,
      });
    }

    // Add recent tracks (convert Eastern Time to UTC)
    // NOTE: RadioBoss artwork data is unreliable for recent tracks — both the
    // artwork URL and artworkid often correspond to the *current* track rather
    // than the actual recent track. We null out both album_art_url and artwork_id
    // so AlbumArtImage falls through to the album-art edge function which
    // looks up the correct art by artist+title.
    for (const track of recentTracks) {
      if (track.tracktitle && track.trackartist) {
        tracksToLog.push({
          title: track.tracktitle,
          artist: track.trackartist,
          album: null,
          play_started_at: track.started ? easternToUtc(track.started) : new Date().toISOString(),
          duration: null,
          album_art_url: null,
          genre: null,
          year: null,
          artwork_id: null,
          listeners_count: listeners,
        });
      }
    }

    // Insert each track (skip duplicates via unique constraint on play_started_at + title + artist)
    for (const track of tracksToLog) {
      try {
        const { error } = await supabase.from('transmissions').insert(track);

        if (error) {
          if (error.code === '23505') {
            skipped.push(`${track.artist} - ${track.title}`);
          } else {
            errors.push(`${track.artist} - ${track.title}: ${error.message}`);
          }
        } else {
          logged.push(`${track.artist} - ${track.title} @ ${track.play_started_at}`);
        }
      } catch (err) {
        errors.push(`${track.artist} - ${track.title}: ${err}`);
      }
    }

    // Upsert unique songs into the songs library + resolve artwork via TIDAL
    const songsUpserted: string[] = [];
    const songsSkipped: string[] = [];

    // Deduplicate tracksToLog by artist+title to avoid redundant lookups
    const seenSongKeys = new Set<string>();
    const uniqueSongs = tracksToLog.filter(track => {
      const key = `${track.artist.toLowerCase()}|||${track.title.toLowerCase()}`;
      if (seenSongKeys.has(key)) return false;
      seenSongKeys.add(key);
      return true;
    });

    for (const track of uniqueSongs) {
      try {
        // Check if song already exists with artwork
        const { data: existingSong } = await supabase
          .from('songs')
          .select('id, album_art_url')
          .ilike('artist', track.artist)
          .ilike('title', track.title)
          .limit(1)
          .single();

        if (existingSong?.album_art_url) {
          songsSkipped.push(`${track.artist} - ${track.title}`);
          continue;
        }

        // Resolve artwork via TIDAL API (only for new or artless songs)
        let albumArtUrl: string | null = null;
        let tidalTrackId: string | null = null;
        let albumName: string | null = track.album;

        try {
          const tidalResult = await searchTidalTrack(track.artist, track.title);
          if (tidalResult) {
            albumArtUrl = tidalResult.albumArtUrl;
            tidalTrackId = tidalResult.tidalTrackId;
            albumName = tidalResult.album || track.album;
          }
        } catch (tidalErr) {
          console.error(`[Cron] TIDAL lookup failed for ${track.artist} - ${track.title}:`, tidalErr);
        }

        if (existingSong) {
          // Song exists but has no artwork — update it
          await supabase
            .from('songs')
            .update({
              album_art_url: albumArtUrl,
              tidal_track_id: tidalTrackId,
              album: albumName || undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingSong.id);
        } else {
          // New song — insert it
          await supabase.from('songs').insert({
            artist: track.artist,
            title: track.title,
            album: albumName,
            album_art_url: albumArtUrl,
            tidal_track_id: tidalTrackId,
            genre: track.genre,
            year: track.year,
            duration: track.duration,
          });
        }

        songsUpserted.push(`${track.artist} - ${track.title}${albumArtUrl ? ' (art found)' : ' (no art)'}`);
      } catch (err) {
        console.error(`[Cron] Song upsert failed: ${track.artist} - ${track.title}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      logged,
      skipped,
      errors,
      totalTracksChecked: tracksToLog.length,
      songsUpserted,
      songsSkipped,
    });
  } catch (error) {
    console.error('[Cron] Failed to log transmissions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

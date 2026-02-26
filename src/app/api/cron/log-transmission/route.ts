import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

/**
 * RadioBoss returns timestamps in Eastern Time (America/New_York, UTC-5 EST / UTC-4 EDT).
 * The DB stores everything in UTC. Convert before inserting.
 * Format from RadioBoss: "2026-02-26 03:22:12"
 */
function easternToUtc(easternTimestamp: string): string {
  if (!easternTimestamp) return new Date().toISOString();
  // Append '-05:00' (EST) offset — RadioBoss is in New York
  // During EDT (March-Nov) it's -04:00, but using -05:00 is consistent with
  // how the old Edge Function handled it (fromZonedTime with America/New_York)
  const withOffset = easternTimestamp.replace(' ', 'T') + '-05:00';
  const date = new Date(withOffset);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

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
    for (const track of recentTracks) {
      if (track.tracktitle && track.trackartist) {
        tracksToLog.push({
          title: track.tracktitle,
          artist: track.trackartist,
          album: null,
          play_started_at: track.started ? easternToUtc(track.started) : new Date().toISOString(),
          duration: null,
          album_art_url: track.artworkid
            ? `https://c22.radioboss.fm/w/artwork/${track.artworkid}/364.jpg`
            : null,
          genre: null,
          year: null,
          artwork_id: track.artworkid || null,
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

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      logged,
      skipped,
      errors,
      totalTracksChecked: tracksToLog.length,
    });
  } catch (error) {
    console.error('[Cron] Failed to log transmissions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

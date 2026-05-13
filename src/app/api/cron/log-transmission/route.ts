import { NextResponse } from 'next/server';
import { searchTidalTrack } from '@/lib/tidal';
import { easternToUtc } from '@/utils/easternToUtc';

const RADIOBOSS_API_URL = process.env.RADIOBOSS_URL!;
const EDGE_FUNCTION_URL = process.env.LOVABLE_LOG_TRANSMISSION_URL!;

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

interface TransmissionRow {
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
}

interface SongRow {
  artist: string;
  title: string;
  album: string | null;
  album_art_url: string | null;
  tidal_track_id: string | null;
  genre: string | null;
  year: string | null;
  duration: string | null;
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

    const currentTrack: RadioBossCurrentTrack | undefined = data.currenttrack_info?.['@attributes'];
    const recentTracks: RadioBossTrack[] = data.recent || [];
    const listeners = data.listeners || Number(currentTrack?.LISTENERS) || 0;

    // Build artwork URL for current track
    let artworkUrl = data.links?.artwork || null;
    if (artworkUrl && currentTrack?.TITLE) {
      const trackKey = encodeURIComponent(`${currentTrack.ARTIST}-${currentTrack.TITLE}`);
      artworkUrl = `${artworkUrl}?t=${trackKey}`;
    }

    // Collect transmissions (current + recent)
    const transmissions: TransmissionRow[] = [];

    // Current track — prefer recent[].started timestamp since LASTPLAYED is often stale
    if (currentTrack?.TITLE && currentTrack?.ARTIST) {
      const matchingRecent = recentTracks.find(
        t => t.tracktitle === currentTrack.TITLE && t.trackartist === currentTrack.ARTIST
      );
      const rawTimestamp = matchingRecent?.started || currentTrack.LASTPLAYED || '';
      const playStartedAt = rawTimestamp ? easternToUtc(rawTimestamp) : new Date().toISOString();

      transmissions.push({
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

    // Recent tracks — RadioBoss artwork is unreliable for these; let the
    // album-art edge function resolve by artist+title at read time.
    for (const track of recentTracks) {
      if (track.tracktitle && track.trackartist) {
        transmissions.push({
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

    // Deduplicate by artist+title and resolve TIDAL artwork for the songs library
    const seenSongKeys = new Set<string>();
    const songs: SongRow[] = [];

    for (const t of transmissions) {
      const key = `${t.artist.toLowerCase()}|||${t.title.toLowerCase()}`;
      if (seenSongKeys.has(key)) continue;
      seenSongKeys.add(key);

      let albumArtUrl: string | null = null;
      let tidalTrackId: string | null = null;
      let albumName: string | null = t.album;

      try {
        const tidalResult = await searchTidalTrack(t.artist, t.title);
        if (tidalResult) {
          albumArtUrl = tidalResult.albumArtUrl;
          tidalTrackId = tidalResult.tidalTrackId;
          albumName = tidalResult.album || t.album;
        }
      } catch (tidalErr) {
        console.error(`[Cron] TIDAL lookup failed for ${t.artist} - ${t.title}:`, tidalErr);
      }

      songs.push({
        artist: t.artist,
        title: t.title,
        album: albumName,
        album_art_url: albumArtUrl,
        tidal_track_id: tidalTrackId,
        genre: t.genre,
        year: t.year,
        duration: t.duration,
      });
    }

    // Forward to the Lovable Edge Function which holds the service role key
    const edgeResponse = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SHARED_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transmissions, songs }),
    });

    if (!edgeResponse.ok) {
      const errorText = await edgeResponse.text();
      throw new Error(`Edge Function ${edgeResponse.status}: ${errorText}`);
    }

    const result = await edgeResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Cron] Failed to log transmissions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchTidalTrack } from '@/lib/tidal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for batch processing

export async function GET(request: Request) {
  // Protect with CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: songs, error } = await supabase
    .from('songs')
    .select('id, artist, title')
    .is('album_art_url', null)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!songs || songs.length === 0) {
    return NextResponse.json({ message: 'All songs have artwork!', remaining: 0 });
  }

  const results: Array<{ song: string; status: string }> = [];

  for (const song of songs) {
    try {
      const tidalResult = await searchTidalTrack(song.artist, song.title);

      if (tidalResult) {
        await supabase
          .from('songs')
          .update({
            album_art_url: tidalResult.albumArtUrl,
            tidal_track_id: tidalResult.tidalTrackId,
            album: tidalResult.album,
            updated_at: new Date().toISOString(),
          })
          .eq('id', song.id);

        results.push({ song: `${song.artist} - ${song.title}`, status: 'found' });
      } else {
        // Mark as attempted so we don't retry endlessly — set a placeholder
        // that will be skipped by the "album_art_url IS NULL" filter
        // Actually, leave as null so it can retry when TIDAL catalog updates
        results.push({ song: `${song.artist} - ${song.title}`, status: 'not_found' });
      }
    } catch (err) {
      results.push({ song: `${song.artist} - ${song.title}`, status: `error: ${err}` });
    }
  }

  // Count remaining songs without artwork
  const { count } = await supabase
    .from('songs')
    .select('id', { count: 'exact', head: true })
    .is('album_art_url', null);

  return NextResponse.json({
    processed: results.length,
    found: results.filter(r => r.status === 'found').length,
    notFound: results.filter(r => r.status === 'not_found').length,
    remaining: count,
    results,
  });
}

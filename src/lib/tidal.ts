// NOTE: This module uses the iTunes Search API for artwork resolution.
// The TIDAL Developer API credentials are provisioned but not yet granted catalog access
// (client credentials return empty scope). Swap back to TIDAL once access is approved.

export interface TidalTrackResult {
  albumArtUrl: string;
  tidalTrackId: string;
  album: string | null;
}

/**
 * Normalize a string for fuzzy comparison: lowercase, remove punctuation, collapse whitespace.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Search iTunes for a track by artist and title.
 * Returns album art URL (600x600), a track ID, and album name — or null if not found.
 * Uses the same interface as the future TIDAL implementation.
 */
export async function searchTidalTrack(
  artist: string,
  title: string,
): Promise<TidalTrackResult | null> {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const url = `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=5`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      console.error(`[iTunes] Search failed (${response.status})`);
      return null;
    }

    const data = await response.json();
    const results: any[] = data.results || [];

    if (results.length === 0) {
      return null;
    }

    // Find the best matching track
    const normalizedArtist = normalize(artist);
    const normalizedTitle = normalize(title);

    let bestResult: any = null;
    let bestScore = -1;

    for (const result of results) {
      const trackTitle = normalize(result.trackName || '');
      const trackArtist = normalize(result.artistName || '');

      let score = 0;
      if (trackTitle === normalizedTitle) score += 2;
      else if (trackTitle.includes(normalizedTitle) || normalizedTitle.includes(trackTitle)) score += 1;

      if (trackArtist === normalizedArtist) score += 2;
      else if (trackArtist.includes(normalizedArtist) || normalizedArtist.includes(trackArtist)) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestResult = result;
      }
    }

    // Require at least a partial match on both artist and title
    if (!bestResult || bestScore < 2) {
      return null;
    }

    const artworkUrl100: string = bestResult.artworkUrl100 || '';
    if (!artworkUrl100) {
      return null;
    }

    // Upgrade to 600x600
    const albumArtUrl = artworkUrl100.replace('100x100bb', '600x600bb');

    return {
      albumArtUrl,
      tidalTrackId: String(bestResult.trackId || bestResult.collectionId || ''),
      album: bestResult.collectionName || null,
    };
  } catch (err) {
    console.error('[iTunes] Search error:', err);
    return null;
  }
}

const TIDAL_AUTH_URL = 'https://auth.tidal.com/v1/oauth2/token';
const TIDAL_API_URL = 'https://openapi.tidal.com/v2';

// Module-level token cache (persists across requests in serverless warm starts)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export interface TidalTrackResult {
  albumArtUrl: string;
  tidalTrackId: string;
  album: string | null;
}

/**
 * Get a TIDAL API access token using client credentials flow.
 * Caches the token until it expires.
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.TIDAL_CLIENT_ID;
  const clientSecret = process.env.TIDAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('TIDAL_CLIENT_ID and TIDAL_CLIENT_SECRET must be set');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(TIDAL_AUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`TIDAL auth failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 5 minutes early to avoid edge cases
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken!;
}

/**
 * Convert a TIDAL album cover UUID to an image URL.
 * UUID format: "9a56f482-e9cf-46c3-bb21-82710e7854d4"
 * URL format: "https://resources.tidal.com/images/9a56f482/e9cf/46c3/bb21/82710e7854d4/640x640.jpg"
 */
function coverUuidToUrl(uuid: string, size = '640x640'): string {
  return `https://resources.tidal.com/images/${uuid.replaceAll('-', '/')}/${size}.jpg`;
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
 * Search TIDAL for a track by artist and title.
 * Returns the album art URL, TIDAL track ID, and album name, or null if not found.
 */
export async function searchTidalTrack(
  artist: string,
  title: string,
): Promise<TidalTrackResult | null> {
  try {
    const token = await getAccessToken();
    const query = encodeURIComponent(`${artist} ${title}`);

    const response = await fetch(
      `${TIDAL_API_URL}/searchresults/${query}?countryCode=US&include=tracks,tracks.albums`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.tidal.v1+json',
          'Content-Type': 'application/vnd.tidal.v1+json',
        },
      },
    );

    if (!response.ok) {
      console.error(`[TIDAL] Search failed (${response.status}): ${await response.text()}`);
      return null;
    }

    const json = await response.json();

    // JSON:API format — tracks are in the `included` array with type "tracks"
    const included: any[] = json.included || [];
    const tracks = included.filter((item: any) => item.type === 'tracks');
    const albums = included.filter((item: any) => item.type === 'albums');

    if (tracks.length === 0) {
      return null;
    }

    // Find the best matching track
    const normalizedArtist = normalize(artist);
    const normalizedTitle = normalize(title);

    let bestTrack: any = null;
    let bestScore = -1;

    for (const track of tracks) {
      const attrs = track.attributes || {};
      const trackTitle = normalize(attrs.title || '');
      const trackArtistName = normalize(attrs.artistName || '');

      // Score: exact title match = 2, partial title match = 1
      // Plus: exact artist match = 2, partial artist match = 1
      let score = 0;
      if (trackTitle === normalizedTitle) score += 2;
      else if (trackTitle.includes(normalizedTitle) || normalizedTitle.includes(trackTitle)) score += 1;

      if (trackArtistName === normalizedArtist) score += 2;
      else if (trackArtistName.includes(normalizedArtist) || normalizedArtist.includes(trackArtistName)) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestTrack = track;
      }
    }

    // Require at least some match (title or artist partial match)
    if (!bestTrack || bestScore < 2) {
      return null;
    }

    // Find the album for this track
    const trackAlbumRel = bestTrack.relationships?.albums?.data?.[0];
    let coverUrl: string | null = null;
    let albumName: string | null = null;

    if (trackAlbumRel) {
      const album = albums.find(
        (a: any) => a.id === trackAlbumRel.id,
      );
      if (album?.attributes?.imageCover) {
        // imageCover is an array of image objects with url and dimensions
        const images = album.attributes.imageCover;
        // Prefer 640x640, fall back to largest available
        const preferred = images.find((img: any) => img.width === 640) || images[images.length - 1];
        if (preferred?.url) {
          coverUrl = preferred.url;
        }
      }
      // Fallback: try the cover UUID pattern if imageCover isn't in the response
      if (!coverUrl && album?.attributes?.cover) {
        coverUrl = coverUuidToUrl(album.attributes.cover);
      }
      albumName = album?.attributes?.title || null;
    }

    if (!coverUrl) {
      return null;
    }

    return {
      albumArtUrl: coverUrl,
      tidalTrackId: bestTrack.id,
      album: albumName,
    };
  } catch (err) {
    console.error('[TIDAL] Search error:', err);
    return null;
  }
}

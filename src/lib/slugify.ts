/**
 * URL slug utilities for SEO-friendly URLs.
 *
 * Converts human-readable names to lowercase, hyphenated slugs:
 *   "Florence + The Machine" → "florence-the-machine"
 *   "Elderberry Wine"        → "elderberry-wine"
 *   "Alt-J"                  → "alt-j"
 *
 * For reverse lookups (slug → database record), we use a wildcard search
 * pattern so that stripped characters (like `+`, `&`, `'`) don't prevent matches.
 */

/**
 * Convert a human-readable name into an SEO-friendly URL slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[+&]/g, ' ')          // treat + and & as spaces
    .replace(/[^\w\s-]/g, '')       // remove remaining special chars
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse consecutive hyphens
    .replace(/^-|-$/g, '');         // trim leading/trailing hyphens
}

/**
 * Convert a slug into a SQL ILIKE pattern for flexible matching.
 * Each hyphen becomes a `%` wildcard so stripped characters are tolerated.
 *
 *   "florence-the-machine" → "%florence%the%machine%"
 *   "alt-j"                → "%alt%j%"
 */
export function slugToSearchPattern(slug: string): string {
  return '%' + slug.split('-').join('%') + '%';
}

// ---------------------------------------------------------------------------
// Centralised URL builders — every link in the app should use these.
// ---------------------------------------------------------------------------

export function songUrl(artist: string, title: string): string {
  return `/song/${slugify(artist)}/${slugify(title)}`;
}

export function artistUrl(artist: string): string {
  return `/artist/${slugify(artist)}`;
}

export function absoluteSongUrl(artist: string, title: string): string {
  return `https://heady.fm${songUrl(artist, title)}`;
}

export function absoluteArtistUrl(artist: string): string {
  return `https://heady.fm${artistUrl(artist)}`;
}

import { NextRequest, NextResponse } from 'next/server';
import { slugify } from '@/lib/slugify';

/**
 * Middleware that 301-redirects old-style URLs (with %20, uppercase, or
 * special characters) to their canonical slugified form.
 *
 *   /song/Florence%20%2B%20The%20Machine/Ship%20To%20Wreck
 *   → /song/florence-the-machine/ship-to-wreck
 *
 *   /artist/Florence%20%2B%20The%20Machine
 *   → /artist/florence-the-machine
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process /song/ and /artist/ routes
  const songMatch = pathname.match(/^\/song\/([^/]+)\/([^/]+)$/);
  const artistMatch = pathname.match(/^\/artist\/([^/]+)$/);

  if (songMatch) {
    const rawArtist = decodeURIComponent(songMatch[1]);
    const rawTitle = decodeURIComponent(songMatch[2]);
    const slugArtist = slugify(rawArtist);
    const slugTitle = slugify(rawTitle);
    const canonical = `/song/${slugArtist}/${slugTitle}`;

    if (pathname !== canonical) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 301);
    }
  }

  if (artistMatch) {
    const rawArtist = decodeURIComponent(artistMatch[1]);
    const slugArtist = slugify(rawArtist);
    const canonical = `/artist/${slugArtist}`;

    if (pathname !== canonical) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/song/:artist/:title', '/artist/:artistName'],
};

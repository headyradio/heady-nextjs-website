import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { slugify } from '@/lib/slugify';

/**
 * Middleware handles two concerns:
 * 1. Server-side auth guard for /admin routes — redirects unauthenticated
 *    visitors to /admin/login before any client JS runs.
 * 2. 301 canonicalization for /song/ and /artist/ URLs (slugify).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth guard ────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // ── URL canonicalization for /song/ and /artist/ routes ────────────────────
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
  matcher: ['/admin/:path*', '/song/:artist/:title', '/artist/:artistName'],
};

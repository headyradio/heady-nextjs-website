import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xpqwujjglvhadlgxotcv.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'coverartarchive.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'c22.radioboss.fm',
      },
      {
        protocol: 'https',
        hostname: 'resources.tidal.com',
      },
      {
        protocol: 'https',
        hostname: '*.mzstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbnailer.mixcloud.com',
      },
      {
        // Bunny Stream CDN (hero video posters). Bunny Optimizer is off on this zone,
        // so route posters through Next/Image to right-size + serve WebP.
        protocol: 'https',
        hostname: 'vz-dfce7f34-8cf.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;

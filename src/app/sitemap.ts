import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { sitemapArticlesQuery } from '@/lib/sanity/queries';
import { createServerSupabaseClient } from '@/integrations/supabase/server';
import { absoluteArtistUrl, absoluteSongUrl } from '@/lib/slugify';

interface SitemapArticle {
  slug: string;
  publishedAt: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://heady.fm';

  // Fetch all articles from Sanity
  const articles = await sanityFetch<SitemapArticle[]>({
    query: sitemapArticlesQuery,
    revalidate: 3600, // Rebuild sitemap hourly
    tags: ['articles'],
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/headyzine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playlist`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hot-40`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shows`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mixtapes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/meetups`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Article pages — high priority, with real last-modified dates
  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${baseUrl}/headyzine/${article.slug}`,
    lastModified: new Date(article._updatedAt || article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch distinct artists and songs from Supabase for dynamic pages
  const supabase = createServerSupabaseClient();

  // Get distinct artists
  const { data: artistRows } = await supabase
    .from('transmissions')
    .select('artist')
    .order('artist');

  const uniqueArtists = [...new Set((artistRows ?? []).map((r) => r.artist))];
  const artistPages: MetadataRoute.Sitemap = uniqueArtists.map((artist) => ({
    url: absoluteArtistUrl(artist),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Get distinct artist+title combinations
  const { data: songRows } = await supabase
    .from('transmissions')
    .select('artist, title')
    .order('artist');

  const songSet = new Set<string>();
  const songPages: MetadataRoute.Sitemap = [];
  (songRows ?? []).forEach((r) => {
    const key = `${r.artist.toLowerCase()}|||${r.title.toLowerCase()}`;
    if (!songSet.has(key)) {
      songSet.add(key);
      songPages.push({
        url: absoluteSongUrl(r.artist, r.title),
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      });
    }
  });

  return [...staticPages, ...articlePages, ...artistPages, ...songPages];
}

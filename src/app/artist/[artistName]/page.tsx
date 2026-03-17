import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/integrations/supabase/server";
import { generateArtistStructuredData, generateBreadcrumbStructuredData } from "@/lib/structuredData";
import { slugToSearchPattern, absoluteArtistUrl } from "@/lib/slugify";
import ArtistPageClient from "./ArtistPageClient";

interface ArtistPageProps {
  params: Promise<{ artistName: string }>;
}

async function getArtistData(artistSlug: string) {
  const supabase = createServerSupabaseClient();
  const artistPattern = slugToSearchPattern(artistSlug);

  const { data, error } = await supabase
    .from("transmissions")
    .select("*")
    .ilike("artist", artistPattern)
    .order("play_started_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;

  // Now use the real artist name for the full query
  const realArtist = data[0].artist;

  const { data: allData } = await supabase
    .from("transmissions")
    .select("title, genre")
    .ilike("artist", realArtist);

  const songSet = new Set<string>();
  const genres = new Set<string>();
  (allData ?? []).forEach((t) => {
    songSet.add(t.title.toLowerCase());
    if (t.genre) genres.add(t.genre);
  });

  return {
    artist: realArtist,
    totalPlays: allData?.length ?? 0,
    uniqueSongs: songSet.size,
    genres: Array.from(genres),
  };
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { artistName: artistSlug } = await params;
  const artistData = await getArtistData(artistSlug);

  if (!artistData) {
    return {
      title: "Artist Not Found",
      description: "No information found for this artist on HEADY.FM.",
    };
  }

  const description = `${artistData.artist} on HEADY.FM — ${artistData.uniqueSongs} song${artistData.uniqueSongs !== 1 ? "s" : ""} played ${artistData.totalPlays} time${artistData.totalPlays !== 1 ? "s" : ""}. Discover their music on commercial-free indie radio.`;
  const canonicalUrl = absoluteArtistUrl(artistData.artist);

  return {
    title: artistData.artist,
    description,
    openGraph: {
      title: `${artistData.artist} on HEADY.FM`,
      description,
      url: canonicalUrl,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${artistData.artist} on HEADY.FM`,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export const revalidate = 3600; // ISR: revalidate every hour

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistName: artistSlug } = await params;
  const artistData = await getArtistData(artistSlug);

  const artistName = artistData?.artist ?? artistSlug;

  const artistStructuredData = artistData
    ? generateArtistStructuredData({
        name: artistName,
        url: absoluteArtistUrl(artistName),
        genre: artistData.genres.length > 0 ? artistData.genres : undefined,
        totalPlays: artistData.totalPlays,
        uniqueSongs: artistData.uniqueSongs,
      })
    : null;

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://heady.fm" },
    { name: artistName, url: absoluteArtistUrl(artistName) },
  ]);

  return (
    <>
      {artistStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(artistStructuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <ArtistPageClient artistName={artistName} />
    </>
  );
}

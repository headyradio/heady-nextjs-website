import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/integrations/supabase/server";
import { generateSongStructuredData, generateBreadcrumbStructuredData } from "@/lib/structuredData";
import { slugToSearchPattern, absoluteSongUrl, absoluteArtistUrl } from "@/lib/slugify";
import SongPageClient from "./SongPageClient";

interface SongPageProps {
  params: Promise<{ artist: string; title: string }>;
}

async function getSongData(artistSlug: string, titleSlug: string) {
  const supabase = createServerSupabaseClient();
  const artistPattern = slugToSearchPattern(artistSlug);
  const titlePattern = slugToSearchPattern(titleSlug);

  const { data, error } = await supabase
    .from("transmissions")
    .select("*")
    .ilike("artist", artistPattern)
    .ilike("title", titlePattern)
    .order("play_started_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;

  // Get total play count using the real names from the matched record
  const { count } = await supabase
    .from("transmissions")
    .select("*", { count: "exact", head: true })
    .ilike("artist", data[0].artist)
    .ilike("title", data[0].title);

  return {
    transmission: data[0],
    playCount: count ?? 1,
  };
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { artist: artistSlug, title: titleSlug } = await params;
  const songData = await getSongData(artistSlug, titleSlug);

  if (!songData) {
    return {
      title: "Song Not Found",
      description: "This song hasn't been played on HEADY.FM yet.",
    };
  }

  const { transmission, playCount } = songData;
  const artist = transmission.artist;
  const title = transmission.title;
  const description = `Listen to ${title} by ${artist}${transmission.album ? ` from the album ${transmission.album}` : ""}. Played ${playCount} time${playCount !== 1 ? "s" : ""} on HEADY.FM.`;
  const canonicalUrl = absoluteSongUrl(artist, title);

  return {
    title: `${title} by ${artist}`,
    description,
    openGraph: {
      title: `${title} by ${artist}`,
      description,
      url: canonicalUrl,
      type: "music.song",
      ...(transmission.album_art_url && {
        images: [{ url: transmission.album_art_url, alt: `${title} album art` }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} by ${artist}`,
      description,
      ...(transmission.album_art_url && {
        images: [transmission.album_art_url],
      }),
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export const revalidate = 3600; // ISR: revalidate every hour

export default async function SongPage({ params }: SongPageProps) {
  const { artist: artistSlug, title: titleSlug } = await params;
  const songData = await getSongData(artistSlug, titleSlug);

  // Resolve real names from DB (fall back to deslugified params)
  const artist = songData?.transmission.artist ?? artistSlug;
  const title = songData?.transmission.title ?? titleSlug;

  const songStructuredData = songData
    ? generateSongStructuredData({
        title,
        artist,
        album: songData.transmission.album ?? undefined,
        image: songData.transmission.album_art_url ?? undefined,
        url: absoluteSongUrl(artist, title),
        genre: songData.transmission.genre ?? undefined,
        playCount: songData.playCount,
      })
    : null;

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://heady.fm" },
    { name: artist, url: absoluteArtistUrl(artist) },
    { name: title, url: absoluteSongUrl(artist, title) },
  ]);

  return (
    <>
      {songStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(songStructuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <SongPageClient artist={artist} title={title} />
    </>
  );
}

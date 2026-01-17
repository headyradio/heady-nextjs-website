"use client";

import { useParams } from "next/navigation";
import { useSongDetails, useSongContent } from "@/hooks/useSongDetails";
import { useGeniusSongData } from "@/hooks/useGeniusSongData";
import { useGeniusArtistData } from "@/hooks/useGeniusArtistData";
import { useArtistTopSongs } from "@/hooks/useArtistTopSongs";
import { useArtistDetails } from "@/hooks/useArtistDetails";
import Navigation from "@/components/Navigation";
import { SongHeroSection } from "@/components/SongHeroSection";
import { AboutTheTrack } from "@/components/AboutTheTrack";
import { AboutTheArtist } from "@/components/AboutTheArtist";
import { MoreFromArtist } from "@/components/MoreFromArtist";
import { PlayHistoryTimeline } from "@/components/PlayHistoryTimeline";
import { SongComments } from "@/components/SongComments";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function SongPage() {
  const params = useParams<{ artist: string; title: string }>();
  const artist = decodeURIComponent(params.artist || "");
  const title = decodeURIComponent(params.title || "");
  
  const songDetails = useSongDetails(artist, title);
  const songContent = useSongContent(artist, title);
  const geniusSongData = useGeniusSongData(artist, title);
  const geniusArtistData = useGeniusArtistData(artist);
  const artistDetails = useArtistDetails(artist);
  
  const artistTopSongs = useArtistTopSongs(artist, title, 10);

  if (songDetails.isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8 bg-white/10" />
          <Skeleton className="h-96 w-full mb-8 bg-white/10" />
          <Skeleton className="h-64 w-full mb-8 bg-white/10" />
        </div>
      </div>
    );
  }

  if (!songDetails.data || songDetails.data.transmissions.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Song Not Found</h1>
            <p className="text-white/60 mb-6">
              This song hasn&apos;t been played on HEADY.FM yet.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:scale-105"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { transmissions, playCount, lastPlayed, uniqueDJs } = songDetails.data;
  const latestTransmission = transmissions[0];

  const headyArtistStats = {
    totalPlays: artistDetails.data?.totalPlays || 0,
    uniqueSongs: artistDetails.data?.songs?.length || 0,
    firstPlayed: artistDetails.data?.songs?.[artistDetails.data.songs.length - 1]?.last_played || null,
    lastPlayed: artistDetails.data?.songs?.[0]?.last_played || null,
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* SEO H1 */}
      <h1 className="sr-only">{title} by {artist} - HEADY.FM</h1>
      
      {/* Breadcrumb Navigation - with purple gradient background */}
      <div className="bg-gradient-to-b from-[#4a148c] to-purple-900/60">
        <div className="container mx-auto px-4 pt-6 pb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-white/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white/60 hover:text-white">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/artist/${encodeURIComponent(artist)}`} className="text-white/60 hover:text-white">
                  {artist}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <SongHeroSection
        title={title}
        artist={artist}
        album={latestTransmission.album ?? undefined}
        year={latestTransmission.year ?? undefined}
        artworkId={latestTransmission.artwork_id ?? undefined}
        albumArtUrl={latestTransmission.album_art_url ?? undefined}
        playCount={playCount}
        uniqueDJs={uniqueDJs}
        lastPlayed={lastPlayed}
        genres={latestTransmission.genre ? [latestTransmission.genre] : undefined}
        createdAt={latestTransmission.created_at}
      />
      
      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Track Diary / Comments - Moved to top priority */}
        <SongComments artist={artist} title={title} />

        {/* About the Track */}
        <AboutTheTrack
          geniusData={geniusSongData.data ?? undefined}
          aiContent={songContent.data ?? undefined}
          duration={latestTransmission.duration ?? undefined}
        />

        {/* About the Artist */}
        <AboutTheArtist
          artistName={artist}
          geniusData={geniusArtistData.data ?? undefined}
          aiContent={undefined}
          headyStats={headyArtistStats}
        />

        {/* More from Artist */}
        <MoreFromArtist
          artistName={artist}
          songs={artistTopSongs.data || []}
          isLoading={artistTopSongs.isLoading}
        />

        {/* Play History Timeline - Last 5 plays only */}
        <PlayHistoryTimeline transmissions={transmissions.slice(0, 5) as any} />
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

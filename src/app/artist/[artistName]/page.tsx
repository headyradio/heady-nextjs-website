"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useArtistDetails, useArtistContent } from "@/hooks/useArtistDetails";
import { useCombinedArtistData } from "@/hooks/useCombinedArtistData";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Clock, Radio, Users, Disc, TrendingUp, Calendar, Sparkles, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlbumArtImage } from "@/components/AlbumArtImage";
import SaveSongButton from "@/components/SaveSongButton";
import { getSpotifySearchUrl, getYouTubeSearchUrl } from "@/lib/musicServiceLinks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ArtistPage() {
  const params = useParams<{ artistName: string }>();
  const artistName = decodeURIComponent(params.artistName || "");
  const { data: artistDetails, isLoading: isLoadingDetails } = useArtistDetails(artistName);
  const { data: artistContent, isLoading: isLoadingContent } = useArtistContent(artistName);
  const artistData = useCombinedArtistData(artistName);

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6 bg-white/10" />
          <Skeleton className="h-64 w-full mb-6 bg-white/10" />
          <Skeleton className="h-96 w-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (!artistDetails) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h2 className="text-2xl font-bold text-white mb-2">Artist Not Found</h2>
            <p className="text-white/60 mb-4">
              No information found for this artist.
            </p>
            <Link href="/" className="text-primary hover:text-primary/80 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-b from-[#4a148c] to-purple-900/60">
        <div className="container mx-auto px-4 pt-6 pb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-white/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white/60 hover:text-white transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{artistDetails.artist}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Artist Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a148c] via-purple-900/80 to-black overflow-hidden">
          {artistData.image && (
            <div 
              className="absolute inset-0 opacity-30 blur-3xl scale-150"
              style={{
                backgroundImage: `url(${artistData.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
              {/* Artist Image */}
              <div className="relative flex-shrink-0 group">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10">
                  {artistData.isLoadingMusicBrainz ? (
                    <Skeleton className="w-full h-full bg-white/10" />
                  ) : artistData.image ? (
                    <img 
                      src={artistData.image} 
                      alt={`${artistDetails.artist} artist photo`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                      <Music className="w-20 h-20 text-white/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm text-white/80">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Artist</span>
                  {artistData.country && (
                    <>
                      <span className="text-white/40">•</span>
                      <Globe className="w-3 h-3" />
                      <span>{artistData.country}</span>
                    </>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  {artistDetails.artist}
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a 
                    href={getSpotifySearchUrl(artistDetails.artist, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold transition-all hover:scale-105"
                  >
                    Spotify
                  </a>
                  <a 
                    href={getYouTubeSearchUrl(artistDetails.artist, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all hover:scale-105"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Disc className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-black text-white">{artistDetails.totalUniqueSongs}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Songs</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-accent" />
                <div className="text-3xl font-black text-white">{artistDetails.totalPlays}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Plays</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Radio className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <div className="text-3xl font-black text-white">{artistDetails.uniqueDJs?.length || 0}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">DJs</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-lg font-bold text-white">
                  {artistDetails.firstPlayed ? formatDistanceToNow(new Date(artistDetails.firstPlayed)) : 'N/A'}
                </div>
                <div className="text-sm text-white/50 uppercase tracking-wider">First Played</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-lg font-bold text-white">
                  {artistDetails.lastPlayed ? formatDistanceToNow(new Date(artistDetails.lastPlayed)) : 'N/A'}
                </div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Last Played</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {(artistData.bio || artistData.genres?.length > 0) && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black text-white">About the Artist</h2>
            </div>
            
            {artistData.bio && (
              <p className="text-white/80 leading-relaxed mb-6">
                {artistData.bio.replace(/<[^>]*>/g, '').substring(0, 600)}
                {artistData.bio.length > 600 && '...'}
              </p>
            )}

            {artistData.genres && artistData.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artistData.genres.slice(0, 10).map((genre: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-semibold text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Songs List */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black text-white uppercase">All Songs</h2>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/10">
            {artistDetails.songs?.map((song: any, index: number) => (
              <div key={song.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                <Link 
                  href={`/song/${encodeURIComponent(artistDetails.artist)}/${encodeURIComponent(song.title)}`}
                  className="flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden ring-1 ring-white/10">
                    <AlbumArtImage
                      url={song.album_art_url}
                      artworkId={song.artwork_id}
                      artist={artistDetails.artist}
                      title={song.title}
                      alt={`${song.title} album art`}
                      className="w-full h-full object-cover"
                      fallbackClassName="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20"
                    />
                  </div>
                </Link>
                
                <div className="flex-grow min-w-0">
                  <Link href={`/song/${encodeURIComponent(artistDetails.artist)}/${encodeURIComponent(song.title)}`}>
                    <h3 className="font-bold text-white hover:text-primary transition-colors truncate">
                      {song.title}
                    </h3>
                  </Link>
                  <div className="text-sm text-white/50">
                    {song.album && <span>{song.album}</span>}
                    {song.year && <span> • {song.year}</span>}
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-white/50">
                  <Radio className="w-4 h-4" />
                  <span className="font-bold">{song.play_count}</span>
                </div>

                <SaveSongButton
                  artist={artistDetails.artist}
                  title={song.title}
                  album={song.album}
                  albumArtUrl={song.album_art_url}
                  artworkId={song.artwork_id}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}

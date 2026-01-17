"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSavedSongs } from "@/hooks/useSavedSongs";
import Navigation from "@/components/Navigation";
import { TransmissionCard } from "@/components/TransmissionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Heart, Music } from "lucide-react";
import Link from "next/link";

export default function SavedSongsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { savedSongs, isLoading: songsLoading } = useSavedSongs();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6 bg-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-white/10 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Saved Songs
          </h1>
        </div>
        
        {songsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-white/10 rounded-2xl" />
            ))}
          </div>
        ) : savedSongs && savedSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedSongs.map((song: any, index: number) => (
              <TransmissionCard key={song.id} transmission={song} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h2 className="text-xl font-bold text-white mb-2">No saved songs yet</h2>
            <p className="text-white/60 mb-6">
              Click the heart icon on any song to save it here
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:scale-105"
            >
              Discover Music
            </Link>
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

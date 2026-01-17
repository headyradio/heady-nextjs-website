"use client";

import { useHotSongs } from "@/hooks/useHotSongs";
import Navigation from "@/components/Navigation";
import { TransmissionCard } from "@/components/TransmissionCard";
import { TransmissionCardSkeleton } from "@/components/TransmissionCardSkeleton";


export default function Hot40Page() {
  const { data: hotSongsData, isLoading } = useHotSongs(40);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          HEADY HOT 40 🔥
        </h1>
        <p className="text-white/60 mb-8">Top tracks from the last 7 days</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <TransmissionCardSkeleton key={i} />
            ))}
          </div>
        ) : hotSongsData && hotSongsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hotSongsData.map((song, index) => (
              <div key={song.id} className="relative pt-3">
                <div className="absolute top-0 -left-1 z-20 bg-emerald-500 text-black font-black text-sm px-3 py-1 rounded-full border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  #{index + 1}
                </div>
                <TransmissionCard transmission={song} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-white/60">No hot tracks available yet</p>
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

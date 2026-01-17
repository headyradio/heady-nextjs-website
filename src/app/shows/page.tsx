"use client";

import { useShows } from "@/hooks/useShows";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Radio, Clock, Calendar } from "lucide-react";

export default function ShowsPage() {
  const { shows, isLoading } = useShows();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          SHOWS
        </h1>
        <p className="text-white/60 mb-8">Your guide to HEADY.FM programming</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 bg-white/10 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Night Treats Show - Hardcoded for now */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Radio className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Night Treats</h2>
                </div>
                <p className="text-white/80">
                  Late night electronic music journey featuring deep house, progressive house, tech house, and experimental beats.
                </p>

                <div className="flex gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/card1-rouxbais.webp" 
                      alt="Rouxbais"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <p className="font-bold text-white">Rouxbais</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/card2-dale.webp" 
                      alt="Dale"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <p className="font-bold text-white">Dale</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>Friday at 10:00 PM ET</span>
                  </div>
                </div>
              </div>
            </div>

            {shows?.map((show: any) => (
              <div key={show.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Radio className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-white">{show.title}</h2>
                  </div>
                  {show.description && (
                    <p className="text-white/80">{show.description}</p>
                  )}
                  {show.schedule && (
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Clock className="w-4 h-4" />
                        <span>{show.schedule}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

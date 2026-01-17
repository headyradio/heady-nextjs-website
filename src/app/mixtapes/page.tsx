"use client";

import { useMixtapes } from "@/hooks/useMixtapes";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Play, ExternalLink } from "lucide-react";

export default function MixtapesPage() {
  const { mixtapes, isLoading } = useMixtapes();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          MIXTAPES
        </h1>
        <p className="text-white/60 mb-8">Curated mixes from the HEADY.FM family</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square bg-white/10 rounded-2xl" />
            ))}
          </div>
        ) : mixtapes && mixtapes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mixtapes.map((mixtape: any) => (
              <div key={mixtape.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                {mixtape.image_url ? (
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={mixtape.image_url} 
                      alt={mixtape.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <Music className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-1">{mixtape.title}</h3>
                  {mixtape.dj && (
                    <p className="text-white/60 text-sm mb-2">by {mixtape.dj}</p>
                  )}
                  {mixtape.url && (
                    <a 
                      href={mixtape.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Listen Now <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No mixtapes available yet</p>
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

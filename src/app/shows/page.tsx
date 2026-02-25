"use client";

import Navigation from "@/components/Navigation";
import { Radio, Calendar, Clock } from "lucide-react";
import Image from "next/image";

export default function ShowsPage() {
  return (
    <div className="min-h-screen bg-[#1a0a2e]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
            Shows
          </h1>
          <p className="text-xl text-white/60 font-medium max-w-2xl">
            Exclusive programming and curated musical journeys on HEADY.FM.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Night Treats Featured Card */}
          <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#2d1b4e] shadow-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Show Artwork/Visual */}
              <div className="relative w-full md:w-1/3 aspect-square max-w-[300px] shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-20 blur-2xl transform rotate-6 scale-95" />
                <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl bg-black/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a0a2e]">
                    <Radio className="w-20 h-20 text-white/20" />
                  </div>
                  {/* We can use the background image from the home page card as the 'show' image for now */}
                  <Image
                    src="/assets/card1-rouxbais.webp"
                    alt="Night Treats Visual"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-3xl font-black text-white text-center px-4 leading-none uppercase tracking-tighter drop-shadow-lg">
                      Night<br/>Treats
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    Night Treats
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed font-medium">
                    A late-night electronic music journey through deep house, progressive rhythms, and experimental beats. Curated for the after-hours mind.
                  </p>
                </div>

                {/* Hosts */}
                <div className="py-6 border-t border-white/10 border-b border-white/10">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Hosted By</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-3 bg-white/5 pr-4 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <Image 
                          src="/assets/card1-rouxbais.webp" 
                          alt="Rouxbais"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">Rouxbais</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 pr-4 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <Image 
                          src="/assets/card2-dale.webp" 
                          alt="Dale"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">Dale</span>
                    </div>
                  </div>
                </div>

                {/* Schedule & Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-6 h-6 text-accent" />
                    <span className="font-black text-xl tracking-tight text-accent">Fridays</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-6 h-6 text-white/70" />
                    <span className="font-bold text-lg">10:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50 mt-12">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}

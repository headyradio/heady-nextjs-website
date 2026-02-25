"use client";

import Navigation from "@/components/Navigation";
import { CheckCircle, Heart } from "lucide-react";
import Link from "next/link";

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-gradient-to-br from-green-500/20 to-primary/20 border border-green-500/30 rounded-2xl p-12">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              Thank You!
            </h1>
            <p className="text-white/80 mb-6">
              Your donation helps keep HEADY.FM running 24/7 with commercial-free music.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary mb-8">
              <Heart className="w-5 h-5" />
              <span className="font-bold">From the HEADY.FM Team</span>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:scale-105"
            >
              Return to Radio
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}

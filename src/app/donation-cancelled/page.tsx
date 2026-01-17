"use client";

import Navigation from "@/components/Navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function DonationCancelledPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12">
            <XCircle className="w-20 h-20 text-white/40 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              Donation Cancelled
            </h1>
            <p className="text-white/60 mb-8">
              No worries! You can always support HEADY.FM later.
            </p>
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
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

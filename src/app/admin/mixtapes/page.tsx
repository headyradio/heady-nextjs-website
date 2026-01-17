"use client";

import Navigation from "@/components/Navigation";
import { useMixtapes } from "@/hooks/useMixtapes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Music, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminMixtapesPage() {
  const { mixtapes, isLoading } = useMixtapes();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Manage Mixtapes
            </h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Mixtape
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-white/10 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {mixtapes?.map((mixtape: any) => (
                <div key={mixtape.id} className="p-4 flex items-center gap-4 hover:bg-white/5">
                  <Music className="w-8 h-8 text-accent" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{mixtape.title}</h3>
                    <p className="text-white/60 text-sm">{mixtape.dj || 'Unknown DJ'}</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
              {(!mixtapes || mixtapes.length === 0) && (
                <div className="p-8 text-center text-white/60">
                  No mixtapes found. Upload your first mixtape!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

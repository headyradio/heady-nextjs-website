"use client";

import Navigation from "@/components/Navigation";
import { useMeetups } from "@/hooks/useMeetups";
import { MeetupCard } from "@/components/MeetupCard";
import { MeetupDialog } from "@/components/MeetupDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MeetupsPage() {
  const { meetups, isLoading } = useMeetups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
              MEETUPS
            </h1>
            <p className="text-white/60">Connect with fellow listeners IRL</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Meetup
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 bg-white/10 rounded-2xl" />
            ))}
          </div>
        ) : meetups && meetups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetups.map((meetup: any) => (
              <MeetupCard 
                key={meetup.id} 
                meetup={meetup} 
                attendeeCount={0}
                userStatus={null}
                onRSVP={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60 mb-4">No meetups scheduled yet</p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              variant="outline"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Create the First Meetup
            </Button>
          </div>
        )}
      </div>
      
      {/* <MeetupDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} /> */}
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}

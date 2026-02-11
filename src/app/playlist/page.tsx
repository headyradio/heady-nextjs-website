"use client";

import { useState } from "react";
import { useTransmissionHistory } from "@/hooks/useTransmissionHistory";
import Navigation from "@/components/Navigation";
import { TransmissionCard } from "@/components/TransmissionCard";
import { TransmissionCardSkeleton } from "@/components/TransmissionCardSkeleton";
import { TransmissionSearch } from "@/components/TransmissionSearch";
import { TransmissionDateTimeFilter } from "@/components/TransmissionDateTimeFilter";
import { Button } from "@/components/ui/button";

export default function PlaylistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedHour, setSelectedHour] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(24);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: historyData, isLoading, isFetching } = useTransmissionHistory({
    limit: 500,
    searchQuery,
    selectedDate,
    selectedHour,
  });

  const transmissions = historyData?.filter(h => {
    const artist = h.artist?.toLowerCase() || '';
    const title = h.title?.toLowerCase() || '';
    return artist !== 'unknown artist' && title !== '- extraterrestrial radio';
  }) || [];

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setDisplayLimit(prev => prev + 24);
    setTimeout(() => setIsLoadingMore(false), 500);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          PLAYLIST
        </h1>
        <p className="text-white/60 mb-8">Recently played tracks on HEADY.FM</p>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TransmissionSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <TransmissionDateTimeFilter
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            onDateChange={setSelectedDate}
            onHourChange={setSelectedHour}
          />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <TransmissionCardSkeleton key={i} />
            ))}
          </div>
        ) : transmissions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {transmissions.slice(0, displayLimit).map((transmission, index) => (
                <TransmissionCard key={transmission.id} transmission={transmission} index={index} />
              ))}
            </div>
            
            {displayLimit < transmissions.length && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 px-10 py-3 text-base"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-white/60">No tracks found</p>
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

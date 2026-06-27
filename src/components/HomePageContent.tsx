"use client";

import { useState, useEffect } from 'react';
import { type InitialServerData } from '@/hooks/useRadioBoss';
import { RadioBossProvider, useRadioBossContext } from '@/contexts/RadioBossContext';
import { useTransmissionHistory } from '@/hooks/useTransmissionHistory';
import { isStationIdTrack } from '@/utils/stationFiltering';
import Navigation from '@/components/Navigation';
import { VideoHero } from '@/components/VideoHero';
import { FeaturedCard } from '@/components/FeaturedCard';
import { ExperienceCard } from '@/components/ExperienceCard';
import { SupportSidebar } from '@/components/SupportSidebar';
import { NowPlaying } from '@/components/NowPlaying';
import { NowPlayingSkeleton } from '@/components/NowPlayingSkeleton';
import { useMobileTab } from '@/contexts/MobileTabContext';
import { MobileSupportTab } from '@/components/MobileSupportTab';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';
import { DonationBanner } from '@/components/DonationBanner';
import { TransmissionLog } from '@/components/TransmissionLog';
import { TransmissionCard } from '@/components/TransmissionCard';
import { TransmissionCardSkeleton } from '@/components/TransmissionCardSkeleton';
import { TransmissionSearch } from '@/components/TransmissionSearch';
import { TransmissionDateTimeFilter } from '@/components/TransmissionDateTimeFilter';
import { SongCarousel } from '@/components/SongCarousel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { FeaturedArticlesClient } from '@/components/FeaturedArticlesClient';
import { FeaturedOnDemandClient } from '@/components/FeaturedOnDemandClient';
import { Footer } from '@/components/Footer';

interface HomePageContentProps {
  initialData?: InitialServerData;
}

export function HomePageContent({ initialData }: HomePageContentProps) {
  return (
    <RadioBossProvider initialData={initialData}>
      <HomePageContentInner />
    </RadioBossProvider>
  );
}

function HomePageContentInner() {
  const { tab: mobileTab, setTab: setMobileTab } = useMobileTab();
  const { nowPlaying, isLive, isLoading, error } = useRadioBossContext()!;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedHour, setSelectedHour] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Data hooks - fetch more data for mobile scrolling
  const { data: historyData, isLoading: historyLoading, isFetching, refetch } = useTransmissionHistory({
    limit: 100,
    searchQuery: '',
    selectedDate: 'all',
    selectedHour: 'all',
  });


  // Update browser tab title with currently playing song (skip station IDs/jingles
  // so crawlers always see the SEO title)
  useEffect(() => {
    if (nowPlaying && nowPlaying.artist && nowPlaying.title && !isStationIdTrack(nowPlaying)) {
      document.title = `${nowPlaying.artist} - ${nowPlaying.title} | HEADY.FM`;
    } else {
      document.title = 'Alternative & Indie Rock Radio - HEADY.FM';
    }

    return () => {
      document.title = 'Alternative & Indie Rock Radio - HEADY.FM';
    };
  }, [nowPlaying]);

  // Listen for logo click to reset mobile tab to 'player'
  useEffect(() => {
    const handleResetMobileTab = () => {
      setMobileTab('player');
    };
    
    window.addEventListener('resetMobileTab', handleResetMobileTab);
    return () => {
      window.removeEventListener('resetMobileTab', handleResetMobileTab);
    };
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setDisplayLimit(prev => prev + 12);
    setTimeout(() => setIsLoadingMore(false), 800);
  };

const transmissions = historyData
    ?.filter(h => {
      const artist = h.artist?.toLowerCase() || '';
      const title = h.title?.toLowerCase() || '';
      return artist !== 'unknown artist' && title !== '- extraterrestrial radio';
    })
    .map(h => ({
      id: h.id,
      title: h.title,
      artist: h.artist,
      album: h.album,
      play_started_at: h.play_started_at,
      duration: h.duration,
      album_art_url: h.album_art_url,
      genre: h.genre,
      year: h.year,
      artwork_id: h.artwork_id,
      created_at: h.created_at,
    })) || [];

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0">
      {/* Navigation with Audio Player */}
      <Navigation />

      {/* Mobile: Tab Content */}
      <div className="md:hidden bg-black">
        {mobileTab === 'player' && (
          <section className="px-4 pt-6 pb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {isLoading && !nowPlaying ? (
              <NowPlayingSkeleton />
            ) : (
              <NowPlaying transmission={nowPlaying} isLive={isLive} />
            )}
          </section>
        )}
        
        {mobileTab === 'history' && (
          <ScrollArea className="h-[calc(100vh-180px)] bg-black">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">PLAYLIST</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => refetch()}
                        variant="ghost"
                        size="icon"
                        disabled={isFetching}
                      >
                        <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Not seeing recent updates? Your browser may be displaying cached data. Click to refresh and load the latest transmission log.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Filters */}
              <div className="mb-4 flex flex-col gap-3">
                <TransmissionSearch 
                  value={searchQuery} 
                  onChange={setSearchQuery}
                />
                <TransmissionDateTimeFilter
                  selectedDate={selectedDate}
                  selectedHour={selectedHour}
                  onDateChange={setSelectedDate}
                  onHourChange={setSelectedHour}
                />
              </div>

              {/* Content */}
              {historyLoading && transmissions.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="font-bold">Loading...</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TransmissionCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ) : (
                <TransmissionLog
                  transmissions={transmissions.slice(0, displayLimit)}
                  displayLimit={displayLimit}
                  isLoadingMore={isLoadingMore}
                  isFetching={isFetching}
                  handleLoadMore={displayLimit < transmissions.length ? handleLoadMore : undefined}
                  totalCount={transmissions.length}
                />
              )}
            </div>
          </ScrollArea>
        )}

        {mobileTab === 'support' && <MobileSupportTab />}
      </div>

      {/* ===== SECTION 1: HERO - Full Width Video ===== */}
      <section className="relative w-full overflow-visible hidden md:block">
        {/* SEO H1 - Visually hidden but present for SEO */}
        <h1 className="sr-only">HEADY.FM: Commercial-Free Indie Rock Radio</h1>
        <VideoHero />
      </section>

      {/* ===== SECTION 2: ON AIR NOW (with Experience Card) ===== */}
      <section id="on-air-now" className="hidden md:block py-4 lg:py-6 scroll-mt-28">
        <div className="px-4">
          {error && (
            <div className="mb-8 p-6 rounded-xl bg-destructive/10 border-4 border-destructive">
              <p className="font-bold text-lg mb-1 text-white">Transmission Error</p>
              <p className="opacity-80 text-white">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Experience Card - 25% */}
            <div className="w-full lg:w-1/4">
              <ExperienceCard />
            </div>
            
            {/* On Air Now - 75% */}
            <div className="w-full lg:w-3/4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/20 rounded-full" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                  On Air Now
                </h2>
                <div className="h-px flex-1 bg-white/20 rounded-full" />
              </div>
              
              {isLoading && !nowPlaying ? (
                <NowPlayingSkeleton />
              ) : (
                <NowPlaying transmission={nowPlaying} isLive={isLive} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2.5: ON-DEMAND ===== */}
      <section className="hidden md:block py-4 lg:py-6">
        <div className="px-4">
          <FeaturedOnDemandClient />
        </div>
      </section>

      {/* ===== SECTION 3: FEATURED + SUPPORT (75/25 split) ===== */}
      <section className="hidden md:block py-4 lg:py-6">
        <div className="px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Featured Card - 75% */}
            <div className="w-full lg:w-3/4">
              <FeaturedCard />
            </div>
            
            {/* Support Sidebar - 25% */}
            <div className="w-full lg:w-1/4 min-h-[500px]">
              <SupportSidebar />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: RECENTLY PLAYED ===== */}
      <section id="transmission-history" className="hidden md:block py-4 lg:py-6">
        <div className="px-4">
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 p-8 rounded-2xl border border-white/10">
            <SongCarousel
              title="PLAYLIST"
              subtitle="Recently played tracks"
              items={transmissions}
              isLoading={historyLoading}
              viewAllLink="/playlist"
              viewAllText="Browse Full History"
              limit={20}
            />
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: HEADYZINE ===== */}
      <section className="hidden md:block py-4 lg:py-6">
        <div className="px-4">
          <FeaturedArticlesClient />
        </div>
      </section>



      <Footer variant="branded" />

      <FloatingChatWidget />
      <DonationBanner />
    </div>
  );
}

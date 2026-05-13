'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import {
  fetchCloudcastDetail,
  fetchTracklist,
  classifyCloudcast,
  formatDuration,
  formatDate,
} from '@/lib/mixcloud';
import { useMixcloudPlayer } from '@/contexts/MixcloudPlayerContext';
import type { ClassifiedCloudcast, MixcloudTrackSection } from '@/types/mixcloud';

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = 'rgb(10,10,15)';
const SURFACE = 'rgb(20,20,30)';
const GREEN = 'hsl(150,55%,35%)';
const TEXT_SECONDARY = 'rgba(255,255,255,0.65)';
const TEXT_MUTED = 'rgba(255,255,255,0.45)';

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function CloudcastDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? '';

  const [cloudcast, setCloudcast] = React.useState<ClassifiedCloudcast | null>(null);
  const [tracklist, setTracklist] = React.useState<MixcloudTrackSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { loadCloudcast, currentKey } = useMixcloudPlayer();
  const isActive = cloudcast ? currentKey === cloudcast.key : false;

  React.useEffect(() => {
    if (!slug) return;
    const key = `/headyradio/${slug}/`;
    Promise.all([fetchCloudcastDetail(key), fetchTracklist(slug)])
      .then(([detail, tracks]) => {
        setCloudcast(classifyCloudcast(detail));
        setTracklist(tracks);
      })
      .catch(() => setError('Failed to load content.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const artworkUrl =
    cloudcast?.pictures?.['1024wx1024h'] ??
    cloudcast?.pictures?.['768wx768h'] ??
    cloudcast?.pictures?.extra_large ??
    '';

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: BG }}>
        <Navigation />
        <div className="animate-pulse container mx-auto px-4 py-8 max-w-2xl space-y-4">
          <div className="rounded-xl" style={{ height: 240, background: SURFACE }} />
          <div className="h-6 rounded" style={{ background: SURFACE, width: '60%' }} />
          <div className="h-4 rounded" style={{ background: SURFACE, width: '40%' }} />
        </div>
      </div>
    );
  }

  if (error || !cloudcast) {
    return (
      <div className="min-h-screen" style={{ background: BG, color: 'white' }}>
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p style={{ color: TEXT_MUTED }}>{error ?? 'Cloudcast not found.'}</p>
          <Link href="/on-demand" className="text-sm underline mt-4 inline-block" style={{ color: GREEN }}>
            Back to On-Demand
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: BG, color: 'white' }}>
      <Navigation />

      {/* Artwork header with gradient fade and overlaid back button */}
      <div className="relative" style={{ height: 240 }}>
        {artworkUrl && (
          <img
            src={artworkUrl}
            alt={cloudcast.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.7) 60%, ${BG} 100%)`,
          }}
        />
        <Link
          href="/on-demand"
          aria-label="Back to On-Demand"
          className="absolute top-4 left-4 h-10 w-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 ring-1 ring-white/15"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Back to On-Demand</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 max-w-2xl" style={{ marginTop: -40, position: 'relative' }}>
        {/* Title */}
        <h1 className="text-2xl font-black leading-tight">{cloudcast.name}</h1>
        <p className="text-sm mt-1" style={{ color: TEXT_SECONDARY }}>
          {formatDate(cloudcast.created_time)}
        </p>

        {/* Listen button */}
        <button
          className="mt-5 w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: GREEN }}
          onClick={() => loadCloudcast(cloudcast.key, cloudcast.name)}
          aria-label={isActive ? 'Now playing' : `Listen to ${cloudcast.name}`}
        >
          {isActive ? (
            <>
              <span className="flex items-center gap-0.5 h-4">
                {[0, 0.15, 0.3].map((delay) => (
                  <span
                    key={delay}
                    className="w-0.5 rounded-full bg-white"
                    style={{
                      height: '100%',
                      animation: `volume-wave 0.8s ease-in-out infinite ${delay}s`,
                    }}
                  />
                ))}
              </span>
              Now Playing
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              Listen
            </>
          )}
        </button>

        {/* Metadata row */}
        <div className="flex items-center gap-5 mt-5" style={{ color: TEXT_MUTED }}>
          <span className="flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4" />
            {formatDuration(cloudcast.audio_length)}
          </span>
        </div>

        {/* Tags */}
        {cloudcast.tags.length > 0 && (
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {cloudcast.tags.map((tag) => (
              <span
                key={tag.slug}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium"
                style={{ color: GREEN, background: `${GREEN}25` }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {cloudcast.description && (
          <p className="mt-6 text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
            {cloudcast.description}
          </p>
        )}

        {/* Tracklist */}
        {tracklist.length > 0 && (
          <section className="mt-8 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: TEXT_MUTED }}>
              Tracklist
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ background: SURFACE }}>
              {tracklist.map((track, i) => (
                <div
                  key={track.id}
                  className="flex items-start gap-3 px-4 py-3 border-b last:border-0"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <span className="text-xs w-5 flex-shrink-0 mt-0.5 tabular-nums" style={{ color: TEXT_MUTED }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{track.songName}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: TEXT_SECONDARY }}>
                      {track.artistName}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs tabular-nums" style={{ color: TEXT_MUTED }}>
                    {formatSeconds(track.startSeconds)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {tracklist.length === 0 && !loading && (
          <div className="mt-8 mb-12" />
        )}
      </div>
    </div>
  );
}

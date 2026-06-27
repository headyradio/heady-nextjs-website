'use client';

import * as React from 'react';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { fetchCloudcasts, classifyCloudcast, formatDuration, formatDate } from '@/lib/mixcloud';
import { useMixcloudPlayer } from '@/contexts/MixcloudPlayerContext';
import type { ClassifiedCloudcast } from '@/types/mixcloud';

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = 'rgb(10,10,15)';
const SURFACE = 'rgb(20,20,30)';
const SURFACE_ALT = 'rgb(30,30,45)';
const GREEN = 'hsl(150,55%,35%)';
const YELLOW = 'hsl(45,95%,60%)';
const TEXT_SECONDARY = 'rgba(255,255,255,0.65)';
const TEXT_MUTED = 'rgba(255,255,255,0.45)';

// ── Helpers ────────────────────────────────────────────────────────────────────
function artworkUrl(c: ClassifiedCloudcast, size: '640wx640h' | '1024wx1024h') {
  return c.pictures?.[size] ?? c.pictures?.extra_large ?? '';
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function GenreBadge({ genre, category }: { genre?: string; category: 'SHOW' | 'MIXTAPE' }) {
  const label = genre ?? (category === 'SHOW' ? 'Show' : 'Mixtape');
  const color = category === 'SHOW' ? GREEN : YELLOW;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ring-1"
      style={{
        color,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        ['--tw-ring-color' as string]: `${color}66`,
      }}
    >
      {label}
    </span>
  );
}

function PlayingIndicator() {
  return (
    <span className="flex items-center gap-0.5 h-3">
      {[0, 0.15, 0.3].map((delay) => (
        <span
          key={delay}
          className="w-0.5 rounded-full"
          style={{
            background: GREEN,
            height: '100%',
            animation: `volume-wave 0.8s ease-in-out infinite ${delay}s`,
          }}
        />
      ))}
    </span>
  );
}

// Featured tile — square aspect ratio so artwork is never stretched or cropped
function FeaturedTile({
  c,
  isActive,
  onPlay,
}: {
  c: ClassifiedCloudcast;
  isActive: boolean;
  onPlay: (key: string, title: string) => void;
}) {
  const img = artworkUrl(c, '640wx640h');
  return (
    <Link href={`/on-demand/${c.slug}`} className="block">
      <div className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square">
        {img && (
          <img
            src={img}
            alt={c.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <GenreBadge genre={c.genre} category={c.category} />
          <p className="text-white font-bold text-sm mt-1.5 leading-snug line-clamp-2">{c.name}</p>
          <div className="flex items-center gap-2 mt-1" style={{ color: TEXT_MUTED }}>
            <span className="text-[11px] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(c.audio_length)}
            </span>
          </div>
        </div>
        <button
          className="absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: GREEN }}
          onClick={(e) => {
            e.preventDefault();
            onPlay(c.key, c.name);
          }}
          aria-label={`Play ${c.name}`}
        >
          {isActive ? <PlayingIndicator /> : <Play className="h-4 w-4 text-white fill-current ml-0.5" />}
        </button>
      </div>
    </Link>
  );
}

// Horizontal show card
function ShowCard({
  c,
  isActive,
  onPlay,
}: {
  c: ClassifiedCloudcast;
  isActive: boolean;
  onPlay: (key: string, title: string) => void;
}) {
  const img = artworkUrl(c, '640wx640h');
  return (
    <Link href={`/on-demand/${c.slug}`} className="flex-shrink-0" style={{ width: 160 }}>
      <div className="group cursor-pointer">
        <div className="relative rounded-lg overflow-hidden" style={{ width: 160, height: 160 }}>
          {img && (
            <img src={img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          )}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
          <div className="absolute top-2 left-2">
            <GenreBadge genre={c.genre} category={c.category} />
          </div>
          <button
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: GREEN }}
            onClick={(e) => {
              e.preventDefault();
              onPlay(c.key, c.name);
            }}
            aria-label={`Play ${c.name}`}
          >
            {isActive ? <PlayingIndicator /> : <Play className="h-4 w-4 text-white fill-current ml-0.5" />}
          </button>
        </div>
        <p className="text-white text-xs font-medium mt-2 leading-snug line-clamp-2">{c.name}</p>
        <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{formatDuration(c.audio_length)}</p>
      </div>
    </Link>
  );
}

// (MixtapeCard removed — ShowCard is used for both shows and mixtapes)

// Latest uploads list row
function LatestRow({
  c,
  isActive,
  onPlay,
}: {
  c: ClassifiedCloudcast;
  isActive: boolean;
  onPlay: (key: string, title: string) => void;
}) {
  const img = artworkUrl(c, '640wx640h');
  const typeColor = c.category === 'SHOW' ? GREEN : YELLOW;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg group cursor-pointer transition-colors"
      style={{ background: SURFACE }}
      onMouseEnter={(e) => (e.currentTarget.style.background = SURFACE_ALT)}
      onMouseLeave={(e) => (e.currentTarget.style.background = SURFACE)}
    >
      <Link href={`/on-demand/${c.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0 rounded overflow-hidden" style={{ width: 64, height: 64 }}>
          {img && <img src={img} alt={c.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ring-1"
              style={{
                color: typeColor,
                background: 'rgba(0,0,0,0.75)',
                ['--tw-ring-color' as string]: `${typeColor}66`,
              }}
            >
              {c.category}
            </span>
            {isActive && <PlayingIndicator />}
          </div>
          <p className="text-white text-sm font-medium truncate">{c.name}</p>
          <div className="flex items-center gap-2 mt-0.5" style={{ color: TEXT_MUTED }}>
            <span className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(c.audio_length)}
            </span>
            <span className="text-xs">{formatDate(c.created_time)}</span>
            {c.tags[0] && <span className="text-xs truncate">{c.tags[0].name}</span>}
          </div>
        </div>
      </Link>
      <button
        className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: GREEN }}
        onClick={() => onPlay(c.key, c.name)}
        aria-label={`Play ${c.name}`}
      >
        <Play className="h-4 w-4 text-white fill-current ml-0.5" />
      </button>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl" style={{ height: 260, background: SURFACE }} />
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 rounded-lg" style={{ width: 160, height: 160, background: SURFACE }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg" style={{ height: 180, background: SURFACE }} />
        ))}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OnDemandPage() {
  const [cloudcasts, setCloudcasts] = React.useState<ClassifiedCloudcast[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'SHOW' | 'MIXTAPE'>('all');
  const [activeGenre, setActiveGenre] = React.useState<string>('');
  const { loadCloudcast, currentKey } = useMixcloudPlayer();

  React.useEffect(() => {
    fetchCloudcasts()
      .then((data) => setCloudcasts(data.map(classifyCloudcast)))
      .catch(() => setError('Failed to load content. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const uniqueGenres = React.useMemo(() => {
    const set = new Set<string>();
    cloudcasts.forEach((c) => { if (c.genre) set.add(c.genre); });
    return Array.from(set).sort();
  }, [cloudcasts]);

  const filteredCloudcasts = React.useMemo(() => {
    return cloudcasts.filter((c) => {
      if (activeCategory !== 'all' && c.category !== activeCategory) return false;
      if (activeGenre && c.genre !== activeGenre) return false;
      return true;
    });
  }, [cloudcasts, activeCategory, activeGenre]);

  const shows = filteredCloudcasts.filter((c) => c.category === 'SHOW');
  const mixtapes = filteredCloudcasts.filter((c) => c.category === 'MIXTAPE');
  const featured = filteredCloudcasts.slice(0, 3);
  const isFiltered = activeCategory !== 'all' || activeGenre !== '';

  return (
    <div className="min-h-screen" style={{ background: BG, color: 'white' }}>
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">On-Demand</h1>
          <p className="text-sm mt-1" style={{ color: TEXT_SECONDARY }}>
            Browse shows and mixtapes from HEADY Radio
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6">{error}</p>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Filter Bar */}
            {cloudcasts.length > 0 && (
              <div className="mb-8 space-y-3">
                {/* Category pills */}
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: 'all', label: 'All' },
                    { value: 'SHOW', label: 'Shows' },
                    { value: 'MIXTAPE', label: 'Mixtapes' },
                  ] as const).map((cat) => {
                    const active = activeCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                        style={{
                          background: active ? GREEN : 'rgba(255,255,255,0.1)',
                          color: active ? 'white' : 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Genre pills */}
                {uniqueGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveGenre('')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                        activeGenre === ''
                          ? 'border-[hsl(150,55%,35%)] text-[hsl(150,55%,35%)] bg-[hsl(150,55%,35%)]/10'
                          : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                      }`}
                    >
                      All Genres
                    </button>
                    {uniqueGenres.map((g) => (
                      <button
                        key={g}
                        onClick={() => setActiveGenre((prev) => (prev === g ? '' : g))}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                          activeGenre === g
                            ? 'border-[hsl(150,55%,35%)] text-[hsl(150,55%,35%)] bg-[hsl(150,55%,35%)]/10'
                            : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty filter state */}
            {isFiltered && filteredCloudcasts.length === 0 && (
              <div className="rounded-xl p-10 text-center" style={{ background: SURFACE }}>
                <p className="text-white/70 font-semibold">No content matches your filters</p>
                <button
                  onClick={() => { setActiveCategory('all'); setActiveGenre(''); }}
                  className="mt-3 text-sm font-medium underline"
                  style={{ color: GREEN }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Featured — 3 large square tiles (hide when filtered to keep results coherent) */}
            {!isFiltered && featured.length > 0 && (
              <section className="mb-10">
                <div className="grid grid-cols-3 gap-3">
                  {featured.map((c) => (
                    <FeaturedTile key={c.key} c={c} isActive={currentKey === c.key} onPlay={loadCloudcast} />
                  ))}
                </div>
              </section>
            )}

            {/* Shows — horizontal scroll */}
            {shows.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
                  Shows
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                  {shows.map((c) => (
                    <ShowCard key={c.key} c={c} isActive={currentKey === c.key} onPlay={loadCloudcast} />
                  ))}
                </div>
              </section>
            )}

            {/* Mixtapes — horizontal scroll, same layout as Shows */}
            {mixtapes.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
                  Mixtapes
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                  {mixtapes.map((c) => (
                    <ShowCard key={c.key} c={c} isActive={currentKey === c.key} onPlay={loadCloudcast} />
                  ))}
                </div>
              </section>
            )}

            {/* Latest Uploads */}
            {filteredCloudcasts.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
                  {isFiltered ? 'Results' : 'Latest Uploads'}
                </h2>
                <div className="space-y-2">
                  {filteredCloudcasts.map((c) => (
                    <LatestRow key={c.key} c={c} isActive={currentKey === c.key} onPlay={loadCloudcast} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

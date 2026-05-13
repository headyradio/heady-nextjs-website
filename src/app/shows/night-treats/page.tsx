import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { classifyCloudcast, formatDuration, formatDate } from '@/lib/mixcloud';
import type { ClassifiedCloudcast, MixcloudCloudcast } from '@/types/mixcloud';

export const metadata: Metadata = {
  title: 'Night Treats — HEADY Radio',
  description:
    'Late-night electronic music journey with Rouxbais & Dale. Deep house, progressive, tech house, and experimental beats. Fridays at 10:00 PM ET on HEADY.FM.',
  alternates: { canonical: 'https://heady.fm/shows/night-treats' },
  openGraph: {
    title: 'Night Treats — HEADY Radio',
    description:
      'Late-night electronic music journey with Rouxbais & Dale. New episodes Fridays at 10:00 PM ET.',
    url: 'https://heady.fm/shows/night-treats',
    type: 'website',
    images: ['/assets/card1-rouxbais.webp'],
  },
};

const SURFACE = 'rgb(20,20,30)';
const GREEN = 'hsl(150,55%,35%)';
const TEXT_SECONDARY = 'rgba(255,255,255,0.65)';
const TEXT_MUTED = 'rgba(255,255,255,0.45)';

async function fetchNightTreatsEpisodes(): Promise<ClassifiedCloudcast[]> {
  const res = await fetch(
    'https://api.mixcloud.com/headyradio/cloudcasts/?limit=100',
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data: { data?: MixcloudCloudcast[] } = await res.json();
  return (data.data ?? [])
    .filter((c) => c.name.toUpperCase().includes('NIGHT TREATS'))
    .map(classifyCloudcast);
}

function artworkUrl(c: ClassifiedCloudcast) {
  return c.pictures?.['640wx640h'] ?? c.pictures?.extra_large ?? '';
}

export default async function NightTreatsShowPage() {
  const episodes = await fetchNightTreatsEpisodes();

  return (
    <div className="min-h-screen" style={{ background: 'rgb(10,10,15)', color: 'white' }}>
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/assets/card1-rouxbais.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.95) 100%)',
          }}
        />
        <div className="container mx-auto px-4 py-16 max-w-5xl relative">
          <Link
            href="/on-demand"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-white transition-colors"
            style={{ color: TEXT_SECONDARY }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to On-Demand
          </Link>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-4 ring-1 ring-[hsl(150,55%,35%)]/40"
            style={{ color: GREEN, background: 'rgba(0,0,0,0.75)' }}
          >
            Show · Electronic
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Night Treats
          </h1>
          <p
            className="mt-4 text-lg max-w-2xl leading-relaxed"
            style={{ color: TEXT_SECONDARY }}
          >
            A late-night electronic music journey through deep house, progressive
            rhythms, tech house, and experimental beats. Curated for the
            after-hours mind by Rouxbais &amp; Dale. New episodes Fridays at 10:00
            PM ET.
          </p>
        </div>
      </section>

      {/* Episodes */}
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-end justify-between mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: TEXT_MUTED }}
          >
            Episodes
          </h2>
          <span className="text-xs" style={{ color: TEXT_MUTED }}>
            {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'}
          </span>
        </div>

        {episodes.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center"
            style={{ background: SURFACE }}
          >
            <p className="text-white/70 font-semibold">
              No episodes available yet
            </p>
            <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>
              Check back soon for new uploads.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes.map((c) => {
              const img = artworkUrl(c);
              return (
                <Link
                  key={c.key}
                  href={`/on-demand/${c.slug}`}
                  className="group block"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-square">
                    {img && (
                      <img
                        src={img}
                        alt={c.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <p className="text-white text-sm font-medium mt-2 leading-snug line-clamp-2">
                    {c.name}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-1 text-[11px]"
                    style={{ color: TEXT_MUTED }}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(c.audio_length)}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(c.created_time)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio. All rights reserved.</p>
      </footer>
    </div>
  );
}

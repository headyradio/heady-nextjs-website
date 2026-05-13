"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Loader2, Play, Clock } from "lucide-react";
import { fetchCloudcasts, classifyCloudcast, formatDuration } from "@/lib/mixcloud";
import { useMixcloudPlayer } from "@/contexts/MixcloudPlayerContext";
import type { ClassifiedCloudcast } from "@/types/mixcloud";

const GREEN = "hsl(150,55%,35%)";
const YELLOW = "hsl(45,95%,60%)";

function artworkUrl(c: ClassifiedCloudcast) {
  return c.pictures?.["640wx640h"] ?? c.pictures?.extra_large ?? "";
}

function OnDemandTile({
  c,
  isActive,
  onPlay,
}: {
  c: ClassifiedCloudcast;
  isActive: boolean;
  onPlay: (key: string, title: string) => void;
}) {
  const img = artworkUrl(c);
  const badgeColor = c.category === "SHOW" ? GREEN : YELLOW;
  const badgeLabel = c.genre ?? (c.category === "SHOW" ? "Show" : "Mixtape");

  return (
    <Link href={`/on-demand/${c.slug}`} className="block group">
      <div className="relative rounded-xl overflow-hidden aspect-square cursor-pointer">
        {img && (
          <img
            src={img}
            alt={c.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }}
        />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{ color: badgeColor, background: `${badgeColor}33` }}
          >
            {badgeLabel}
          </span>
        </div>
        {/* Play button */}
        <button
          className="absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: GREEN }}
          onClick={(e) => {
            e.preventDefault();
            onPlay(c.key, c.name);
          }}
          aria-label={`Play ${c.name}`}
        >
          {isActive ? (
            <span className="flex items-center gap-0.5 h-3">
              {[0, 0.15, 0.3].map((d) => (
                <span
                  key={d}
                  className="w-0.5 h-full rounded-full bg-white"
                  style={{ animation: `volume-wave 0.8s ease-in-out infinite ${d}s` }}
                />
              ))}
            </span>
          ) : (
            <Play className="h-4 w-4 text-white fill-current ml-0.5" />
          )}
        </button>
        {/* Title + duration */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2">{c.name}</p>
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            <Clock className="h-3 w-3" />
            {formatDuration(c.audio_length)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedOnDemandClient() {
  const { data: cloudcasts, isLoading } = useQuery({
    queryKey: ["featured-on-demand"],
    queryFn: () => fetchCloudcasts().then((data) => data.slice(0, 3).map(classifyCloudcast)),
    staleTime: 5 * 60_000,
  });

  const { loadCloudcast, currentKey } = useMixcloudPlayer();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  if (!cloudcasts || cloudcasts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 p-8 rounded-2xl border border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black"
              style={{ background: YELLOW }}
            >
              NEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              On-Demand
            </h2>
          </div>
          <p className="text-white/70 text-lg leading-relaxed font-medium">
            Shows and mixtapes from HEADY Radio — listen anytime, on your schedule.
          </p>
        </div>

        <Link
          href="/on-demand"
          className="inline-flex items-center gap-1.5 hover:text-white text-sm font-semibold transition-colors whitespace-nowrap"
          style={{ color: GREEN }}
        >
          Browse all shows
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tiles grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cloudcasts.map((c) => (
          <OnDemandTile
            key={c.key}
            c={c}
            isActive={currentKey === c.key}
            onPlay={loadCloudcast}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { urlFor } from "@/lib/sanity/client";

interface LightboxImageProps {
  value: { asset?: { _ref?: string; _id?: string }; alt?: string };
}

export function LightboxImage({ value }: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!value?.asset) return null;

  const thumbUrl = urlFor(value).width(1200).url();
  const fullUrl = urlFor(value).width(2400).url();

  return (
    <>
      <figure
        className="my-8 -mx-4 md:mx-0 cursor-zoom-in group/fig"
        onClick={() => setOpen(true)}
      >
        <div className="relative w-full rounded-xl overflow-hidden bg-black/30">
          <Image
            src={thumbUrl}
            alt={value.alt || "Article image"}
            width={1200}
            height={0}
            style={{ width: "100%", height: "auto" }}
            className="transition-opacity group-hover/fig:opacity-90"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/fig:opacity-100 transition-opacity">
            <div className="bg-black/50 rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {value.alt && (
          <figcaption className="text-center text-white/40 text-sm mt-3 italic">
            {value.alt}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="relative max-w-[95vw] max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullUrl}
              alt={value.alt || "Article image"}
              width={2400}
              height={0}
              style={{ width: "auto", height: "auto", maxWidth: "95vw", maxHeight: "95vh" }}
              sizes="95vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

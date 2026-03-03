import { useState } from 'react';
import NextImage from 'next/image';

interface AlbumArtImageProps {
  url?: string | null;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  // Legacy props — kept for backward compatibility but no longer trigger edge function calls
  artworkId?: string | null;
  artist?: string;
  title?: string;
  useHistoricalFallback?: boolean;
}

export const AlbumArtImage = ({
  url,
  alt,
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
}: AlbumArtImageProps) => {
  const [showFallback, setShowFallback] = useState(false);

  if (!url || showFallback) {
    return (
      <div className={`${fallbackClassName} relative overflow-hidden`}>
        <NextImage
          src="/assets/card3-heady.webp"
          alt="HEADY Radio"
          fill
          className={className}
          sizes="(max-width: 768px) 100px, 300px"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <NextImage
        key={url}
        src={url}
        alt={alt || 'Album artwork'}
        fill
        className={className}
        sizes="(max-width: 768px) 100px, 300px"
        onError={() => setShowFallback(true)}
        unoptimized={false}
      />
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import NextImage from 'next/image';
import { supabase } from '@/integrations/supabase/client';

interface AlbumArtImageProps {
  url?: string | null;
  artworkId?: string | null;
  artist?: string;
  title?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  useHistoricalFallback?: boolean;
}

export const AlbumArtImage = ({ 
  url, 
  artworkId, 
  artist, 
  title, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
  useHistoricalFallback = false
}: AlbumArtImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const hasFetchedRef = useRef(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Main effect to fetch album art
  useEffect(() => {
    hasFetchedRef.current = false;
    setIsLoading(true);
    setShowFallback(false);
    setImageUrl(null);

    const fetchAlbumArt = async () => {
      // If no artist/title, just show fallback
      if (!artist || !title) {
        setShowFallback(true);
        setIsLoading(false);
        return;
      }

      // For historical data, go straight to Last.fm
      if (useHistoricalFallback) {
        try {
          const { data, error } = await supabase.functions.invoke('lastfm-album-art', { 
            body: { artist, title } 
          });
          
          if (!error && data?.url) {
            setImageUrl(data.url);
          } else {
            setShowFallback(true);
          }
        } catch (err) {
          console.error('Last.fm album art fetch failed:', err);
          setShowFallback(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // For recent transmissions:
      // Try RadioBoss URL first if available, but with timeout
      if (url) {
        const img = new Image();
        let loaded = false;

        const loadTimeout = setTimeout(() => {
          if (!loaded) {
            console.log('RadioBoss URL timeout, fetching from album-art service');
            img.src = ''; // Stop loading
            fetchFromService();
          }
        }, 3000); // 3 second timeout

        loadTimeoutRef.current = loadTimeout;

        img.onload = () => {
          loaded = true;
          clearTimeout(loadTimeout);
          setImageUrl(url);
          setIsLoading(false);
        };

        img.onerror = () => {
          loaded = true;
          clearTimeout(loadTimeout);
          console.log('RadioBoss URL failed, fetching from album-art service');
          fetchFromService();
        };

        img.src = url;
      } else {
        // No RadioBoss URL, go straight to service
        fetchFromService();
      }
    };

    const fetchFromService = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      try {
        const { data, error } = await supabase.functions.invoke('album-art', { 
          body: { artworkId, artist, title } 
        });
        
        if (!error && data?.url) {
          setImageUrl(data.url);
        } else {
          setShowFallback(true);
        }
      } catch (err) {
        console.error('Album art service failed:', err);
        setShowFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumArt();

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [url, artworkId, artist, title, useHistoricalFallback]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={fallbackClassName}>
        <div className="animate-pulse">
          <Play className="w-12 h-12 text-foreground/20" />
        </div>
      </div>
    );
  }

  // Show fallback image
  if (showFallback || !imageUrl) {
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
        key={imageUrl}
        src={imageUrl}
        alt={alt || 'Album artwork'}
        fill
        className={className}
        sizes="(max-width: 768px) 100px, 300px"
        onError={() => {
          console.log('Image load error, showing fallback');
          setShowFallback(true);
        }}
        unoptimized={false} // Use Next.js CDN caching
      />
    </div>
  );
};

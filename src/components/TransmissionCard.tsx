import { Clock } from 'lucide-react';
import { Transmission } from '@/hooks/useRadioBoss';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { AlbumArtImage } from './AlbumArtImage';
import { getYouTubeSearchUrl, getSpotifySearchUrl } from '@/lib/musicServiceLinks';
import Link from 'next/link';
import SaveSongButton from './SaveSongButton';

interface TransmissionCardProps {
  transmission: Transmission;
  index?: number;
}

export const TransmissionCard = ({ transmission, index = 0 }: TransmissionCardProps) => {
  // Parse the timestamp and convert to local timezone
  const playDate = parseISO(transmission.play_started_at);
  const localTime = toZonedTime(playDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const playedAgo = formatDistanceToNow(localTime, { addSuffix: true });
  const playTime = format(localTime, 'h:mm a');
  
  // Consistent green border for all cards


  const youtubeUrl = getYouTubeSearchUrl(transmission.artist, transmission.title);
  const spotifyUrl = getSpotifySearchUrl(transmission.artist, transmission.title);
  
  const songPageUrl = `/song/${encodeURIComponent(transmission.artist)}/${encodeURIComponent(transmission.title)}`;

  return (
    <div className="relative rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
         style={{ animationDelay: `${index * 50}ms` }}>
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/50 via-emerald-600/30 to-emerald-500/50 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Inner card with glass effect */}
      <div className="relative m-[1px] rounded-xl overflow-hidden bg-gray-900/95 backdrop-blur-sm">
        {/* Album Art */}
        <Link href={songPageUrl}>
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
            <AlbumArtImage
              url={transmission.album_art_url}
              artworkId={transmission.artwork_id}
              artist={transmission.artist}
              title={transmission.title}
              alt={`${transmission.title} by ${transmission.artist}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              fallbackClassName="w-full h-full flex items-center justify-center"
            />
            {/* Hover overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

      {/* Track Info */}
      <div className="p-3 md:p-4">
        <div className="mb-1">
          <Link href={songPageUrl} className="block">
            <h3 className="font-bold text-sm md:text-base truncate leading-tight text-white hover:text-emerald-400 transition-colors">
              {transmission.title}
            </h3>
          </Link>
        </div>
        
        {/* Artist Name - Clickable */}
        <Link 
          href={`/artist/${encodeURIComponent(transmission.artist)}`}
          className="font-semibold text-xs md:text-sm text-white/80 mb-2 md:mb-3 truncate hover:text-emerald-400 hover:opacity-100 transition-colors cursor-pointer block"
          onClick={(e) => e.stopPropagation()}
        >
          {transmission.artist}
        </Link>

        <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
          <Clock className="w-3 h-3" />
          <span>{playTime} · {playedAgo}</span>
        </div>

        {/* Music Service Links + Heart Button */}
        <div className="flex items-center gap-1.5">
          <SaveSongButton
            artist={transmission.artist}
            title={transmission.title}
            album={transmission.album}
            albumArtUrl={transmission.album_art_url}
            artworkId={transmission.artwork_id}
            size="sm"
          />
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Search for ${transmission.title} by ${transmission.artist} on YouTube`}
            title="Search on YouTube"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
              alt=""
              className="w-5 h-5"
              width="20"
              height="20"
              loading="lazy"
              aria-hidden="true"
            />
          </a>
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Search for ${transmission.title} by ${transmission.artist} on Spotify`}
            title="Search on Spotify"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
              alt=""
              className="w-5 h-5"
              width="20"
              height="20"
              loading="lazy"
              aria-hidden="true"
            />
          </a>
        </div>

        {transmission.genre && (
          <div className="mt-2">
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              {transmission.genre}
            </span>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

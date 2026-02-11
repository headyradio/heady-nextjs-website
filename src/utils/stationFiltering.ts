export interface TrackInfo {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
}

/**
 * Checks if a track is a station ID or bumper that should be filtered out
 * from public-facing lists like Playlist History and Hot 40.
 */
export const isStationIdTrack = (track: { title?: string | null, artist?: string | null, album?: string | null }): boolean => {
  if (!track.title && !track.artist && !track.album) return false;

  const title = (track.title || '').trim().toLowerCase();
  const artist = (track.artist || '').trim().toLowerCase();
  const album = (track.album || '').trim().toLowerCase();

  // Check specific titles provided by user
  if (
    title === "this is heady.fm" || 
    title === "you're listening to heady radio" ||
    title === "heady.fm" ||
    title === "heady radio" ||
    title === "station identification" ||
    title === "station identifcation" // Handle user's typo if present in data
  ) {
    return true;
  }

  // Check specific artists provided by user
  if (
    artist === "heady.fm" || 
    artist === "heady radio"
  ) {
    return true;
  }

  // Check specific albums provided by user (including typo)
  if (
    album === "station identifcation" || 
    album === "station identification"
  ) {
    return true;
  }

  return false;
};

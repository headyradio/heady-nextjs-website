export const ADJECTIVES = [
  'Cosmic', 'Neon', 'Funky', 'Groovy', 'Chill', 'Mellow', 'Atomic', 'Stellar', 
  'Electric', 'Dreamy', 'Midnight', 'Sunset', 'Lunar', 'Solar', 'Astral', 
  'Crystal', 'Velvet', 'Golden', 'Silver', 'Ruby', 'Emerald', 'Sapphire',
  'Mystic', 'Vibrant', 'Radiant', 'Sonic', 'Harmonic', 'Melodic', 'Rhythmic',
  'Polite', 'Happy', 'Lucky', 'Shiny', 'Sparkly', 'Fuzzy', 'Bouncy', 'Speedy',
  'Flying', 'Dancing', 'Singing', 'Jumping', 'Rolling', 'Spinning', 'Glowing'
];

export const NOUNS = [
  'Listener', 'DJ', 'Vibes', 'Soul', 'Beat', 'Wave', 'Rider', 'Star', 
  'Echo', 'Rhythm', 'Pulse', 'Flow', 'Spirit', 'Jam', 'Tune', 'Melody', 
  'Harmony', 'Groove', 'Spark', 'Flash', 'Dancer', 'Traveler', 'Explorer',
  'Dreamer', 'Creator', 'Artist', 'Poet', 'Friend', 'Buddy', 'Pal',
  'Cat', 'Dog', 'Bird', 'Fish', 'Fox', 'Bear', 'Tiger', 'Lion'
];

export const generateRandomName = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective}${noun}`;
};

export const COLORS = [
  'text-emerald-400',
  'text-blue-400',
  'text-purple-400',
  'text-pink-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
  'text-indigo-400',
];

export const getUserColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

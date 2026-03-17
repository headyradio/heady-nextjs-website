'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useRadioBoss, type Transmission, type InitialServerData } from '@/hooks/useRadioBoss';

interface RadioBossContextValue {
  nowPlaying: Transmission | null;
  recentTracks: Transmission[];
  stationName: string;
  listenersCount: number;
  isLive: boolean;
  lastUpdate: Date | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const RadioBossContext = createContext<RadioBossContextValue | null>(null);

export function RadioBossProvider({
  initialData,
  children,
}: {
  initialData?: InitialServerData;
  children: ReactNode;
}) {
  const value = useRadioBoss(initialData);
  return (
    <RadioBossContext.Provider value={value}>
      {children}
    </RadioBossContext.Provider>
  );
}

/**
 * Returns the shared RadioBoss context value, or null if no provider is present.
 * Components should fall back to their own useRadioBoss() call when null.
 */
export function useRadioBossContext(): RadioBossContextValue | null {
  return useContext(RadioBossContext);
}

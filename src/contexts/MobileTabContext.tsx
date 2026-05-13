'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type MobileTab = 'player' | 'history' | 'support';

interface MobileTabContextValue {
  tab: MobileTab;
  setTab: (tab: MobileTab) => void;
}

const MobileTabContext = createContext<MobileTabContextValue | null>(null);

export function MobileTabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<MobileTab>('player');
  return (
    <MobileTabContext.Provider value={{ tab, setTab }}>
      {children}
    </MobileTabContext.Provider>
  );
}

export function useMobileTab() {
  const ctx = useContext(MobileTabContext);
  if (!ctx) {
    throw new Error('useMobileTab must be used within MobileTabProvider');
  }
  return ctx;
}

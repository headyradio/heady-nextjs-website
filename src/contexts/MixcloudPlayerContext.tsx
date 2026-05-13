'use client';

import * as React from 'react';
import { useGlobalAudioPlayer } from './AudioPlayerContext';

interface MixcloudPlayerState {
  currentKey: string | null;
  currentTitle: string | null;
  isLoaded: boolean;
}

interface MixcloudPlayerContextValue extends MixcloudPlayerState {
  loadCloudcast: (key: string, title: string) => void;
  stopMixcloud: () => void;
}

const MixcloudPlayerContext = React.createContext<MixcloudPlayerContextValue | undefined>(
  undefined
);

export function MixcloudPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioPlayer = useGlobalAudioPlayer();
  const [state, setState] = React.useState<MixcloudPlayerState>({
    currentKey: null,
    currentTitle: null,
    isLoaded: false,
  });

  // Refs to avoid stale closures in callbacks
  const connectionStatusRef = React.useRef(audioPlayer.connectionStatus);
  connectionStatusRef.current = audioPlayer.connectionStatus;
  const isLoadedRef = React.useRef(state.isLoaded);
  isLoadedRef.current = state.isLoaded;

  const loadCloudcast = React.useCallback(
    (key: string, title: string) => {
      // Stop live radio when a cloudcast is loaded
      if (
        connectionStatusRef.current === 'streaming' ||
        connectionStatusRef.current === 'connecting'
      ) {
        audioPlayer.stop();
      }
      setState({ currentKey: key, currentTitle: title, isLoaded: true });
    },
    [audioPlayer]
  );

  const stopMixcloud = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent('heady-mixcloud-stop'));
    setState({ currentKey: null, currentTitle: null, isLoaded: false });
  }, []);

  // When live radio starts connecting OR playing, immediately stop any active Mixcloud playback
  React.useEffect(() => {
    if (
      (audioPlayer.connectionStatus === 'connecting' || audioPlayer.isPlaying) &&
      isLoadedRef.current
    ) {
      window.dispatchEvent(new CustomEvent('heady-mixcloud-stop'));
      setState({ currentKey: null, currentTitle: null, isLoaded: false });
    }
  }, [audioPlayer.connectionStatus, audioPlayer.isPlaying]);

  return (
    <MixcloudPlayerContext.Provider value={{ ...state, loadCloudcast, stopMixcloud }}>
      {children}
    </MixcloudPlayerContext.Provider>
  );
}

export function useMixcloudPlayer() {
  const context = React.useContext(MixcloudPlayerContext);
  if (!context) {
    throw new Error('useMixcloudPlayer must be used within MixcloudPlayerProvider');
  }
  return context;
}

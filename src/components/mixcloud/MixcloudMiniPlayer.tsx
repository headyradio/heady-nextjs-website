'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { useMixcloudPlayer } from '@/contexts/MixcloudPlayerContext';

interface MixcloudWidget {
  play: () => void;
  pause: () => void;
  events: {
    play: { on: (cb: () => void) => void };
    pause: { on: (cb: () => void) => void };
    ended: { on: (cb: () => void) => void };
    progress: { on: (cb: (pos: number, dur: number) => void) => void };
  };
}

declare global {
  interface Window {
    Mixcloud?: {
      PlayerWidget: (iframe: HTMLIFrameElement) => Promise<MixcloudWidget>;
    };
  }
}

export function MixcloudMiniPlayer() {
  const { currentKey, currentTitle, isLoaded, stopMixcloud } = useMixcloudPlayer();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const widgetRef = React.useRef<MixcloudWidget | null>(null);

  // Inject the Mixcloud Widget API script once
  React.useEffect(() => {
    if (document.querySelector('script[data-mixcloud-widget]')) return;
    const script = document.createElement('script');
    script.src = 'https://widget.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.setAttribute('data-mixcloud-widget', '1');
    document.head.appendChild(script);
  }, []);

  // Initialize widget after iframe loads; poll for window.Mixcloud if script isn't ready yet
  const handleIframeLoad = React.useCallback(async () => {
    if (!iframeRef.current) return;
    let attempts = 0;
    while (!window.Mixcloud && attempts < 25) {
      await new Promise((r) => setTimeout(r, 200));
      attempts++;
    }
    if (!window.Mixcloud || !iframeRef.current) return;
    try {
      const widget = await window.Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;
      widget.play();
      widget.events.ended.on(() => stopMixcloud());
    } catch {
      // widget API unavailable — audio still plays via iframe's built-in controls
    }
  }, [stopMixcloud]);

  // Pause widget when mutual-exclusivity stop event fires (live radio starting)
  React.useEffect(() => {
    const onStop = () => widgetRef.current?.pause();
    window.addEventListener('heady-mixcloud-stop', onStop);
    return () => window.removeEventListener('heady-mixcloud-stop', onStop);
  }, []);

  if (!isLoaded || !currentKey) return null;

  const widgetUrl = `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(currentKey)}&hide_cover=1&mini=1&light=0&autoplay=1`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4"
      style={{
        background: 'rgb(20,20,30)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        minHeight: 68,
      }}
    >
      <span
        className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
        style={{ color: 'hsl(45,95%,60%)', background: 'hsla(45,95%,60%,0.15)' }}
      >
        ON-DEMAND
      </span>

      <span className="text-white text-sm font-medium truncate flex-shrink-0 max-w-[200px] hidden sm:block">
        {currentTitle}
      </span>

      <div className="flex-1 min-w-0">
        <iframe
          ref={iframeRef}
          src={widgetUrl}
          width="100%"
          height="60"
          allow="autoplay"
          onLoad={handleIframeLoad}
          style={{ display: 'block', border: 'none' }}
          title={`Now playing: ${currentTitle}`}
        />
      </div>

      <button
        onClick={stopMixcloud}
        className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1"
        aria-label="Close on-demand player"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

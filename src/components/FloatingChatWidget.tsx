"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveChat } from '@/components/LiveChat';

type WidgetState = 'minimized' | 'active';

export const FloatingChatWidget = () => {
  const pathname = usePathname();
  const [state, setState] = useState<WidgetState>('minimized');
  const [hasInteracted, setHasInteracted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chat_interacted') === 'true';
    }
    return false;
  });
  
  const markAsInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('chat_interacted', 'true');
    }
  };

  // Listen for open-live-chat event from Navigation
  useEffect(() => {
    const handleOpenLiveChat = () => {
      setState('active');
      setHasInteracted(true);
      localStorage.setItem('chat_interacted', 'true');
    };
    
    window.addEventListener('open-live-chat', handleOpenLiveChat);
    return () => window.removeEventListener('open-live-chat', handleOpenLiveChat);
  }, []);

  // Don't render the floating widget inside the Sanity CMS backend
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  if (state === 'minimized') {
    return (
      <Button
        onClick={() => {
          setState('active');
          markAsInteracted();
        }}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 h-12 shadow-2xl transition-all duration-300 z-50 hover:scale-105 hover:brightness-110 px-6 rounded-full flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black border-2 border-emerald-400/50"
        aria-label="Open live chat"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
        </span>
        <span className="font-black tracking-widest text-xs uppercase">Live Chat</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[90vw] max-w-[400px] h-[60vh] md:h-[600px] flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
      {/* Floating Close Button outside the container */}
      <Button 
        variant="secondary" 
        size="icon" 
        className="absolute -top-12 right-0 rounded-full shadow-lg bg-white text-black hover:bg-white/90 z-50 h-10 w-10 ring-1 ring-black/10"
        onClick={() => setState('minimized')}
        title="Close chat"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Main Chat Container */}
      <div className="flex-1 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <LiveChat />
      </div>
    </div>
  );
};

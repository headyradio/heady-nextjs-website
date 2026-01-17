"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveChat } from '@/components/LiveChat';

type WidgetState = 'minimized' | 'active';

export const FloatingChatWidget = () => {
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

  if (state === 'minimized') {
    return (
      <Button
        onClick={() => {
          setState('active');
          markAsInteracted();
        }}
        className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 h-12 shadow-2xl transition-all duration-300 z-50 hover:scale-105 px-5 rounded-full flex items-center gap-2 group ${
          hasInteracted 
            ? 'bg-black/80 backdrop-blur-md border border-white/10 text-white hover:bg-black' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse'
        }`}
        aria-label="Open live chat"
      >
        <div className={`w-2 h-2 rounded-full ${hasInteracted ? 'bg-emerald-500' : 'bg-white'} animate-pulse`} />
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

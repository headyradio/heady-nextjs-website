"use client";

import { useState, useEffect, useRef } from 'react';
import { useLiveChat } from '@/hooks/useLiveChat';
import { generateRandomName, getUserColor } from '@/lib/randomNames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Send, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export const LiveChat = () => {
  const { messages, sendGuestMessage } = useLiveChat();
  const [newMessage, setNewMessage] = useState('');
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Rate limiting state
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const RATE_LIMIT_MS = 2000; // 2 seconds between messages

  // Initialize username with lazy initializer
  const [username, setUsername] = useState<string>(() => {
     if (typeof window !== 'undefined') {
       const storedName = localStorage.getItem('chat_username');
       if (storedName) return storedName;
       
       const newName = generateRandomName();
       localStorage.setItem('chat_username', newName);
       return newName;
     }
     return '';
  });

  // Client-side hydration check
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mounted]);


  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!newMessage.trim()) return;

    // Rate limit check
    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_MS) {
      toast({
        title: "Slow down!",
        description: "Please wait a moment before sending another message.",
        variant: "destructive",
      });
      return; 
    }

    try {
      await sendGuestMessage.mutateAsync({
        content: newMessage.trim(),
        senderName: username
      });
      setNewMessage('');
      setLastMessageTime(now);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateName = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      localStorage.setItem('chat_username', tempUsername.trim());
      setIsEditNameOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header - Improved Layout */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <h2 className="text-sm font-black text-white/90 tracking-widest uppercase">Live Chat</h2>
        </div>
        
        <button 
          onClick={() => {
            setTempUsername(username);
            setIsEditNameOpen(true);
          }}
          className="flex items-center gap-2 group bg-white/5 hover:bg-white/10 pl-3 pr-2 py-1.5 rounded-full transition-all border border-white/5 hover:border-white/20 select-none"
          title="Change your name"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wide font-medium group-hover:text-white/60">as</span>
          <span className={`${getUserColor(username)} font-bold text-xs`}>{username}</span>
          <Edit2 className="w-3 h-3 text-white/20 group-hover:text-white ml-0.5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-white/20 font-mono text-sm mb-2">It's quiet in here...</p>
            <p className="text-emerald-500/50 text-xs">Be the first to say hello!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className="group flex items-start gap-3 hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded-lg transition-colors">
            <span className="text-[10px] font-mono text-white/20 pt-1 w-12 flex-shrink-0 tabular-nums select-none">
              {format(new Date(msg.created_at), 'HH:mm')}
            </span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className={`text-xs font-bold ${getUserColor(msg.sender_name)} truncate mb-0.5 select-none`}>
                {msg.sender_name}
              </span>
              <span className="text-sm text-white/90 break-words leading-relaxed font-medium">
                {msg.content}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Improved */}
      <div className="p-4 bg-white/[0.02] border-t border-white/10">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Say something, ${username}...`}
            className="bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 h-10 rounded-xl pr-10 text-sm"
            maxLength={280}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!newMessage.trim() || sendGuestMessage.isPending}
            className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all disabled:opacity-0 disabled:scale-90"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      {/* Name Change Dialog */}
      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent className="bg-black/95 border-white/10 text-white sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Change Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-white/70">Display Name</Label>
              <Input
                id="username"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                maxLength={20}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNameOpen(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleUpdateName} className="bg-primary hover:bg-primary/90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

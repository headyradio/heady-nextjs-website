"use client";

import Navigation from "@/components/Navigation";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";
import { Users, MessageCircle, Radio } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          COMMUNITY
        </h1>
        <p className="text-white/60 mb-8">Connect with fellow listeners</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold text-white mb-2">Join the Chat</h2>
            <p className="text-white/60 text-sm">
              Connect with listeners in real-time using the chat widget
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h2 className="text-xl font-bold text-white mb-2">Share Your Thoughts</h2>
            <p className="text-white/60 text-sm">
              Leave comments on your favorite songs and artists
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Radio className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h2 className="text-xl font-bold text-white mb-2">Stay Tuned</h2>
            <p className="text-white/60 text-sm">
              Listen to HEADY.FM 24/7 commercial-free
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-4">Join the Conversation</h2>
          <p className="text-white/80 mb-6">
            Click the chat bubble in the bottom right corner to join our live community chat!
          </p>
        </div>
      </div>
      
      <FloatingChatWidget />
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
      </footer>
    </div>
  );
}

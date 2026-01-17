"use client";

import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Mail, Sparkles } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, signInWithMagicLink } = useAuth();

  // Redirect if already logged in
  if (user) {
    router.push("/profile");
    return null;
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInWithMagicLink(email);
      if (error) throw error;
      
      setMagicLinkSent(true);
      toast({
        title: "Check your email! ✨",
        description: "We've sent you a magic link to sign in.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Magic link sent confirmation view
  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-black text-white mb-4">
                Check Your Email ✨
              </h1>
              <p className="text-white/70 mb-6">
                We&apos;ve sent a magic link to <span className="text-white font-semibold">{email}</span>. 
                Click the link in the email to sign in.
              </p>
              <p className="text-white/50 text-sm mb-6">
                The link will expire in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setMagicLinkSent(false);
                  setEmail("");
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Try a different email
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                Save Tracks Using My HEADY
              </h1>
            </div>
            <p className="text-white/60 text-center mb-6 text-sm">
              Join or sign in to save tracks. You can even add them to your Spotify or YouTube playlists! It only takes your email to get started.
            </p>
            
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  No password needed! We&apos;ll email you a secure link.
                </p>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Magic Link
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          {/* Additional Info */}
          <p className="text-center text-white/40 text-xs mt-6">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

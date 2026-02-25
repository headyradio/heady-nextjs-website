"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, Radio, Music, BookOpen, Calendar, Shield } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-64 w-full bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/admin/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Shield className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-4">Access Denied</h1>
            <p className="text-white/60 mb-6">You don&apos;t have permission to access the admin area.</p>
            <Link href="/" className="text-primary hover:text-primary/80 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/admin/shows"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group"
          >
            <Radio className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-white mb-2">Manage Shows</h2>
            <p className="text-white/60 text-sm">Add, edit, and schedule radio shows</p>
          </Link>
          
          <Link 
            href="/admin/mixtapes"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group"
          >
            <Music className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-white mb-2">Manage Mixtapes</h2>
            <p className="text-white/60 text-sm">Upload and manage mixtape content</p>
          </Link>
          
          <Link 
            href="/admin/headyzine"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group"
          >
            <BookOpen className="w-10 h-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-white mb-2">Manage Headyzine</h2>
            <p className="text-white/60 text-sm">Create and edit blog posts</p>
          </Link>
        </div>
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>©2026 HEADY Radio Admin</p>
      </footer>
    </div>
  );
}

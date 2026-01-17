"use client";

import Navigation from "@/components/Navigation";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminHeadyzinePage() {
  const { posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Manage Headyzine
            </h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-white/10 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {posts?.map((post: any) => (
                <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-white/5">
                  <BookOpen className="w-8 h-8 text-green-400" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{post.title}</h3>
                    <p className="text-white/60 text-sm">{post.excerpt?.substring(0, 80) || 'No excerpt'}...</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
              {(!posts || posts.length === 0) && (
                <div className="p-8 text-center text-white/60">
                  No posts found. Create your first article!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

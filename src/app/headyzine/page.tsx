"use client";

import Navigation from "@/components/Navigation";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HeadyzinePage() {
  const { posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
          HEADYZINE
        </h1>
        <p className="text-white/60 mb-8">Stories, interviews, and news from the HEADY.FM universe</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 bg-white/10 rounded-2xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                {post.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 'Recently'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-white/60 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No articles available yet</p>
            <p className="text-white/40 text-sm mt-2">Check back soon for stories from the HEADY.FM universe</p>
          </div>
        )}
      </div>
      
      <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} HEADY Radio. All transmissions received and logged.</p>
      </footer>
    </div>
  );
}

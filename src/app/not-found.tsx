import Link from "next/link";
import { Radio, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-8">
          <Radio className="w-12 h-12 text-white/30" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white/80 mb-2 uppercase tracking-tight">
          Signal Lost
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          The transmission you&apos;re looking for couldn&apos;t be found. It may have been moved or doesn&apos;t exist.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:scale-105"
        >
          <Home className="w-5 h-5" />
          Return to Radio
        </Link>
      </div>
    </div>
  );
}

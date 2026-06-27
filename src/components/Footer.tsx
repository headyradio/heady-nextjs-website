import Link from 'next/link';
import { ManageCookiePreferencesLink } from '@/components/CookieConsentBanner';

type FooterProps = {
  variant?: 'default' | 'branded';
};

export function Footer({ variant = 'default' }: FooterProps) {
  const links = (
    <nav
      aria-label="Footer"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs"
    >
      <Link href="/about" className="text-white/50 hover:text-white/80 transition-colors">
        About
      </Link>
      <span className="text-white/20" aria-hidden="true">·</span>
      <Link href="/privacy" className="text-white/50 hover:text-white/80 transition-colors">
        Privacy
      </Link>
      <span className="text-white/20" aria-hidden="true">·</span>
      <Link href="/terms" className="text-white/50 hover:text-white/80 transition-colors">
        Terms
      </Link>
      <span className="text-white/20" aria-hidden="true">·</span>
      <Link href="/licensing" className="text-white/50 hover:text-white/80 transition-colors">
        Licensing
      </Link>
      <span className="text-white/20" aria-hidden="true">·</span>
      <ManageCookiePreferencesLink className="text-xs text-white/50 hover:text-white/80 transition-colors" />
    </nav>
  );

  if (variant === 'branded') {
    return (
      <footer className="hidden md:block border-t border-white/10 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-white">
              HEADY EXTRATERRESTRIAL RADIO
            </h3>
            <div className="pt-4 text-sm text-white/40 space-y-3">
              <p>©2026 HEADY Radio. All rights reserved.</p>
              {links}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-center text-sm text-white/50 space-y-3">
      <p>©2026 HEADY Radio. All rights reserved.</p>
      {links}
    </footer>
  );
}

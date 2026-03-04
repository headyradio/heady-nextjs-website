import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { ManageCookiePreferencesLink } from '@/components/CookieConsentBanner';
import { PrivacyPolicyContent } from '@/components/PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how HEADY.FM collects, uses, and protects your data. CCPA and CIPA compliant.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <PrivacyPolicyContent />

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/30">
          <p className="mb-2">©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
          <ManageCookiePreferencesLink />
        </div>
      </div>
    </div>
  );
}

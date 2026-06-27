import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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
      </div>

      <Footer />
    </div>
  );
}

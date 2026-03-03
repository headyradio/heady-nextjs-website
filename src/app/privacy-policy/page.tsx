import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { ManageCookiePreferencesLink } from '@/components/CookieConsentBanner';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how HEADY.FM collects, uses, and protects your data. CCPA and CIPA compliant.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'March 3, 2026';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-3xl font-black uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm text-white/40">Last updated: {lastUpdated}</p>

        <div className="space-y-10 text-sm leading-relaxed text-white/70">

          {/* 1 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              1. Who We Are
            </h2>
            <p>
              HEADY.FM (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is an internet radio
              station operated by Prospect Media. This Privacy Policy explains how we handle
              information when you visit{' '}
              <a href="https://heady.fm" className="text-emerald-400 underline">
                heady.fm
              </a>{' '}
              (&ldquo;the Site&rdquo;). For privacy requests, contact us at{' '}
              <a href="mailto:privacy@heady.fm" className="text-emerald-400 underline">
                privacy@heady.fm
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              2. Data We Collect
            </h2>
            <p className="mb-3">
              We collect information in two ways: information you provide directly, and
              information collected automatically.
            </p>
            <h3 className="mb-2 font-semibold text-white/90">
              a) Analytics Data (Google Analytics 4)
            </h3>
            <p className="mb-3">
              Only if you have given consent, we use Google Analytics 4 (&ldquo;GA4&rdquo;) to
              collect anonymous usage data including:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Pages visited and time spent on each page</li>
              <li>Referring website or search query</li>
              <li>General geographic region (country/city — not precise location)</li>
              <li>Device type, browser, and operating system</li>
              <li>Session and engagement metrics</li>
            </ul>
            <p>
              GA4 does not collect your name, email address, or any information that directly
              identifies you. Analytics cookies are{' '}
              <strong className="text-white">not set</strong> unless you explicitly accept.
            </p>

            <h3 className="mb-2 mt-4 font-semibold text-white/90">
              b) Account Information
            </h3>
            <p>
              If you create an account, we collect your email address and any profile
              information you provide (display name, avatar). This is stored securely via
              Supabase and is used solely to provide account features (saved songs, comments,
              preferences).
            </p>

            <h3 className="mb-2 mt-4 font-semibold text-white/90">
              c) Functional Data
            </h3>
            <p>
              We use browser localStorage to remember your consent decision and audio player
              preferences. No cookies are used for this; no data is sent to any server.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              3. Why We Collect It
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Analytics:</strong> To understand how listeners
                use the site so we can improve the listening experience, fix bugs, and prioritize
                features.
              </li>
              <li>
                <strong className="text-white">Account features:</strong> To save your song
                library, post comments, and personalize your experience.
              </li>
              <li>
                <strong className="text-white">Functional preferences:</strong> To remember your
                audio and display settings across visits.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              4. Google Analytics &amp; Consent Mode v2
            </h2>
            <p className="mb-3">
              We implement Google Analytics Consent Mode v2. All consent signals default to{' '}
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">denied</code>{' '}
              before any GA script loads. No GA cookies are written and no data is sent to Google
              until you explicitly click &ldquo;Accept&rdquo; on the cookie banner.
            </p>
            <p>
              We collect analytics data only — we do not use GA for advertising, remarketing, or
              user profiling. Ad storage, ad user data, and ad personalization signals remain{' '}
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">denied</code>{' '}
              regardless of your consent choice.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              5. Your Rights — CCPA &amp; CIPA
            </h2>
            <p className="mb-3">
              California residents have the following rights under the California Consumer
              Privacy Act (CCPA) and California Invasion of Privacy Act (CIPA):
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Right to Know:</strong> You can request details
                about the personal information we collect and how it is used.
              </li>
              <li>
                <strong className="text-white">Right to Delete:</strong> You can request deletion
                of personal information we hold about you.
              </li>
              <li>
                <strong className="text-white">Right to Opt-Out of Sale:</strong> We do not sell
                personal information. Analytics data shared with Google is governed by{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-white">Right to Non-Discrimination:</strong> Declining
                analytics cookies does not affect your access to HEADY.FM.
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email{' '}
              <a href="mailto:privacy@heady.fm" className="text-emerald-400 underline">
                privacy@heady.fm
              </a>
              .
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              6. How to Opt Out
            </h2>
            <p className="mb-3">You have several options to opt out of analytics tracking:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Cookie Preferences:</strong>{' '}
                <ManageCookiePreferencesLink className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer" />
                {' '}— change your decision at any time without page reload.
              </li>
              <li>
                <strong className="text-white">Google Analytics Opt-Out:</strong> Install the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{' '}
                to block GA across all sites.
              </li>
              <li>
                <strong className="text-white">Browser settings:</strong> Block third-party
                cookies in your browser settings (note: this may affect other site functionality).
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              7. Data Retention
            </h2>
            <p>
              Google Analytics data is retained for 14 months by default, after which it is
              automatically deleted. Account data is retained as long as your account is active.
              You can request deletion at any time by emailing{' '}
              <a href="mailto:privacy@heady.fm" className="text-emerald-400 underline">
                privacy@heady.fm
              </a>
              .
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will be noted by
              updating the &ldquo;Last updated&rdquo; date at the top of this page.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
              9. Contact
            </h2>
            <p>
              For privacy-related questions or requests, contact:{' '}
              <a href="mailto:privacy@heady.fm" className="text-emerald-400 underline">
                privacy@heady.fm
              </a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/30">
          <p className="mb-2">©2026 HEADY Radio, a Prospect Media property. All rights reserved.</p>
          <ManageCookiePreferencesLink />
        </div>
      </div>
    </div>
  );
}

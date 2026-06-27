export function PrivacyPolicyContent() {
  const lastUpdated = 'June 27, 2026';

  return (
    <div className="text-sm leading-relaxed text-white/70">
      <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
        Privacy Policy
      </h1>
      <p className="mb-8 text-xs text-white/40">Last updated: {lastUpdated}</p>

      <div className="space-y-8">

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            1. Who We Are
          </h2>
          <p>
            HEADY.FM (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is an internet radio
            station independently operated by Johan Moreno (dba HEADY.FM). This Privacy Policy explains how we handle
            information when you visit{' '}
            <a href="https://heady.fm" className="text-emerald-400 underline">
              heady.fm
            </a>{' '}
            (&ldquo;the Site&rdquo;). Your use of the Site is also governed by our{' '}
            <a href="/terms" className="text-emerald-400 underline">
              Terms of Service
            </a>
            . For privacy requests, contact us at{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            2. Data We Collect
          </h2>
          <p className="mb-3">
            We collect information in two ways: information you provide directly, and
            information collected automatically.
          </p>
          <h3 className="mb-2 font-semibold text-white/90">
            a) Analytics Data
          </h3>
          <p className="mb-3">
            We use analytics tools to collect anonymous usage data by default, including:
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>Pages visited and time spent on each page</li>
            <li>Referring website or search query</li>
            <li>General geographic region (country/city — not precise location)</li>
            <li>Device type, browser, and operating system</li>
            <li>Session and engagement metrics</li>
          </ul>
          <p>
            Analytics tools do not collect your name, email address, or any information that
            directly identifies you. You can opt out of analytics tracking at any time using
            the Cookie Preferences option in the site footer.
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

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            4. Marketing Pixels &amp; Consent Mode
          </h2>
          <p className="mb-3">
            We use an opt-out model for analytics tracking. Analytics cookies are active by
            default when you visit the site. When you first visit, a non-blocking notice
            informs you that tracking is active and provides the option to opt out.
          </p>
          <p>
            We collect analytics data only — we do not use trackers for advertising,
            remarketing, or user profiling. Ad storage, ad user data, and ad personalization
            signals are always{' '}
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">denied</code>.
            You can opt out of analytics tracking at any time via Cookie Preferences.
          </p>
        </section>

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
              personal information.
            </li>
            <li>
              <strong className="text-white">Right to Non-Discrimination:</strong> Opting out
              of tracking does not affect your access to HEADY.FM.
            </li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            6. How to Opt Out
          </h2>
          <p className="mb-3">You have several options to opt out of analytics tracking:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Cookie Preferences:</strong> Use the Cookie
              Preferences button in the site footer to change your decision at any time.
            </li>
            <li>
              <strong className="text-white">Browser settings:</strong> Block third-party
              cookies in your browser settings (note: this may affect other site functionality).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            7. Data Retention
          </h2>
          <p>
            Analytics data is retained for 14 months by default, after which it is
            automatically deleted. Account data is retained as long as your account is active.
            You can request deletion at any time by emailing{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            8. Service Providers We Use
          </h2>
          <p className="mb-3">
            We use trusted third-party services to operate the Site. Each provider only
            receives the data needed to perform its function and is contractually bound to
            handle it consistently with this policy.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Vercel</strong> &mdash; site hosting,
              deployment, and performance analytics.
            </li>
            <li>
              <strong className="text-white">Supabase</strong> &mdash; account, profile,
              and saved-song storage.
            </li>
            <li>
              <strong className="text-white">Google Analytics</strong> &mdash; aggregate
              traffic analytics (you can opt out via Cookie Preferences).
            </li>
            <li>
              <strong className="text-white">Sanity</strong> &mdash; content management for
              HEADYZINE articles and editorial content.
            </li>
            <li>
              <strong className="text-white">Payment processors</strong> &mdash; donations
              are processed by third-party payment providers under their own terms and
              privacy policies. We do not store full payment card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            9. Data Security
          </h2>
          <p>
            We use commercially reasonable administrative, technical, and physical
            safeguards to protect your information &mdash; including encryption in transit
            (HTTPS), encrypted storage at our service providers, and access controls on
            internal systems. No method of transmission or storage is 100% secure; you use
            the Site at your own risk. If we become aware of a security incident affecting
            your information, we will notify you and applicable regulators as required by
            law.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            10. Children&apos;s Privacy
          </h2>
          <p>
            The Site is not directed to children under 13, and we do not knowingly collect
            personal information from anyone under 13. If you believe a child has
            provided us with personal information, please contact{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>{' '}
            and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            11. International Users
          </h2>
          <p className="mb-3">
            The Site is operated from the United States. If you access it from outside
            the U.S., your information may be transferred to, stored, and processed in
            the United States, where data-protection laws may differ from those in your
            country.
          </p>
          <p>
            If you are in the European Economic Area, the United Kingdom, or
            another region with comparable privacy rights, you may have additional
            rights, including the right to access, correct, port, or erase your personal
            information, and to object to or restrict its processing. To exercise these
            rights, email{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            12. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. Material changes will be noted by
            updating the &ldquo;Last updated&rdquo; date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            13. Contact
          </h2>
          <p>
            For privacy-related questions or requests, contact:{' '}
            <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
              compliance@heady.fm
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions that govern your use of HEADY.FM, including acceptable use, user content, donations, disclaimers, and limitation of liability.',
};

export default function TermsPage() {
  const lastUpdated = 'June 27, 2026';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="text-sm leading-relaxed text-white/70">
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="mb-8 text-xs text-white/40">Last updated: {lastUpdated}</p>

          <div className="space-y-8">

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                1. Agreement to These Terms
              </h2>
              <p className="mb-3">
                These Terms of Service (the &ldquo;Terms&rdquo;) form a legally binding
                agreement between you and Johan Moreno dba HEADY.FM
                (&ldquo;HEADY.FM,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                governing your access to and use of{' '}
                <a href="https://heady.fm" className="text-emerald-400 underline">
                  heady.fm
                </a>{' '}
                and all related services, streams, content, and features (collectively, the
                &ldquo;Service&rdquo;).
              </p>
              <p>
                By accessing or using the Service, you agree to these Terms and to our{' '}
                <a href="/privacy" className="text-emerald-400 underline">
                  Privacy Policy
                </a>
                . If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                2. Eligibility
              </h2>
              <p>
                You must be at least 13 years old to use the Service. If you are under 18,
                you may only use the Service with the involvement and consent of a parent
                or legal guardian. By using the Service, you represent that you meet these
                requirements and that you have the legal capacity to enter into these
                Terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                3. Accounts
              </h2>
              <p className="mb-3">
                Some features of the Service require an account. When you create an
                account you agree to:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Provide accurate, current information and keep it up to date.</li>
                <li>Maintain the security of your password and login credentials.</li>
                <li>
                  Be responsible for all activity that occurs under your account, whether
                  authorized by you or not.
                </li>
                <li>
                  Notify us immediately at{' '}
                  <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
                    compliance@heady.fm
                  </a>{' '}
                  if you suspect any unauthorized access.
                </li>
              </ul>
              <p className="mt-3">
                We may suspend or terminate accounts that violate these Terms, contain
                false information, or are inactive for an extended period.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                4. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Use the Service for any unlawful purpose or in violation of any
                  applicable law or regulation.
                </li>
                <li>
                  Reproduce, redistribute, rebroadcast, sublicense, or commercially
                  exploit any portion of the Service or its content (including the live
                  stream, mixtapes, articles, or audio recordings) without our prior
                  written permission.
                </li>
                <li>
                  Use any robot, scraper, crawler, or other automated means to access,
                  collect, or harvest data from the Service, except for compliant search
                  engine indexing.
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the Service, our
                  systems, or other users&apos; accounts; probe, scan, or test the
                  vulnerability of any system; or breach any security or authentication
                  measures.
                </li>
                <li>
                  Interfere with or disrupt the Service, including by transmitting viruses,
                  malware, denial-of-service traffic, or excessive automated requests.
                </li>
                <li>
                  Post, transmit, or otherwise share content that is unlawful, infringing,
                  defamatory, harassing, threatening, hateful, sexually explicit, or
                  otherwise objectionable.
                </li>
                <li>
                  Impersonate any person or entity, or misrepresent your affiliation with
                  any person or entity.
                </li>
                <li>
                  Use the Service to send unsolicited promotional messages, advertising,
                  or spam to other users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                5. User Content
              </h2>
              <p className="mb-3">
                The Service lets you post comments, chat messages, profile information,
                and other content (&ldquo;User Content&rdquo;). You retain ownership of
                your User Content, but by submitting it, you grant HEADY.FM a worldwide,
                non-exclusive, royalty-free, sublicensable, transferable license to host,
                store, reproduce, modify, display, perform, and distribute your User
                Content in connection with operating, promoting, and improving the
                Service.
              </p>
              <p className="mb-3">You represent and warrant that:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>You own or have the necessary rights to your User Content.</li>
                <li>
                  Your User Content does not violate any third party&apos;s rights, any
                  law, or these Terms.
                </li>
              </ul>
              <p className="mt-3">
                We may, but are not obligated to, review, moderate, or remove any User
                Content at any time, with or without notice, for any reason — including
                content we believe violates these Terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                6. Our Intellectual Property
              </h2>
              <p>
                The Service, including its design, code, branding, original written
                content, graphics, and other materials we create, is the property of
                Johan Moreno dba HEADY.FM and is protected by copyright, trademark, and other
                intellectual property laws. Music, articles, and other third-party content
                made available through the Service remain the property of their respective
                owners and are made available under separate licenses (see our{' '}
                <a href="/licensing" className="text-emerald-400 underline">
                  Licensing
                </a>{' '}
                page). Nothing in these Terms grants you any right to use our trademarks
                or branding without our prior written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                7. Donations
              </h2>
              <p>
                HEADY.FM accepts voluntary listener contributions to support the station.
                Donations are not purchases. They do not entitle you to any equity,
                ownership, voting rights, or service-level guarantees, and are{' '}
                <strong className="text-white">non-refundable</strong> except where
                required by applicable law. Donations are processed by third-party payment
                providers whose own terms and privacy policies apply to the transaction.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                8. Third-Party Services &amp; Content
              </h2>
              <p>
                The Service may link to or integrate with third-party websites, services,
                or content (including streaming partners, embed providers, payment
                processors, and analytics tools). We do not control, endorse, or assume
                responsibility for any third-party services or content, and your use of
                them is at your own risk and subject to the third party&apos;s terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                9. Changes to the Service
              </h2>
              <p>
                We may modify, suspend, or discontinue any part of the Service at any time,
                with or without notice. We are not liable to you or any third party for
                any such modification, suspension, or discontinuation.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                10. Disclaimers
              </h2>
              <p className="mb-3 uppercase">
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
                without warranties of any kind, whether express or implied.
              </p>
              <p>
                To the maximum extent permitted by law, HEADY.FM and Johan Moreno
                disclaim all warranties, including implied warranties of merchantability,
                fitness for a particular purpose, non-infringement, and any warranties
                arising out of course of dealing or usage of trade. We do not warrant that
                the Service will be uninterrupted, error-free, secure, or free of viruses
                or other harmful components, or that any content (including the live
                stream) will be accurate, complete, or available at any given time.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                11. Limitation of Liability
              </h2>
              <p className="mb-3 uppercase">
                To the maximum extent permitted by law, in no event will HEADY.FM,
                Johan Moreno, or any of our employees, contractors, or agents be
                liable for any indirect, incidental, special, consequential, exemplary, or
                punitive damages, or for any loss of profits, revenue, data, goodwill, or
                other intangible losses, arising out of or relating to your use of or
                inability to use the Service.
              </p>
              <p>
                In no event will our aggregate liability for any claim arising out of or
                relating to the Service exceed the greater of (a) one hundred U.S. dollars
                (US $100) or (b) the amount, if any, you paid us in the twelve months
                preceding the event giving rise to the claim. Some jurisdictions do not
                allow the exclusion or limitation of certain damages, so portions of this
                section may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                12. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless HEADY.FM, Johan
                Moreno, and our employees, contractors, and agents from and against
                any claims, liabilities, damages, losses, and expenses (including
                reasonable attorneys&apos; fees) arising out of or related to (a) your use
                of the Service, (b) your User Content, (c) your violation of these Terms,
                or (d) your violation of any rights of another person or entity.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                13. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Service at any time, with
                or without cause and with or without notice. You may stop using the
                Service at any time. Sections that by their nature should survive
                termination (including intellectual property, disclaimers, limitation of
                liability, indemnification, and dispute resolution) will survive.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                14. Governing Law &amp; Disputes
              </h2>
              <p>
                These Terms are governed by the laws of the State of California, without
                regard to its conflict-of-laws principles. You agree that the state and
                federal courts located in California will have exclusive jurisdiction over
                any dispute arising out of or relating to these Terms or the Service, and
                you consent to the personal jurisdiction of those courts.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                15. Changes to These Terms
              </h2>
              <p>
                We may update these Terms from time to time. If we make material changes,
                we will update the &ldquo;Last updated&rdquo; date above and, where
                appropriate, provide additional notice. Your continued use of the Service
                after the changes take effect constitutes your acceptance of the updated
                Terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                16. Miscellaneous
              </h2>
              <p>
                These Terms, together with the Privacy Policy and any other policies
                referenced here, constitute the entire agreement between you and us
                regarding the Service. If any provision is found unenforceable, the
                remaining provisions will remain in full force and effect. Our failure to
                enforce any provision is not a waiver of that provision. You may not
                assign these Terms without our prior written consent; we may assign them
                freely.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                17. Contact
              </h2>
              <p>
                Questions about these Terms? Email{' '}
                <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
                  compliance@heady.fm
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

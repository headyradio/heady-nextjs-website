import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Music Licensing',
  description:
    'How HEADY.FM is licensed to broadcast: live stream licensing via Live365 and on-demand via Mixcloud.',
};

export default function LicensingPage() {
  const lastUpdated = 'June 27, 2026';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="text-sm leading-relaxed text-white/70">
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            Music Licensing
          </h1>
          <p className="mb-8 text-xs text-white/40">Last updated: {lastUpdated}</p>

          <div className="space-y-6">

            <p>
              HEADY.FM is an internet radio station operating in the United States. The
              station operates in accordance with U.S. laws which require Internet
              broadcasters to pay royalties to music holders for each stream on the web.
            </p>

            <p>
              HEADY.FM receives its non-interactive stream licensing for live broadcasts
              through Live365. Live365 is an internet radio platform that offers
              broadcasting packages including licensing in the following territories:
            </p>

            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">United States:</strong> SoundExchange, ASCAP,
                BMI, SESAC, GMR, Word Collections, AllTrack
              </li>
              <li>
                <strong className="text-white">Canada:</strong> SOCAN, Re:Sound
              </li>
              <li>
                <strong className="text-white">Mexico:</strong> EMMAC/SACM, SOMEXFON
              </li>
            </ul>

            <p>
              Please visit SoundExchange&rsquo;s preferred radio provider list which
              includes Live365 Broadcaster LLC dba Live365 for further proof &mdash;{' '}
              <a
                href="https://www.soundexchange.com/about/our-work/digital-radio-providers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline break-words"
              >
                soundexchange.com/about/our-work/digital-radio-providers
              </a>
              .
            </p>

            <p>
              On-demand streaming is powered by Mixcloud. Mixcloud is licensed and partner
              with many of the largest rights holders, record labels and publishers around
              the world.
            </p>

            <p>
              The service is an open platform for all to upload shows and live-stream to,
              and Mixcloud continually works with rights holders to identify, track,
              monetize or disable audio content on the platform, as they request.
            </p>

            <div className="space-y-2 pt-2">
              <p>
                Mixcloud copyright and licensing &mdash;{' '}
                <a
                  href="https://help.mixcloud.com/hc/en-us/sections/12677764154524-Copyright-and-licensing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline break-words"
                >
                  help.mixcloud.com/hc/en-us/sections/12677764154524-Copyright-and-licensing
                </a>
              </p>
              <p>
                Live365 licensing coverage &mdash;{' '}
                <a
                  href="https://help.live365.com/en/support/solutions/articles/43000573915-what-licensing-coverage-does-live365-provide-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline break-words"
                >
                  help.live365.com/en/support/solutions/articles/43000573915-what-licensing-coverage-does-live365-provide-
                </a>
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/60">
                Proof of Licensing
              </p>
              <a
                href="/live365-licensing-letter.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-emerald-100"
              >
                <FileText size={18} aria-hidden="true" />
                <span>Live365 Licensing Letter for HEADY.FM (PDF)</span>
              </a>
            </div>

            <p className="pt-4">
              For questions about licensing, please reach out to{' '}
              <a href="mailto:compliance@heady.fm" className="text-emerald-400 underline">
                compliance@heady.fm
              </a>
              .
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

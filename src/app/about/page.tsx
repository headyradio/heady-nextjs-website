import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'About',
  description:
    'HEADY.FM is a 24/7 commercial-free internet radio station dedicated to alternative, indie, and underground music. Independently operated by Johan Moreno.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="text-sm leading-relaxed text-white/70">
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            About HEADY.FM
          </h1>
          <p className="mb-8 text-xs text-white/40">Independent. Commercial-free. 24/7.</p>

          <div className="space-y-8">

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                The Signal
              </h2>
              <p>
                HEADY.FM is an internet radio station broadcasting alternative, indie, and
                underground music around the clock — no ads, no algorithm-chasing, no top
                forty filler. Just music our listeners actually want to hear, programmed by
                people who care about it.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                What We Play
              </h2>
              <p className="mb-3">
                Alternative rock, indie, post-punk, dream pop, shoegaze, garage, lo-fi,
                psych, and whatever else falls in the gravitational pull of those scenes.
                We lean toward emerging and underrepresented artists — the stuff bigger
                stations skip — without ignoring the records that built the genre.
              </p>
              <p>
                If you&apos;ve ever found a band through a friend instead of a playlist,
                HEADY is built for you.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                What You&apos;ll Find Here
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Live Stream:</strong> 24/7 commercial-free
                  radio with full track info, history, and the ability to save what
                  you&apos;re hearing.
                </li>
                <li>
                  <strong className="text-white">On-Demand Mixtapes:</strong> Recorded
                  shows and curated mixes you can revisit any time.
                </li>
                <li>
                  <strong className="text-white">HEADYZINE:</strong> Writing on music,
                  artists, and the scenes around them — interviews, reviews, and the
                  occasional rant.
                </li>
                <li>
                  <strong className="text-white">Community:</strong> Chat with other
                  listeners while a track is playing, leave comments on songs, and find
                  meetups happening in your city.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                Who Runs It
              </h2>
              <p>
                HEADY.FM is an independent operation, primarily run by Johan Moreno. The
                station is built and programmed by hand &mdash; not by a broadcasting
                conglomerate, not by an algorithm. Programming choices reflect that.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                How We Stay On Air
              </h2>
              <p>
                We&apos;re listener-supported. No ad reads, no pre-roll, no data brokering.
                Listener contributions cover streaming infrastructure, licensing fees, and
                the people keeping the signal going. If HEADY is part of your day,
                supporting the station keeps it there.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                Get In Touch
              </h2>
              <p className="mb-6">
                Press, partnership, music submissions, or just want to say hi? Send us a
                message and we&apos;ll get back to you.
              </p>
              <ContactForm />
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

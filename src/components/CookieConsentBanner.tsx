'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'cookie_consent';

function dispatchConsentEvent(value: 'granted' | 'denied') {
  window.dispatchEvent(
    new CustomEvent('cookieConsentUpdated', { detail: { consent: value } })
  );
}

// ─── Preferences Modal ────────────────────────────────────────────────────────

function PreferencesModal({ onClose }: { onClose: () => void }) {
  const current =
    typeof window !== 'undefined' ? localStorage.getItem(CONSENT_KEY) : null;

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    dispatchConsentEvent('granted');
    onClose();
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    dispatchConsentEvent('denied');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-black uppercase tracking-tight text-white">
          Cookie Preferences
        </h2>
        <p className="mb-4 text-sm text-white/60">
          We use Google Analytics to understand how visitors use HEADY.FM. No
          tracking cookies are set unless you accept. You can change your
          preference at any time.
        </p>

        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-white">
                Essential Cookies
              </p>
              <p className="text-xs text-white/50">
                Always active — required for the site to function (auth,
                preferences).
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                current === 'granted' ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Analytics Cookies
              </p>
              <p className="text-xs text-white/50">
                Google Analytics 4 — collects anonymous page view and session
                data to help us improve the site.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-2.5 text-sm font-bold text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-emerald-400"
          >
            Accept All
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          <Link href="/privacy-policy" className="hover:text-white/60 underline" onClick={onClose}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so the banner doesn't flash on initial render
      const t = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Allow other parts of the app to open the preferences modal
  useEffect(() => {
    function handleOpen() {
      setShowModal(true);
    }
    window.addEventListener('openCookiePreferences', handleOpen);
    return () => window.removeEventListener('openCookiePreferences', handleOpen);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    dispatchConsentEvent('granted');
    setShowBanner(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    dispatchConsentEvent('denied');
    setShowBanner(false);
  }

  return (
    <>
      {/* Preferences Modal */}
      {showModal && (
        <PreferencesModal onClose={() => setShowModal(false)} />
      )}

      {/* Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-gray-950/95 px-4 py-4 backdrop-blur-md md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl md:border">
          <p className="mb-1 text-sm font-bold text-white">
            We value your privacy
          </p>
          <p className="mb-4 text-xs text-white/60">
            We use Google Analytics to improve HEADY.FM. No tracking until you
            accept.{' '}
            <Link
              href="/privacy-policy"
              className="underline hover:text-white/80"
            >
              Learn more
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDecline}
              className="flex-1 rounded-full border border-white/20 bg-transparent px-3 py-2 text-xs font-bold text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 rounded-full bg-emerald-500 px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-emerald-400"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Manage Preferences Link ──────────────────────────────────────────────────
// Drop this anywhere (footer, settings page) to let users re-open preferences.

export function ManageCookiePreferencesLink({
  className,
}: {
  className?: string;
}) {
  function open() {
    window.dispatchEvent(new CustomEvent('openCookiePreferences'));
  }

  return (
    <button
      onClick={open}
      className={className ?? 'text-xs text-white/30 underline hover:text-white/60'}
    >
      Cookie Preferences
    </button>
  );
}

'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie_consent';

function dispatchConsentEvent(value: 'granted' | 'denied') {
  window.dispatchEvent(
    new CustomEvent('cookieConsentUpdated', { detail: { consent: value } })
  );
}

// ─── Privacy Policy Popup ─────────────────────────────────────────────────────
// Renders the privacy policy in an iframe at z-[201], above the banner and
// blocking overlay. The iframe sandboxes navigation so no links can escape.

function PrivacyPolicyPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-10">
      <div className="relative flex h-full w-full max-w-3xl max-h-[85vh] flex-col rounded-2xl border border-white/10 bg-gray-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="text-sm font-bold uppercase tracking-wide text-white">Privacy Policy</span>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* iframe — sandboxed so links stay inside and can't navigate the parent */}
        <iframe
          src="/privacy-policy"
          className="flex-1 w-full bg-black"
          sandbox="allow-same-origin allow-scripts"
          title="Privacy Policy"
        />
      </div>
    </div>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export function CookieConsentBanner() {
  const [show, setShow] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const t = setTimeout(() => setShow(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // Allow other parts of the app to re-open preferences
  useEffect(() => {
    function handleOpen() { setShow(true); }
    window.addEventListener('openCookiePreferences', handleOpen);
    return () => window.removeEventListener('openCookiePreferences', handleOpen);
  }, []);

  // Lock scroll while banner is visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    dispatchConsentEvent('granted');
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    dispatchConsentEvent('denied');
    setShow(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Full-screen interaction blocker — transparent, no click handler */}
      <div className="fixed inset-0 z-[199]" aria-hidden="true" />

      {/* Privacy policy popup sits above the blocker */}
      {showPrivacy && (
        <PrivacyPolicyPopup onClose={() => setShowPrivacy(false)} />
      )}

      {/* Banner — bottom-center card */}
      <div className="fixed bottom-4 left-1/2 z-[200] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 bg-gray-950/98 p-6 shadow-2xl backdrop-blur-md">
        <p className="mb-1.5 text-base font-bold text-white">We value your privacy</p>
        <p className="mb-5 text-sm text-white/60">
          We use marketing pixels, trackers and other tools to improve your
          experience while accessing HEADY.FM. You are unable to access HEADY.FM
          unless you make a selection.{' '}
          <button
            onClick={() => setShowPrivacy(true)}
            className="underline hover:text-white/80"
          >
            Learn more
          </button>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm font-bold text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400"
          >
            Accept
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Preferences Modal ────────────────────────────────────────────────────────

function PreferencesModal({ onClose, blocking }: { onClose: () => void; blocking: boolean }) {
  const current =
    typeof window !== 'undefined' ? localStorage.getItem(CONSENT_KEY) : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={blocking ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-black uppercase tracking-tight text-white">
          Cookie Preferences
        </h2>
        <p className="mb-4 text-sm text-white/60">
          We use marketing pixels, trackers and other tools to improve your
          experience while accessing HEADY.FM. No tracking is active unless you
          accept. You can change your preference at any time.
        </p>

        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-white">Essential Cookies</p>
              <p className="text-xs text-white/50">
                Always active — required for the site to function (auth, preferences).
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
              <p className="text-sm font-semibold text-white">Analytics &amp; Tracking</p>
              <p className="text-xs text-white/50">
                Marketing pixels, trackers and other tools — collects anonymous
                usage data to help us improve the site.
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
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/60"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Preferences Trigger ──────────────────────────────────────────────────────

export function CookiePreferencesTrigger() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    function handleOpen() { setShowModal(true); }
    window.addEventListener('openCookiePreferences', handleOpen);
    return () => window.removeEventListener('openCookiePreferences', handleOpen);
  }, []);

  return (
    <>
      {showModal && (
        <PreferencesModal onClose={() => setShowModal(false)} blocking={false} />
      )}
    </>
  );
}

// ─── Manage Preferences Link ──────────────────────────────────────────────────

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

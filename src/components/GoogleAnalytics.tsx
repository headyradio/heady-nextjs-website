'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function grantConsent() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function revokeConsent() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function GoogleAnalytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check stored consent on mount
    const stored = localStorage.getItem('cookie_consent');
    if (stored === 'granted') {
      setConsentGranted(true);
    }

    // Listen for real-time consent changes
    function handleConsentUpdate(e: Event) {
      const consent = (e as CustomEvent<{ consent: 'granted' | 'denied' }>)
        .detail.consent;
      if (consent === 'granted') {
        setConsentGranted(true);
        grantConsent();
      } else {
        setConsentGranted(false);
        revokeConsent();
      }
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () =>
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  // Fire gtag consent update once the GA script has loaded
  function handleGALoad() {
    if (consentGranted) grantConsent();
  }

  if (!GA_ID || !consentGranted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onLoad={handleGALoad}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}

// Extend the Window type to satisfy TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

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
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    // Opt-out model: analytics is ON by default, OFF only if user opted out
    const stored = localStorage.getItem('cookie_consent');
    if (stored === 'denied') {
      setOptedOut(true);
      revokeConsent();
    }

    // Listen for real-time consent changes
    function handleConsentUpdate(e: Event) {
      const consent = (e as CustomEvent<{ consent: 'granted' | 'denied' }>)
        .detail.consent;
      if (consent === 'granted') {
        setOptedOut(false);
        grantConsent();
      } else {
        setOptedOut(true);
        revokeConsent();
      }
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () =>
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  if (!GA_ID || optedOut) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
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

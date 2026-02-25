import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://heady.fm"),
  title: {
    default: "Alternative & Indie Rock Radio - HEADY.FM",
    template: "%s | HEADY.FM",
  },
  description:
    "Stream commercial-free music 24/7 on HEADY.FM. Discover underground music, your favorite tracks, emerging artists, and deep cuts without interruptions. Listen online now.",
  keywords: [
    "indie rock radio",
    "commercial free radio",
    "underground music",
    "streaming radio",
    "internet radio",
    "heady fm",
  ],
  authors: [{ name: "HEADY.FM" }],
  creator: "HEADY.FM",
  publisher: "HEADY.FM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://heady.fm",
    siteName: "HEADY.FM",
    title: "Alternative & Indie Rock Radio - HEADY.FM",
    description:
      "Stream commercial-free music 24/7 on HEADY.FM. Discover underground music, your favorite tracks, emerging artists, and deep cuts without interruptions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HEADY.FM Radio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternative & Indie Rock Radio - HEADY.FM",
    description: "Stream commercial-free music 24/7 on HEADY.FM",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <FloatingChatWidget />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

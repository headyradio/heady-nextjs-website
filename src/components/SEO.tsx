"use client";

// In Next.js App Router, SEO is handled via the Metadata API in page.tsx and layout.tsx files.
// This component is kept for compatibility but returns null since Next.js handles metadata differently.

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'music.song' | 'music.album' | 'music.playlist' | 'profile';
  structuredData?: object;
  noindex?: boolean;
  canonical?: string;
  imageWidth?: string;
  imageHeight?: string;
}

export const SEO = (_props: SEOProps) => {
  // In Next.js App Router, metadata is handled by the Metadata API in page.tsx/layout.tsx
  // This component is a no-op for compatibility with client components that previously used react-helmet-async
  return null;
};

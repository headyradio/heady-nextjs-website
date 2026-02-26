import Image from "next/image";
import { PortableText, type PortableTextReactComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/client";
import type { PortableTextBlock } from "@/lib/sanity/types";

interface ArticleBodyProps {
  body: PortableTextBlock[];
}

const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: { asset?: { _ref?: string, _id?: string }; alt?: string } }) => {
      // The GROQ query expands the asset, so it might have _id instead of _ref
      if (!value?.asset) return null;
      return (
        <figure className="my-8 -mx-4 md:mx-0">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-white/40 text-sm mt-3 italic">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2
        id={typeof children === "string" ? children.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : undefined}
        className="text-2xl md:text-3xl font-black text-white mt-12 mb-4 tracking-tight scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={typeof children === "string" ? children.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : undefined}
        className="text-xl md:text-2xl font-bold text-white mt-10 mb-3 tracking-tight scroll-mt-24"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-bold text-white mt-8 mb-2 scroll-mt-24">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-white/80 leading-relaxed mb-6 text-base md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 border-l-4 border-[hsl(150,55%,35%)] bg-white/5 py-4 pr-6 rounded-r-xl italic text-white/70 text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-white/80 text-base md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-white/80 text-base md:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/10 text-[hsl(150,55%,35%)] px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    "strike-through": ({ children }) => <s className="text-white/40">{children}</s>,
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-[hsl(150,55%,35%)] hover:text-white underline underline-offset-4 transition-colors"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <div className="prose-custom max-w-none">
      <PortableText value={body} components={portableTextComponents} />
    </div>
  );
}

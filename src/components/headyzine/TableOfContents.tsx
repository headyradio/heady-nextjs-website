"use client";

import { useEffect, useState } from "react";
import type { PortableTextBlock } from "@/lib/sanity/types";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  body: PortableTextBlock[];
}

function extractHeadings(body: PortableTextBlock[]): TOCItem[] {
  return body
    .filter((block) => block._type === "block" && (block.style === "h2" || block.style === "h3"))
    .map((block) => {
      const text =
        block.children
          ?.filter((child) => child._type === "span")
          .map((child) => child.text || "")
          .join("") || "";
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      return {
        id,
        text,
        level: block.style === "h2" ? 2 : 3,
      };
    })
    .filter((item) => item.text.length > 0);
}

export function TableOfContents({ body }: TableOfContentsProps) {
  const headings = extractHeadings(body);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-28" aria-label="Table of contents">
      <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4 italic">
        Jump to section
      </h4>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
              className={`text-left text-sm transition-colors w-full hover:text-[hsl(150,55%,35%)] ${
                level === 3 ? "pl-4" : ""
              } ${
                activeId === id
                  ? "text-[hsl(150,55%,35%)] font-semibold"
                  : "text-white/60"
              }`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/lib/sanity/client";
import { allArticlesQuery } from "@/lib/sanity/queries";
import type { ArticleListResult } from "@/lib/sanity/types";

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "0", 10);
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  try {
    const result = await sanityFetch<ArticleListResult>({
      query: allArticlesQuery,
      params: { category, tag, start, end },
      revalidate: 60,
    });

    return NextResponse.json({
      articles: result?.articles ?? [],
      total: result?.total ?? 0,
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { articles: [], total: 0, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

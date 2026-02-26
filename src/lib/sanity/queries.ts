// GROQ queries for HeadyZine articles
import { groq } from "next-sanity";

// Shared projection for article fields
const articleProjection = `{
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  publishedAt,
  readingTime,
  featuredImage {
    ...,
    asset->
  },
  author-> {
    _id,
    name,
    slug,
    image {
      ...,
      asset->
    },
    bio
  },
  category-> {
    _id,
    title,
    slug,
    description
  },
  tags[]-> {
    _id,
    title,
    slug
  },
  seo
}`;

// Full article with body content
const articleWithBodyProjection = `{
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  excerpt,
  publishedAt,
  readingTime,
  featuredImage {
    ...,
    asset->
  },
  author-> {
    _id,
    name,
    slug,
    image {
      ...,
      asset->
    },
    bio
  },
  category-> {
    _id,
    title,
    slug,
    description
  },
  tags[]-> {
    _id,
    title,
    slug
  },
  body[] {
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  },
  seo
}`;

// Paginated list of articles with optional category/tag filters
export const allArticlesQuery = groq`{
  "articles": *[_type == "newsArticle"
    && ($category == "" || category->slug.current == $category)
    && ($tag == "" || $tag in tags[]->slug.current)
  ] | order(publishedAt desc) [$start...$end] ${articleProjection},
  "total": count(*[_type == "newsArticle"
    && ($category == "" || category->slug.current == $category)
    && ($tag == "" || $tag in tags[]->slug.current)
  ])
}`;

// Single article by slug
export const articleBySlugQuery = groq`*[_type == "newsArticle" && slug.current == $slug][0] ${articleWithBodyProjection}`;

// Latest N articles (for homepage featured)
export const latestArticlesQuery = groq`*[_type == "newsArticle"] | order(publishedAt desc) [0...$limit] ${articleProjection}`;

// Related articles (same category, excluding current article)
export const relatedArticlesQuery = groq`*[_type == "newsArticle" && category->slug.current == $categorySlug && _id != $currentId] | order(publishedAt desc) [0...3] ${articleProjection}`;

// Fallback: recent articles from any category (excluding current)
export const recentArticlesQuery = groq`*[_type == "newsArticle" && _id != $currentId] | order(publishedAt desc) [0...3] ${articleProjection}`;

// All categories
export const allCategoriesQuery = groq`*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`;

// All tags
export const allTagsQuery = groq`*[_type == "tag"] | order(title asc) {
  _id,
  title,
  slug
}`;

// All article slugs (for generateStaticParams)
export const allArticleSlugsQuery = groq`*[_type == "newsArticle" && defined(slug.current)][].slug.current`;

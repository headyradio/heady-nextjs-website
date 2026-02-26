// Sanity CMS Types for HeadyZine

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  imageCredit?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage;
  bio?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: SanityImage;
}

// Portable Text block types
export interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{
    _key: string;
    _type: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
  level?: number;
  listItem?: string;
}

export interface Article {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  author?: Author;
  category?: Category;
  featuredImage?: SanityImage;
  body?: PortableTextBlock[];
  tags?: Tag[];
  readingTime?: number;
  seo?: SEO;
}

export interface ArticleListResult {
  articles: Article[];
  total: number;
}

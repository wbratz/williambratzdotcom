export type PostMetadata = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  description: string;
  photo: string;
  banner: string;
  imageAlt: string;
  topics: string[];
  series?: string;
  seriesOrder?: number;
  featured: boolean;
};

export type PostSummary = PostMetadata & {
  readingTime: number;
};

export type Post = PostSummary & {
  body: string;
};

export function getAllPosts(): Post[];
export function getAllPostSummaries(): PostSummary[];
export function getPostBySlug(slug: string): Post;
export function getPostSlugs(): string[];
export function getAllTopics(): string[];
export function getSeriesPosts(series: string): PostSummary[];
export function getRelatedPosts(slug: string, limit?: number): PostSummary[];
export function getAdjacentPosts(slug: string): {
  newer: PostSummary | null;
  older: PostSummary | null;
};
export function toSummary(post: Post): PostSummary;

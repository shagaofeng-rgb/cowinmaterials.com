export type BlogArticle = {
  id: string;
  slug: string;
  classId: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  authorId: string;
  imageUrl: string | null;
  publishedAt: string;
  updatedAt: string;
};


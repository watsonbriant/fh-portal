export type NavSection = "portal" | "handbook";

export interface Article {
  slug: string;
  title: string;
  description?: string;
  section: NavSection;
  category: string;
}

export interface Category {
  id: string;
  title: string;
  section: NavSection;
  articles: Article[];
}

export const categories: Category[] = [
  {
    id: "portal",
    title: "Portal",
    section: "portal",
    articles: [
      {
        slug: "welcome",
        title: "Welcome to the Portal",
        description: "Overview for staff and contractors",
        section: "portal",
        category: "portal",
      },
      {
        slug: "access-and-login",
        title: "Access & Login",
        description: "How to access systems and credentials",
        section: "portal",
        category: "portal",
      },
    ],
  },
  {
    id: "handbook",
    title: "Handbook",
    section: "handbook",
    articles: [
      {
        slug: "code-of-conduct",
        title: "Code of Conduct",
        description: "Staff and contractor expectations",
        section: "handbook",
        category: "handbook",
      },
      {
        slug: "staff-handbook",
        title: "Staff Handbook",
        description: "Full staff handbook",
        section: "handbook",
        category: "handbook",
      },
    ],
  },
];

export function getAllArticles(): Article[] {
  return categories.flatMap((c) => c.articles);
}

export function getArticle(
  section: NavSection,
  slug: string
): Article | undefined {
  return getAllArticles().find((a) => a.section === section && a.slug === slug);
}

export function getCategoriesForSection(
  section: NavSection
): Category[] {
  return categories.filter((c) => c.section === section);
}

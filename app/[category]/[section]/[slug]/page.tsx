import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBody } from "@/components/ArticleBody";
import { getArticle, getSections, getSectionWithCategory } from "@/lib/database";

interface PageProps {
  params: Promise<{ category: string; section: string; slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, section, slug } = await params;
  
  // Validate category exists
  const validCategories = await getSections();
  if (!validCategories.includes(category)) {
    notFound();
  }

  // Get the article
  const article = await getArticle(category, section, slug);
  if (!article) {
    notFound();
  }

  // Get section info for breadcrumb
  const sectionInfo = await getSectionWithCategory(section);
  const sectionTitle = sectionInfo?.title || section;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href={`/${category}`}
          className="hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
        <span>/</span>
        <span>{sectionTitle}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {article.title}
      </h1>
      {article.description && (
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {article.description}
        </p>
      )}
      <div className="mt-8">
        <ArticleBody content={article.content} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { supabase } = await import("@/lib/supabase");

  // Get all articles with their section and category info
  const { data: articles } = await supabase
    .from("z_p_articles")
    .select(`
      slug,
      section_id,
      z_p_sections!inner (
        id,
        category_id,
        z_p_categories!inner (
          section
        )
      )
    `);

  return (articles || []).map((article: any) => ({
    category: article.z_p_sections.z_p_categories.section,
    section: article.section_id,
    slug: article.slug,
  }));
}
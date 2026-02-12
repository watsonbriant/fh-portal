import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBody } from "@/components/ArticleBody";
import { getArticle, getArticlePrevNext, getSections, getSectionWithCategory } from "@/lib/database";

function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(updatedAt));
}

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

  const { prev, next } = await getArticlePrevNext(category, section, slug);

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
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Last updated:
        </span>
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          {formatUpdatedAt(article.updated_at)}
        </span>
      </div>
      <hr className="mt-6 border-0 border-t border-zinc-200 dark:border-zinc-700" />
      <div className="mt-8">
        <ArticleBody content={article.content} />
      </div>
      <hr className="mt-10 border-0 border-t border-zinc-200 dark:border-zinc-700" />
      <nav
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        aria-label="Previous and next article"
      >
        {prev ? (
          <Link
            href={prev.href}
            className="flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 px-6 py-4 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
            <span className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400 px-1">
              {prev.sectionTitle}
            </span>
            <span className="mt-0.5 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50 px-1">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="rounded-lg border border-transparent px-6 py-4" aria-hidden />
        )}
        {next ? (
          <Link
            href={next.href}
            className="flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 px-6 py-4 text-right transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Next
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400 px-1">
              {next.sectionTitle}
            </span>
            <span className="mt-0.5 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50 px-1">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="rounded-lg border border-transparent px-6 py-4 sm:col-start-2" aria-hidden />
        )}
      </nav>
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
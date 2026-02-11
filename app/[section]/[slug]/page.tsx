import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBody } from "@/components/ArticleBody";
import { getArticle, getSections } from "@/lib/database";

interface PageProps {
  params: Promise<{ section: string; slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const validSections = await getSections();

  if (!validSections.includes(section)) {
    notFound();
  }

  const article = await getArticle(section, slug);

  if (!article) {
    notFound();
  }

  const sectionTitle =
    article.section.charAt(0).toUpperCase() + article.section.slice(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/${section}`}
        className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← {sectionTitle}
      </Link>
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

  const { data: articles } = await supabase
    .from("z_p_articles")
    .select("section, slug");

  return (articles || []).map((article) => ({
    section: article.section,
    slug: article.slug,
  }));
}

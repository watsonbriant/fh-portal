import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getCategoriesForSection } from "@/lib/content";
import { getArticleContent } from "@/lib/article-content";
import { ArticleBody } from "@/components/ArticleBody";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HandbookArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle("handbook", slug);
  const content = getArticleContent(slug);

  if (!article || !content) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/handbook"
        className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Handbook
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {content.title}
      </h1>
      <div className="mt-6">
        <ArticleBody content={content.content} />
      </div>
    </article>
  );
}

export function generateStaticParams() {
  const handbook = getCategoriesForSection("handbook");
  return handbook.flatMap((c) => c.articles.map((a) => ({ slug: a.slug })));
}

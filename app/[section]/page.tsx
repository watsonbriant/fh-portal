import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesForSection, getSections } from "@/lib/database";

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function SectionPage({ params }: PageProps) {
  const { section } = await params;
  const validSections = await getSections();

  if (!validSections.includes(section)) {
    notFound();
  }

  const categories = await getCategoriesForSection(section);
  const sectionTitle =
    categories[0]?.title ?? section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {sectionTitle}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Resources and guides for staff and contractors.
      </p>

      <div className="mt-10 space-y-8">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {category.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {(category.articles || []).map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/${section}/${article.slug}`}
                    className="block rounded-md p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {article.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesForSection, getSections } from "@/lib/database";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  const validCategories = await getSections();
  if (!validCategories.includes(category)) {
    notFound();
  }

  const categories = await getCategoriesForSection(category);
  const categoryTitle =
    categories[0]?.title ?? category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {categoryTitle}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Resources and guides for staff and contractors.
      </p>

      <div className="mt-10 space-y-8">
        {categories.map((cat) => (
          <div key={cat.id}>
            {(cat.sections || []).map((section) => (
              <section key={section.id} className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {(section.articles || []).map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/${category}/${section.id}/${article.slug}`}
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
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const validCategories = await getSections();
  return validCategories.map((category) => ({ category }));
}
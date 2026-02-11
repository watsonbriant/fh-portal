import Link from "next/link";
import { getCategoriesForSection } from "@/lib/content";

export default function HandbookPage() {
  const categories = getCategoriesForSection("handbook");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Handbook
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Policies and official documents.
      </p>
      <div className="mt-8 space-y-8">
        {categories.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {cat.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {cat.articles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/handbook/${a.slug}`}
                    className="block rounded-md py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <span className="font-medium">{a.title}</span>
                    {a.description && (
                      <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-500">
                        — {a.description}
                      </span>
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

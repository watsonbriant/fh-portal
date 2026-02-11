"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories, getCategoriesForSection, type NavSection } from "@/lib/content";

function getHref(section: NavSection, slug: string) {
  return `/${section}/${slug}`;
}

interface SidebarProps {
  section: NavSection;
}

export function Sidebar({ section }: SidebarProps) {
  const pathname = usePathname();
  const sectionCategories = getCategoriesForSection(section);

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto py-4 pl-4 pr-2">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {section === "portal" && "Portal"}
          {section === "handbook" && "Handbook"}
        </p>
        <nav>
          <ul className="space-y-0.5">
            {sectionCategories.flatMap((category) =>
              category.articles.map((article) => {
                const href = getHref(section, article.slug);
                const isActive = pathname === href;
                return (
                  <li key={article.slug}>
                    <Link
                      href={href}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                      }`}
                    >
                      {article.title}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export function SidebarAll() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto py-4 pl-4 pr-2">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          All
        </p>
        <nav className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <p className="mb-1 px-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {category.title}
              </p>
              <ul className="space-y-0.5">
                {category.articles.map((article) => {
                  const href = getHref(article.section, article.slug);
                  const isActive = pathname === href;
                  return (
                    <li key={article.slug}>
                      <Link
                        href={href}
                        className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        }`}
                      >
                        {article.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

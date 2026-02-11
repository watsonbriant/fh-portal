"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllCategories, getCategoriesForSection, type Category, type NavSection } from "@/lib/database";

function getHref(section: NavSection, slug: string) {
  return `/${section}/${slug}`;
}

function DailyBibleVerse() {
  return (
    <div className="mb-4 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <iframe
        src="/daily-verse.html"
        title="Daily Bible Verse"
        className="h-[200px] w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

interface SidebarProps {
  section: NavSection;
}

export function Sidebar({ section }: SidebarProps) {
  const pathname = usePathname();
  const [sectionCategories, setSectionCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const categories = await getCategoriesForSection(section);
      setSectionCategories(categories);
    }
    loadCategories();
  }, [section]);

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto py-4 pl-4 pr-2">
        <DailyBibleVerse />
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {sectionCategories[0]?.title ?? section.charAt(0).toUpperCase() + section.slice(1)}
        </p>
        <nav>
          <ul className="space-y-0.5">
            {sectionCategories.flatMap((category) =>
              (category.articles || []).map((article) => {
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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    }
    loadCategories();
  }, []);

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto py-4 pl-4 pr-2">
        <DailyBibleVerse />
        <nav className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <p className="mb-1 px-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {category.title}
              </p>
              <ul className="space-y-0.5">
                {(category.articles || []).map((article) => {
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
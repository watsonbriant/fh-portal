"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAllCategories, getCategoriesForSection, type Category, type NavSection } from "@/lib/database";

function getHref(categorySection: string, sectionId: string, slug: string) {
  return `/${categorySection}/${sectionId}/${slug}`;
}

function DailyBibleVerse() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "dailyVerseResize" && typeof event.data.height === "number") {
        setIframeHeight(event.data.height);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="mb-4 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <p className="border-b border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Verse of the Day
      </p>
      <iframe
        ref={iframeRef}
        src="/daily-verse.html"
        title="Daily Bible Verse"
        className="w-full border-0"
        style={{ height: iframeHeight !== null ? iframeHeight + 2 : 80 }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

interface SidebarProps {
  categorySection: NavSection;
}

export function Sidebar({ categorySection }: SidebarProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategoriesForSection(categorySection);
      setCategories(cats);
    }
    loadCategories();
  }, [categorySection]);

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-y-auto py-4 pl-4 pr-2">
        <DailyBibleVerse />
        <nav className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {category.title}
              </p>
              {(category.sections || []).map((section) => (
                <div key={section.id} className="mb-3">
                  <p className="mb-1 px-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {(section.articles || []).map((article) => {
                      const href = getHref(category.section, section.id, article.slug);
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
            </div>
          ))}
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
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {category.title}
              </p>
              {(category.sections || []).map((section) => (
                <div key={section.id} className="mb-3">
                  <p className="mb-1 px-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {(section.articles || []).map((article) => {
                      const href = getHref(category.section, section.id, article.slug);
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
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
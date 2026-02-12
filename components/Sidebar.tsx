"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { getAllCategories, getCategoriesForSection, type Category, type NavSection } from "@/lib/database";

function getHref(categorySection: string, sectionId: string, slug: string) {
  return `/${categorySection}/${sectionId}/${slug}`;
}

function getSectionKey(categorySection: string, sectionId: string): string {
  return `${categorySection}:${sectionId}`;
}

function getCurrentSectionFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length >= 3 ? getSectionKey(parts[0], parts[1]) : null;
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
  const { isMobile, sidebarOpen, setSidebarOpen, navItems } = useLayout();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const current = getCurrentSectionFromPath(pathname);
    return current ? new Set([current]) : new Set();
  });

  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategoriesForSection(categorySection);
      setCategories(cats);
    }
    loadCategories();
  }, [categorySection]);

  useEffect(() => {
    const current = getCurrentSectionFromPath(pathname);
    setExpandedSections(current ? new Set([current]) : new Set());
  }, [pathname]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const asideClass =
    "flex w-64 flex-col overflow-hidden border-r border-zinc-200 " +
    (isMobile
      ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out bg-white dark:bg-zinc-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
      : "shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50");

  return (
    <aside className={asideClass}>
      <div className="min-h-0 flex-1 overflow-y-auto py-4 px-2">
        {isMobile && (
          <nav className="mb-4 space-y-0.5 border-b border-zinc-200 pb-4 dark:border-zinc-700">
            {navItems
              .filter((item) => item.href === "/")
              .map((item) => {
                const isActive = pathname === "/";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        )}
        <DailyBibleVerse />
        <nav className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={index > 0 ? "border-t border-zinc-200 pt-4 dark:border-zinc-700" : ""}
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {category.title}
              </p>
              {(category.sections || []).map((section) => {
                const sectionKey = getSectionKey(category.section, section.id);
                const isExpanded = expandedSections.has(sectionKey);
                return (
                  <div key={section.id} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(sectionKey)}
                      className="mb-0.5 flex w-full items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    >
                      <span
                        className={`shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      >
                        ▶
                      </span>
                      {section.title}
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <ul className="space-y-0.5 py-2">
                          {(section.articles || []).map((article) => {
                            const href = getHref(category.section, section.id, article.slug);
                            const isActive = pathname === href;
                            return (
                              <li key={article.slug}>
                                <Link
                                  href={href}
                                  onClick={() => isMobile && setSidebarOpen(false)}
                                  className={`block rounded-md px-2 py-1 text-sm leading-[0.875rem] transition-colors ${
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
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function SidebarAll() {
  const pathname = usePathname();
  const { isMobile, sidebarOpen, setSidebarOpen, navItems } = useLayout();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const current = getCurrentSectionFromPath(pathname);
    return current ? new Set([current]) : new Set();
  });

  useEffect(() => {
    async function loadCategories() {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const current = getCurrentSectionFromPath(pathname);
    setExpandedSections(current ? new Set([current]) : new Set());
  }, [pathname]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const asideClass =
    "flex w-64 flex-col overflow-hidden border-r border-zinc-200 " +
    (isMobile
      ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out bg-white dark:bg-zinc-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
      : "shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50");

  return (
    <aside className={asideClass}>
      <div className="min-h-0 flex-1 overflow-y-auto py-4 px-2">
        {isMobile && (
          <nav className="mb-4 space-y-0.5 border-b border-zinc-200 pb-4 dark:border-zinc-700">
            {navItems
              .filter((item) => item.href === "/")
              .map((item) => {
                const isActive = pathname === "/";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        )}
        <DailyBibleVerse />
        <nav className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={index > 0 ? "border-t border-zinc-200 pt-4 dark:border-zinc-700" : ""}
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {category.title}
              </p>
              {(category.sections || []).map((section) => {
                const sectionKey = getSectionKey(category.section, section.id);
                const isExpanded = expandedSections.has(sectionKey);
                return (
                  <div key={section.id} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(sectionKey)}
                      className="mb-1.5 flex w-full items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    >
                      <span
                        className={`shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      >
                        ▶
                      </span>
                      {section.title}
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <ul className="space-y-0.5 py-2">
                          {(section.articles || []).map((article) => {
                            const href = getHref(category.section, section.id, article.slug);
                            const isActive = pathname === href;
                            return (
                              <li key={article.slug}>
                                <Link
                                  href={href}
                                  onClick={() => isMobile && setSidebarOpen(false)}
                                  className={`block rounded-md px-2 py-0.5 text-sm transition-colors ${
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
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearch } from "@/contexts/SearchContext";

export type SearchResultItem = {
  href: string;
  title: string;
  sectionTitle: string;
  snippet: string | null;
};

const DEBOUNCE_MS = 300;

export function SearchModal() {
  const { open, setOpen } = useSearch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setSelectedIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : 0));
        return;
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, selectedIndex, router, setOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const child = el.children[selectedIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, results]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60"
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <div
        className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-700">
          <svg
            className="h-5 w-5 shrink-0 text-zinc-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-50 dark:placeholder-zinc-500"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[selectedIndex]
                ? `search-result-${selectedIndex}`
                : undefined
            }
          />
          <kbd className="hidden rounded border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 sm:inline-block">
            ESC
          </kbd>
        </div>
        <div
          id="search-results"
          ref={listRef}
          className="max-h-[min(60vh,400px)] overflow-y-auto py-2"
          role="listbox"
        >
          {!query.trim() && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Start typing to search…
            </div>
          )}
          {query.trim() && loading && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Searching…
            </div>
          )}
          {query.trim() && !loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No articles found.
            </div>
          )}
          {query.trim() &&
            !loading &&
            results.length > 0 &&
            results.map((item, i) => (
                <a
                  key={item.href}
                  id={`search-result-${i}`}
                  href={item.href}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href);
                    setOpen(false);
                  }}
                  className={`mx-2 flex flex-col rounded-lg px-3 py-2.5 ${
                    i === selectedIndex
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {item.title}
                  </span>
                  <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {item.sectionTitle}
                  </span>
                  {item.snippet && (
                    <span className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.snippet}
                    </span>
                  )}
                </a>
              ))}
        </div>
      </div>
    </>
  );
}

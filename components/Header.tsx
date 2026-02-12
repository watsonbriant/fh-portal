"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearch } from "@/contexts/SearchContext";
import { useLayout } from "@/contexts/LayoutContext";

export function Header() {
  const pathname = usePathname();
  const { setOpen: setSearchOpen } = useSearch();
  const { navItems, isMobile, setSidebarOpen } = useLayout();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/80">
      {isMobile && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-ml-1 rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          aria-label="Open menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50"
      >
        <Image
          src="/Logo.jpg"
          alt="Freedom House"
          width={32}
          height={32}
          className="rounded-full object-contain"
        />
        <span>Portal</span>
      </Link>
      {!isMobile && (
        <nav className="flex flex-1 items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
      <div className="flex flex-1 justify-end md:flex-none space-x-2">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-md border border-zinc-200 py-1.5 px-2 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
          aria-label="Search articles (Cmd+K)"
        >
          <svg
            className="h-4 w-4"
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
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-xs dark:border-zinc-600 dark:bg-zinc-900 lg:inline-block">
            ⌘K
          </kbd>
        </button>
        <form action="/api/auth/logout" method="POST" className="flex">
          <button
            type="submit"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
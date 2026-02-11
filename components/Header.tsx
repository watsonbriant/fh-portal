"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getNavigationItems, type NavigationItem } from "@/lib/database";

export function Header() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    async function loadNavItems() {
      const items = await getNavigationItems();
      setNavItems(items);
    }
    loadNavItems();
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-6 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/80">
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
    </header>
  );
}
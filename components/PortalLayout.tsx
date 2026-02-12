"use client";

import { SearchProvider } from "@/contexts/SearchContext";
import { Header } from "./Header";
import { SearchModal } from "./SearchModal";

export function PortalLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-zinc-950">
        <Header />
        <div className="flex min-h-0 flex-1">
          {sidebar}
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <SearchModal />
    </SearchProvider>
  );
}

"use client";

import { useEffect } from "react";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { Header } from "./Header";
import { SearchModal } from "@/components/SearchModal";

function PortalLayoutInner({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { isMobile, sidebarOpen, setSidebarOpen } = useLayout();

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-zinc-950">
      <Header />
      <div className="relative flex min-h-0 flex-1">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/40 dark:bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebar}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <SearchModal />
    </div>
  );
}

export function PortalLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <LayoutProvider>
        <PortalLayoutInner sidebar={sidebar}>{children}</PortalLayoutInner>
      </LayoutProvider>
    </SearchProvider>
  );
}

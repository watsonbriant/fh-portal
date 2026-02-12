"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getNavigationItems, type NavigationItem } from "@/lib/database";

const MOBILE_BREAKPOINT = 768;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const listener = () => setMatches(m.matches);
    m.addEventListener("change", listener);
    return () => m.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

type LayoutContextValue = {
  navItems: NavigationItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  useEffect(() => {
    getNavigationItems().then(setNavItems);
  }, []);

  const setSidebarOpenStable = useCallback((open: boolean) => {
    setSidebarOpen(open);
  }, []);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  return (
    <LayoutContext.Provider
      value={{
        navItems,
        sidebarOpen,
        setSidebarOpen: setSidebarOpenStable,
        isMobile,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

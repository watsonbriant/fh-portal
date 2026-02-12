"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CopyablePill } from "@/components/CopyablePill";

const EASTERN = "America/New_York";

function ordinal(n: number): string {
  const s = n % 10;
  const t = n % 100;
  if (s === 1 && t !== 11) return `${n}st`;
  if (s === 2 && t !== 12) return `${n}nd`;
  if (s === 3 && t !== 13) return `${n}rd`;
  return `${n}th`;
}

function getEasternDateString(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = Number(parts.find((p) => p.type === "day")?.value ?? "0");
  return `${weekday}, ${month} ${ordinal(day)}`;
}

function getEasternTimeString(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

const timePillClasses =
  "inline-flex items-center rounded-full border-0 px-4 py-2 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800";

const linkPillClasses =
  "inline-flex items-center rounded-full border-0 px-4 py-2 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 no-underline transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-900";

export function HomeComponents() {
  const [dateStr] = useState(() => getEasternDateString());
  const [timeStr, setTimeStr] = useState<string | null>(null);

  useEffect(() => {
    setTimeStr(getEasternTimeString());
    const id = setInterval(() => setTimeStr(getEasternTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2 pb-8">
      <div className="flex flex-wrap items-start justify-center gap-3 pb-1">
        <h2 className="m-0 flex min-h-9 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {dateStr}
        </h2>
        <span className={timePillClasses} aria-live="polite">
          {timeStr ?? "—:—:—"}
        </span>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-3 pb-1">
        <h2 className="m-0 flex min-h-9 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          WiFi Password
        </h2>
        <CopyablePill text="X5Y6qx%4Q9" />
      </div>
      <div className="flex flex-wrap items-start justify-center gap-3 pb-1">
        <h2 className="m-0 flex min-h-9 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Churchwide Calendar
        </h2>
        <Link
          href="https://app.espace.cool/ClientApi/FullMonth/17001?calendarId=2032"
          target="_blank"
          rel="noopener noreferrer"
          className={linkPillClasses}
        >
          eSPACE
        </Link>
      </div>
    </div>
  );
}

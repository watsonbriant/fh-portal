"use client";

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

export function EasternDateAndTime() {
  const [dateStr] = useState(() => getEasternDateString());
  const [timeStr, setTimeStr] = useState<string | null>(null);

  useEffect(() => {
    setTimeStr(getEasternTimeString());
    const id = setInterval(() => setTimeStr(getEasternTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-start gap-3">
        <h2 className="m-0 flex min-h-9 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {dateStr}
        </h2>
        <span className={timePillClasses} aria-live="polite">
          {timeStr ?? "—:—:—"}
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-3 pt-1">
        <h2 className="m-0 flex min-h-9 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          WiFi Password
        </h2>
        <CopyablePill text="X5Y6qx%4Q9" />
      </div>
    </div>
  );
}

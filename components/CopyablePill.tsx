"use client";

import { useState, useCallback } from "react";

type CopyablePillProps = {
  text: string;
  className?: string;
};

const checkmark = (
  <svg
    aria-hidden
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export function CopyablePill({ text, className = "" }: CopyablePillProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const baseClasses =
    "inline-flex cursor-pointer items-center gap-2 rounded-full border-0 px-4 py-2 font-mono text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const defaultClasses =
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-400 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-900";
  const copiedClasses =
    "bg-green-500 text-white focus:ring-green-400 dark:bg-green-600 dark:focus:ring-green-500 dark:focus:ring-offset-zinc-900";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${copied ? copiedClasses : defaultClasses} ${className}`}
      title="Click to copy"
    >
      {copied ? (
        <>
          {checkmark}
          <span>Copied!</span>
        </>
      ) : (
        text
      )}
    </button>
  );
}

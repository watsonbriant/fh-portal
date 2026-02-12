"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <Image
            src="/Logo.jpg"
            alt="Freedom House"
            width={64}
            height={64}
            className="rounded-full object-contain"
          />
          <span className="text-3xl">Portal</span>
        </Link>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Create account
          </h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                required
                minLength={8}
              />
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                At least 8 characters.
              </p>
            </div>
            <div>
              <label
                htmlFor="register-confirm"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Confirm password
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

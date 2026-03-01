"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Login failed" });
        return;
      }
      window.location.href = "/admin";
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-12 border border-[var(--color-border)] rounded-lg">
=======

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="w-full max-w-md px-8 py-12 border border-[var(--color-border)] rounded-lg">
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
      <h1 className="text-2xl font-bold mb-8 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-text)]"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-text)]"
            placeholder="••••••••"
          />
        </div>
<<<<<<< HEAD
        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-semibold bg-[var(--color-text)] text-[var(--color-bg)] rounded hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <Link
          href="/"
          className="block text-center text-sm opacity-70 hover:opacity-100 transition"
=======
        <button
          type="submit"
          className="w-full py-3 font-semibold bg-[var(--color-text)] text-[var(--color-bg)] rounded hover:opacity-90 transition"
        >
          Sign In
        </button>
        <Link
          href="/"
          className="block text-center text-sm opacity-70 hover:opacity-100 transition mt-4"
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
        >
          ← Back to site
        </Link>
      </form>
    </div>
<<<<<<< HEAD
    </div>
  );
}
=======
  );
}
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46

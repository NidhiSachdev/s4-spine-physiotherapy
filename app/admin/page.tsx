"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <h1 className="font-heading font-semibold text-2xl text-charcoal text-center mb-2">
            S4 Spine
          </h1>
          <p className="text-muted text-sm text-center mb-8">
            Admin Login
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-charcoal mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-background text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-background text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-error text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange hover:bg-orange-dark text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

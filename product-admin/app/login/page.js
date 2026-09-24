"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../../lib/api/auth";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { loginSuccess } = useAuth();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // Guard against many quick clicks/enters sending many requests.
    if (submitting) return;

    setError("");
    setSubmitting(true);
    try {
      const data = await login(username, password);
      loginSuccess(data);
      router.replace(params.get("next") || "/products");
    } catch (err) {
      setError(
        err.response?.status === 400 || err.response?.status === 401
          ? "Wrong username or password."
          : err.friendlyMessage || "Couldn't log in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold text-ink">Product admin</h1>
        <p className="mb-8 text-sm text-ink/60">Sign in to manage the product catalog.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-warn/10 px-3 py-2 text-sm text-warn">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-ink/50">
          Demo credentials are pre-filled: <code>emilys</code> / <code>emilyspass</code>.
        </p>
      </div>
    </main>
  );
}

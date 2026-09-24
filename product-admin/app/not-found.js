import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-xl font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-ink/60">The page you're looking for doesn't exist.</p>
      <Link href="/products" className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
        Go to products
      </Link>
    </main>
  );
}

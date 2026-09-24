"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Loader from "../../../components/Loader";
import ErrorState from "../../../components/ErrorState";
import { fetchProduct } from "../../../lib/api/products";
import { applyOverridesToOne, getLocalProduct } from "../../../lib/localOverrides";

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error | not-found
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    setStatus("loading");
    setErrorMsg("");

    // Locally-created products (negative ids) never existed on the API.
    if (Number(id) < 0) {
      const local = getLocalProduct(id);
      if (local) {
        setProduct(local);
        setStatus("ready");
      } else {
        setStatus("not-found");
      }
      return;
    }

    try {
      const data = await fetchProduct(id);
      const merged = applyOverridesToOne(data);
      if (!merged) {
        setStatus("not-found"); // was locally deleted
        return;
      }
      setProduct(merged);
      setStatus("ready");
    } catch (err) {
      if (err.response?.status === 404) {
        setStatus("not-found");
      } else {
        setErrorMsg(err.friendlyMessage || "Couldn't load this product.");
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link href="/products" className="mb-4 inline-block text-sm text-accent hover:underline">
          ← Back to products
        </Link>

        {status === "loading" && <Loader label="Loading product…" />}
        {status === "error" && <ErrorState message={errorMsg} onRetry={load} />}

        {status === "not-found" && (
          <div className="rounded-lg border border-dashed border-line px-4 py-16 text-center">
            <p className="text-lg font-medium text-ink">Product not found</p>
            <p className="mt-1 text-sm text-ink/60">There's no product with id “{id}”.</p>
            <Link href="/products" className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
              Back to products
            </Link>
          </div>
        )}

        {status === "ready" && product && (
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-white">
                {product.thumbnail && (
                  <Image src={product.thumbnail} alt={product.title} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                )}
              </div>
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product.images.map((src, i) => (
                    <span key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-white">
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs uppercase text-ink/40">{product.category}</p>
              <h1 className="mt-1 text-2xl font-semibold text-ink">{product.title}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="text-lg font-semibold text-ink">${product.price}</span>
                <span className="text-ink/60">★ {product.rating}</span>
                <span className="text-ink/60">{product.stock} in stock</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{product.description}</p>

              <div className="mt-6 flex gap-2">
                <Link href={`/products/${product.id}/edit`} className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-white">
                  Edit
                </Link>
              </div>

              {Array.isArray(product.reviews) && product.reviews.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold text-ink">Reviews</h2>
                  <ul className="space-y-3">
                    {product.reviews.map((r, i) => (
                      <li key={i} className="rounded-md border border-line bg-white p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-ink">{r.reviewerName}</span>
                          <span className="text-ink/50">★ {r.rating}</span>
                        </div>
                        <p className="mt-1 text-sm text-ink/70">{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

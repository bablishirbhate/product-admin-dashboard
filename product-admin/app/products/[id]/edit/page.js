"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import ProductForm from "../../../../components/ProductForm";
import Loader from "../../../../components/Loader";
import ErrorState from "../../../../components/ErrorState";
import { fetchProduct, updateProduct } from "../../../../lib/api/products";
import { applyOverridesToOne, recordEdit, getLocalProduct } from "../../../../lib/localOverrides";

export default function EditProductPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    setStatus("loading");
    try {
      if (Number(id) < 0) {
        const local = getLocalProduct(id);
        if (!local) return setStatus("not-found");
        setProduct(local);
        setStatus("ready");
        return;
      }
      const data = await fetchProduct(id);
      const merged = applyOverridesToOne(data);
      if (!merged) return setStatus("not-found");
      setProduct(merged);
      setStatus("ready");
    } catch (err) {
      if (err.response?.status === 404) setStatus("not-found");
      else {
        setErrorMsg(err.friendlyMessage || "Couldn't load this product.");
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(values) {
    // Same story as create: DummyJSON responds OK but doesn't persist the
    // change, so we keep our own patch and merge it in on every read.
    const isLocal = Number(id) < 0;
    if (!isLocal) {
      await updateProduct(id, values);
    }
    recordEdit(id, values);
    router.push(`/products/${id}`);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-ink">Edit product</h1>

        {status === "loading" && <Loader label="Loading product…" />}
        {status === "error" && <ErrorState message={errorMsg} onRetry={load} />}
        {status === "not-found" && (
          <p className="text-sm text-ink/60">There's no product with id "{id}".</p>
        )}
        {status === "ready" && product && (
          <ProductForm
            initial={{
              title: product.title || "",
              category: product.category || "",
              price: String(product.price ?? ""),
              stock: String(product.stock ?? ""),
              rating: String(product.rating ?? ""),
              description: product.description || "",
              thumbnail: product.thumbnail || "",
            }}
            onSubmit={handleSave}
            submitLabel="Save changes"
          />
        )}
      </main>
    </div>
  );
}

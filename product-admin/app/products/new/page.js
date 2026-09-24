"use client";

import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../../lib/api/products";
import { recordCreate } from "../../../lib/localOverrides";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(values) {
    // The API accepts the POST and returns a fake new product, but never
    // actually stores it — so we also save our own copy locally and merge
    // it back into future list views (see lib/localOverrides.js).
    await createProduct(values);
    recordCreate(values);
    router.push("/products");
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 text-xl font-semibold text-ink">Add product</h1>
        <p className="mb-6 text-sm text-ink/60">
          The demo API doesn't really save new products, so this app keeps a local copy and shows it in the list.
        </p>
        <ProductForm onSubmit={handleCreate} submitLabel="Add product" />
      </main>
    </div>
  );
}

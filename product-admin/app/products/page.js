"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import SearchBar from "../../components/SearchBar";
import FilterSort from "../../components/FilterSort";
import Pagination from "../../components/Pagination";
import ProductList from "../../components/ProductList";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchProducts, fetchCategories, deleteProduct } from "../../lib/api/products";
import { applyOverridesToList, recordDelete } from "../../lib/localOverrides";

const PAGE_SIZES = [10, 20, 50];

function readParams(searchParams) {
  const rawPage = parseInt(searchParams.get("page"), 10);
  const rawLimit = parseInt(searchParams.get("limit"), 10);

  return {
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    limit: PAGE_SIZES.includes(rawLimit) ? rawLimit : 10,
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    sort: searchParams.get("sort") || "",
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsList />
    </Suspense>
  );
}

function ProductsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, limit, q, category, sort } = readParams(searchParams);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Guards against stale responses: if the user types fast, an older
  // in-flight request must never overwrite a newer one's results.
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || value === "all") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    router.replace(`/products?${next.toString()}`);
  }

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const myRequestId = ++requestIdRef.current;

    const [sortBy, order] = sort ? sort.split("-") : [null, null];

    try {
      const data = await fetchProducts({
        limit,
        skip: (page - 1) * limit,
        q,
        category,
        sortBy,
        order,
        signal: controller.signal,
      });

      // Ignore this response if a newer request has since been kicked off.
      if (myRequestId !== requestIdRef.current) return;

      const merged = applyOverridesToList(data.products, { page, includeCreated: !q });
      setProducts(merged);
      setTotal(data.total);
      setStatus("ready");
    } catch (err) {
      if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
      if (myRequestId !== requestIdRef.current) return;
      setErrorMsg(err.friendlyMessage || "Couldn't load products.");
      setStatus("error");
    }
  }, [page, limit, q, category, sort]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(Array.isArray(cats) ? cats : []))
      .catch(() => setCategories([]));
  }, []);

  // Clamp an out-of-range page (e.g. ?page=999) once we know the real total.
  useEffect(() => {
    if (status !== "ready") return;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    if (page > totalPages) {
      updateParams({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, total, limit, page]);

  function handleSearchChange(value) {
    updateParams({ q: value, page: 1 });
  }

  function handleCategoryChange(value) {
    updateParams({ category: value, page: 1 });
  }

  function handleSortChange(value) {
    updateParams({ sort: value });
  }

  function handlePageChange(nextPage) {
    updateParams({ page: nextPage });
  }

  function handlePageSizeChange(nextLimit) {
    updateParams({ limit: nextLimit, page: 1 });
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      if (!deleteTarget.isLocal) {
        await deleteProduct(deleteTarget.id);
      }
      recordDelete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || "Couldn't delete this product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-ink">Products</h1>
          <Link
            href="/products/new"
            className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent/90"
          >
            Add product
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={q} onChange={handleSearchChange} />
          <FilterSort
            categories={categories}
            category={category}
            sortValue={sort}
            searchActive={!!q}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />
        </div>

        {status === "loading" && <Loader label="Loading products…" />}

        {status === "error" && <ErrorState message={errorMsg} onRetry={load} />}

        {status === "ready" && products.length === 0 && (
          <EmptyState message={q ? `No products match “${q}”.` : "No products found."} />
        )}

        {status === "ready" && products.length > 0 && (
          <>
            <ProductList products={products} onDelete={setDeleteTarget} />
            <div className="mt-6">
              <Pagination
                page={page}
                pageSize={limit}
                total={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this product?"
        message={deleteTarget ? `“${deleteTarget.title}” will be removed from your view. This can't be undone.` : ""}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

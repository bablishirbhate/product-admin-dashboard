"use client";

import Image from "next/image";
import Link from "next/link";

function Stars({ rating }) {
  return <span className="text-sm text-ink/70">★ {rating?.toFixed(1)}</span>;
}

function StockBadge({ stock }) {
  const low = stock <= 5;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${low ? "bg-warn/10 text-warn" : "bg-accentSoft text-accent"}`}>
      {stock} in stock
    </span>
  );
}

export default function ProductList({ products, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm sm:table">
        <thead>
          <tr className="border-b border-line text-ink/50">
            <th className="py-2 pr-4 font-medium">Product</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Price</th>
            <th className="py-2 pr-4 font-medium">Rating</th>
            <th className="py-2 pr-4 font-medium">Stock</th>
            <th className="py-2 pr-4 font-medium sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line/60 align-middle">
              <td className="py-3 pr-4">
                <Link href={`/products/${p.id}`} className="flex items-center gap-3 hover:underline">
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-paper">
                    {p.thumbnail && (
                      <Image src={p.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                    )}
                  </span>
                  <span className="max-w-xs truncate font-medium text-ink">{p.title}</span>
                </Link>
              </td>
              <td className="py-3 pr-4 capitalize text-ink/70">{p.category}</td>
              <td className="py-3 pr-4 text-ink/70">${p.price}</td>
              <td className="py-3 pr-4"><Stars rating={p.rating} /></td>
              <td className="py-3 pr-4"><StockBadge stock={p.stock} /></td>
              <td className="py-3 pr-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/products/${p.id}/edit`} className="rounded-md border border-line px-2.5 py-1 text-xs font-medium hover:bg-paper">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(p)} className="rounded-md border border-warn/30 px-2.5 py-1 text-xs font-medium text-warn hover:bg-warn/10">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {products.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-lg border border-line bg-white p-3">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
              {p.thumbnail && <Image src={p.thumbnail} alt="" fill sizes="64px" className="object-cover" />}
            </span>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${p.id}`} className="block truncate font-medium text-ink hover:underline">
                {p.title}
              </Link>
              <p className="mt-0.5 text-xs capitalize text-ink/50">{p.category}</p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="font-medium text-ink">${p.price}</span>
                <Stars rating={p.rating} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <StockBadge stock={p.stock} />
                <div className="flex gap-2">
                  <Link href={`/products/${p.id}/edit`} className="rounded-md border border-line px-2.5 py-1 text-xs font-medium hover:bg-paper">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(p)} className="rounded-md border border-warn/30 px-2.5 py-1 text-xs font-medium text-warn hover:bg-warn/10">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

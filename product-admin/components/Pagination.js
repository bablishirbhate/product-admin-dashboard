"use client";

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Show up to 5 page numbers, centered on the current page.
  const pages = [];
  let from = Math.max(1, page - 2);
  let to = Math.min(totalPages, from + 4);
  from = Math.max(1, to - 4);
  for (let p = from; p <= to; p++) pages.push(p);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-4 sm:flex-row">
      <p className="text-sm text-ink/60">
        {total === 0 ? "No results" : `Showing ${start}–${end} of ${total}`}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-line px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {from > 1 && <span className="px-1 text-sm text-ink/40">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`min-w-[2rem] rounded-md border px-2 py-1.5 text-sm ${
              p === page ? "border-accent bg-accent text-white" : "border-line hover:bg-paper"
            }`}
          >
            {p}
          </button>
        ))}
        {to < totalPages && <span className="px-1 text-sm text-ink/40">…</span>}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-line px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div>
        <label className="text-sm text-ink/60">
          Per page{" "}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-1 rounded-md border border-line bg-white px-2 py-1 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

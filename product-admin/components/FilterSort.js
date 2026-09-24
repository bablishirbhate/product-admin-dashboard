"use client";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

export default function FilterSort({ categories, category, sortValue, searchActive, onCategoryChange, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <label className="sr-only" htmlFor="category">Category</label>
        <select
          id="category"
          value={category || "all"}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={searchActive}
          title={searchActive ? "Category filter is disabled while searching" : undefined}
          className="rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="sr-only" htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {searchActive && (
        <span className="text-xs text-ink/50">Category filter is off while you're searching.</span>
      )}
    </div>
  );
}

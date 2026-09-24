"use client";

import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function SearchBar({ value, onChange }) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, 400);

  // Keep local text in sync if the URL changes from elsewhere (e.g. back button).
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <input
      type="search"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search products…"
      aria-label="Search products"
      className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent sm:w-64"
    />
  );
}

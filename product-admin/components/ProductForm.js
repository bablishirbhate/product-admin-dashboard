"use client";

import { useState } from "react";

const EMPTY = {
  title: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  description: "",
  thumbnail: "",
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Enter a whole number of 0 or more.";
  }

  if (values.rating !== "") {
    const rating = Number(values.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      errors.rating = "Rating must be between 0 and 5.";
    }
  }

  return errors;
}

export default function ProductForm({ initial, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // prevent double submit on fast repeated clicks

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        rating: values.rating === "" ? 0 : Number(values.rating),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name, label, type = "text", extra = {}) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={values[name]}
        onChange={(e) => update(name, e.target.value)}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        {...extra}
      />
      {errors[name] && <p className="mt-1 text-xs text-warn">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {field("title", "Title")}
      {field("category", "Category")}
      <div className="grid grid-cols-2 gap-4">
        {field("price", "Price ($)", "number", { step: "0.01", min: "0" })}
        {field("stock", "Stock", "number", { min: "0", step: "1" })}
      </div>
      {field("rating", "Rating (0–5, optional)", "number", { step: "0.1", min: "0", max: "5" })}
      {field("thumbnail", "Thumbnail URL (optional)")}

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

import api from "../axios";

// DummyJSON can't search (q) and filter-by-category at the same time on one
// endpoint. Our rule: if a search term is present, search wins and category
// is ignored (search intent is usually more specific than browsing a
// category). See README for the full explanation.
export async function fetchProducts({ limit, skip, q, category, sortBy, order, signal }) {
  let url = "/products";
  const params = { limit, skip };

  if (q && q.trim()) {
    url = "/products/search";
    params.q = q.trim();
  } else if (category && category !== "all") {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const res = await api.get(url, { params, signal });
  return res.data; // { products, total, skip, limit }
}

export async function fetchCategories(signal) {
  const res = await api.get("/products/categories", { signal });
  // DummyJSON returns [{slug, name, url}, ...]
  return res.data;
}

export async function fetchProduct(id, signal) {
  const res = await api.get(`/products/${id}`, { signal });
  return res.data;
}

export async function createProduct(payload) {
  const res = await api.post("/products/add", payload);
  return res.data;
}

export async function updateProduct(id, payload) {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

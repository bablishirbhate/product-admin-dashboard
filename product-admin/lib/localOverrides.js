const KEY = "product_overrides_v1";

function readStore() {
  if (typeof window === "undefined") return { created: [], edited: {}, deleted: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { created: [], edited: {}, deleted: [] };
  } catch {
    return { created: [], edited: {}, deleted: [] };
  }
}

function writeStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function recordCreate(product) {
  const store = readStore();
  // Negative ids so they never collide with real DummyJSON ids (1..194).
  const localId = -(Date.now());
  const created = { ...product, id: localId, isLocal: true };
  store.created = [created, ...store.created];
  writeStore(store);
  return created;
}

export function recordEdit(id, patch) {
  const store = readStore();
  store.edited[id] = { ...(store.edited[id] || {}), ...patch };
  // Editing a locally-created product: fold the patch straight into it.
  store.created = store.created.map((p) =>
    String(p.id) === String(id) ? { ...p, ...patch } : p
  );
  writeStore(store);
}

export function recordDelete(id) {
  const store = readStore();
  if (!store.deleted.includes(id)) store.deleted.push(id);
  store.created = store.created.filter((p) => String(p.id) !== String(id));
  writeStore(store);
}

// Merge overrides into a page of API results.
export function applyOverridesToList(products, { page, includeCreated }) {
  const store = readStore();
  let list = products.filter((p) => !store.deleted.includes(p.id));
  list = list.map((p) => (store.edited[p.id] ? { ...p, ...store.edited[p.id] } : p));

  // Show locally-created items pinned to the top of page 1 only, so
  // pagination math for the real API data stays correct.
  if (includeCreated && page === 1 && store.created.length) {
    list = [...store.created, ...list];
  }
  return list;
}

export function applyOverridesToOne(product) {
  if (!product) return product;
  const store = readStore();
  if (store.deleted.includes(product.id)) return null;
  const patch = store.edited[product.id];
  return patch ? { ...product, ...patch } : product;
}

export function getLocalProduct(id) {
  const store = readStore();
  return store.created.find((p) => String(p.id) === String(id)) || null;
}

export function getDeletedCount() {
  return readStore().deleted.length;
}

export function getCreatedCount() {
  return readStore().created.length;
}

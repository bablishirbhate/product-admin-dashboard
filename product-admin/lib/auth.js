const TOKEN_COOKIE = "auth_token";

export function setToken(token) {
  if (typeof document === "undefined") return;
  // 1 day expiry, matches DummyJSON's default token lifetime.
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("auth_user", JSON.stringify(user));
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("auth_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("auth_user");
}

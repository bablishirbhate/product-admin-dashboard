import axios from "axios";
import { getToken, clearToken } from "./auth";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

// Attach the login token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      // Stale request cancelled on purpose (see hooks/useDebouncedSearch /
      // request-id guards). Let the caller's catch block ignore it.
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default api;

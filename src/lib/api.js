import axios from "axios";

const TOKEN_KEY = "secure-notes-token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// one axios instance for the whole app
// VITE_API_URL in production, "/api" (vite proxy) in development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // backend also sets an httpOnly cookie
  timeout: 15000,
});

// backend accepts the cookie or "Authorization: Bearer <token>"
// the header is used so it also works when the browser blocks
// third-party cookies (frontend and backend on different domains)
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// expired / invalid session -> tell the auth context
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthCall) {
      tokenStore.clear();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

// one readable message for any axios error
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (error.code === "ECONNABORTED") return "The server took too long to respond. Try again.";
  if (!error.response) return "Can't reach the server. Check your connection.";
  if (error.response.status === 403) return "You don't have permission to do that.";
  return error.response.data?.message || fallback;
}

export default api;

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'secure-notes-token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function api(path, { method = 'GET', body } = {}) {
  const token = tokenStore.get();
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:logout'));
    }
    const detail = json.details?.map((d) => `${d.field}: ${d.message}`).join(', ');
    throw new Error(detail ? `${json.message} (${detail})` : json.message || 'Request failed');
  }
  return json;
}

export const splitList = (text) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

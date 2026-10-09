import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from './api.js';

// login returns user.id, get-me returns the user document with _id
const normalize = (user) => ({ ...user, id: user.id || user._id });

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (tokenStore.get()) {
      api('/auth/get-me')
        .then((res) => setUser(normalize(res.user)))
        .catch(() => tokenStore.clear())
        .finally(() => setLoading(false));
    }
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const authenticate = async (path, body) => {
    const res = await api(path, { method: 'POST', body });
    tokenStore.set(res.token);
    setUser(normalize(res.user));
  };

  const value = {
    user,
    setUser: (u) => setUser(normalize(u)),
    loading,
    login: (body) => authenticate('/auth/login', body),
    register: (body) => authenticate('/auth/register', body),
    logout: () => {
      api('/auth/logout', { method: 'POST' }).catch(() => {});
      tokenStore.clear();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

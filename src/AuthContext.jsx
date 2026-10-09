import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (tokenStore.get()) {
      api('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => tokenStore.clear())
        .finally(() => setLoading(false));
    }
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const authenticate = async (path, body) => {
    const res = await api(path, { method: 'POST', body });
    tokenStore.set(res.data.token);
    setUser(res.data.user);
  };

  const value = {
    user,
    setUser,
    loading,
    login: (body) => authenticate('/auth/login', body),
    register: (body) => authenticate('/auth/register', body),
    logout: () => {
      tokenStore.clear();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

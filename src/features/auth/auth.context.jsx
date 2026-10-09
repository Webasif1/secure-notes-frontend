import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { tokenStore } from "../../lib/api";
import { useToast } from "../shared/components/Toast";
import * as authApi from "./services/auth.api";

export const AuthContext = createContext(null);

// login returns user.id, get-me returns the mongo document with _id
const normalize = (user) => (user ? { ...user, id: user.id || user._id } : null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [initializing, setInitializing] = useState(true);
  // true after clicking "Log out": next login starts on /notes, not the old page
  const [loggedOut, setLoggedOut] = useState(false);
  const userRef = useRef(null);
  const toast = useToast();

  const setUser = useCallback((u) => {
    userRef.current = normalize(u);
    setUserState(userRef.current);
  }, []);

  // on page load: ask the backend who is logged in (cookie or saved token)
  useEffect(() => {
    authApi
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, [setUser]);

  // any 401 from the api while logged in = session expired
  useEffect(() => {
    const onUnauthorized = () => {
      if (userRef.current) toast.info("Your session expired. Please sign in again.");
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [setUser, toast]);

  const login = async (data) => {
    const res = await authApi.login(data);
    tokenStore.set(res.token);
    setLoggedOut(false);
    setUser(res.user);
    return res.user;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    tokenStore.set(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // even if the request fails we still log out locally
    }
    tokenStore.clear();
    setLoggedOut(true);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, loggedOut, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

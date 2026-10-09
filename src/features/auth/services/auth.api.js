import api from "../../../lib/api";

export const register = async ({ name, email, password, interests }) => {
  const res = await api.post("/auth/register", { name, email, password, interests });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/get-me");
  return res.data;
};

export const updateMe = async (data) => {
  const res = await api.patch("/auth/get-me", data);
  return res.data;
};

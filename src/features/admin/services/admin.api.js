import api from "../../../lib/api";

export const getUsers = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const res = await api.get("/users", { params: { page, limit, search: search || undefined } });
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const getAllNotes = async ({ page = 1, limit = 10, search = "", owner = "" } = {}) => {
  const res = await api.get("/notes/all", {
    params: { page, limit, search: search || undefined, owner: owner || undefined },
  });
  return res.data;
};

// overview numbers come from the real "total" of each list (limit=1 keeps it cheap)
export const getOverview = async () => {
  const [users, notes, posts] = await Promise.all([
    api.get("/users", { params: { limit: 1 } }),
    api.get("/notes/all", { params: { limit: 1 } }),
    api.get("/posts", { params: { limit: 1 } }),
  ]);
  return {
    users: users.data.pagination.total,
    notes: notes.data.pagination.total,
    posts: posts.data.pagination.total,
  };
};

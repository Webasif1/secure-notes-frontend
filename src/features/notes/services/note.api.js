import api from "../../../lib/api";

// sidebar "Recent" list listens to this to refresh itself
const notifyChange = () => window.dispatchEvent(new Event("notes:changed"));

export const getMyNotes = async ({ page = 1, limit = 12 } = {}) => {
  const res = await api.get("/notes", { params: { page, limit } });
  return res.data;
};

export const getNote = async (id) => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async ({ title, content }) => {
  const res = await api.post("/notes", { title, content });
  notifyChange();
  return res.data;
};

export const updateNote = async (id, { title, content }) => {
  const res = await api.patch(`/notes/${id}`, { title, content });
  notifyChange();
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await api.delete(`/notes/${id}`);
  notifyChange();
  return res.data;
};

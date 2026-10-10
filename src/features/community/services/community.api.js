import api from "../../../lib/api";

export const getPosts = async ({ page = 1, limit = 10 } = {}) => {
  const res = await api.get("/posts", { params: { page, limit } });
  return res.data;
};

export const createPost = async ({ title, body }) => {
  const res = await api.post("/posts", { title, body });
  return res.data;
};

// aggregation scenario 2 ($lookup)
export const getPostsByUser = async (userId, { page = 1, limit = 10 } = {}) => {
  const res = await api.get(`/posts/user/${userId}`, { params: { page, limit } });
  return res.data;
};

// aggregation scenario 1 (group by interests)
export const getInterestGroups = async ({ page = 1, limit = 12 } = {}) => {
  const res = await api.get("/users/interests", { params: { page, limit } });
  return res.data;
};

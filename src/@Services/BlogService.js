import api from "../api/axiosInstance";

export const getAllBlogs = async () => {
  const res = await api.get("/blog/all");
  return res.data;
};

export const getVendorBlogs = async (vendorId, limit = 3) => {
  if (!vendorId) return [];
  const res = await api.get(`/blog/vendor/${vendorId}`, { params: { limit } });
  return res.data;
};

export const createBlog = async (data) => {
  const res = await api.post("/blog/create", data);
  return res.data;
};

export const updateBlog = async (id, data) => {
  const res = await api.put(`/blog/update/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blog/delete/${id}`);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await api.get(`/blog/${id}`);
  return res.data;
};

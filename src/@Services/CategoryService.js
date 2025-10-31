// src/@Services/productService.js
import api from "../api/axiosInstance";

// Get all Stores
export const getAllCategory = async () => {
  const res = await api.get("/category/All");
  return res.data;
};

// Get single Store by ID
export const getCategoryById = async (id) => {
  const res = await api.get(`/category/${id}`);
  return res.data;
};

//Create new Store
export const createCategory = async (data) => {
  const res = await api.post("/category/create", data);
  return res.data;
};

// Update Store by ID
export const updateCategory = async (id, data) => {
  const res = await api.put(`/category/update/${id}`, data);
  return res.data;
};

// Delete store by ID
export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/delete/${id}`);
  return res.data;
};

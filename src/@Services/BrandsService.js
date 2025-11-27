// src/@Services/brandService.js
import api from "../api/axiosInstance";

// Get all brands
export const getAllBrands = async () => {
  const res = await api.get("/brand/all");
  return res.data;
};

// Get single brand by ID
export const getBrandById = async (id) => {
  const res = await api.get(`/brand/${id}`);
  return res.data;
};

// Create new brand
export const createBrand = async (data) => {
  const res = await api.post("/brand/create", data);
  return res.data;
};

// Update brand by ID
export const updateBrand = async (id, data) => {
  const res = await api.patch(`/brand/update/${id}`, data);
  return res.data;
};

// Delete brand by ID
export const deleteBrand = async (id) => {
  const res = await api.delete(`/brand/delete/${id}`);
  return res.data;
};

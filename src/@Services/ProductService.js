// src/@Services/productService.js
import api from "../api/axiosInstance";

// Get all Products (Public)
export const getAllProducts = async () => {
  const res = await api.get("/product/getAll");
  return res.data;
};

// Get products by Store ID (Public)
export const getProductsByStoreId = async (storeId) => {
  const res = await api.get(`/product/store/${storeId}`);
  return res.data;
};

// Get Vendor Products (Protected)
export const getVendorProducts = async () => {
  const res = await api.get("/product/vendorProduct");
  return res.data;
};

// Get single product by ID
export const getProductById = async (id) => {
  const res = await api.get(`/product/getById/${id}`);
  return res.data;
};

//Create new product
export const createProduct = async (data) => {
  const res = await api.post("/product/create", data);
  return res.data;
};

// Update product by ID
export const updateProduct = async (id, data) => {
  const res = await api.put(`/product/update/${id}`, data);
  return res.data;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const res = await api.delete(`/product/delete/${id}`);
  return res.data;
};

// src/@Services/productService.js
import api from "../api/axiosInstance";

// Get all Products (Public)
export const getAllProducts = async (type) => {
  const res = await api.get("/product/getAll", { params: { type }, skipRedirect: true });
  return res.data;
};

// Get products by Store ID (Public)
export const getProductsByStoreId = async (storeId) => {
  const res = await api.get(`/product/store/${storeId}`, { skipRedirect: true });
  return res.data;
};

// Get Vendor Products (Protected)
export const getVendorProducts = async (type) => {
  const res = await api.get("/product/vendorProduct", { params: { type } });
  return res.data;
};

// Explicit Vendor Services
export const getVendorServices = async () => {
  const res = await api.get("/product/vendor/services");
  return res.data;
};

// Explicit Vendor Products
export const getVendorPhysicalProducts = async () => {
  const res = await api.get("/product/vendor/products");
  return res.data;
};

// Create Service
export const createService = async (data) => {
  const res = await api.post("/product/create/service", data);
  return res.data;
};

// Create Physical Product
export const createPhysicalProduct = async (data) => {
  const res = await api.post("/product/create/product", data);
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

// Update Service
export const updateService = async (id, data) => {
  const res = await api.put(`/product/update/service/${id}`, data);
  return res.data;
};

// Update Physical Product
export const updatePhysicalProduct = async (id, data) => {
  const res = await api.put(`/product/update/product/${id}`, data);
  return res.data;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const res = await api.delete(`/product/delete/${id}`);
  return res.data;
};



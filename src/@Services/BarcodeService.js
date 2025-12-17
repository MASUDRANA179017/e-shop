// src/@Services/BarcodeService.js
import api from "../api/axiosInstance";

// Generate QR code for a product (returns base64)
export const getProductQRCode = async (productId) => {
  const res = await api.get(`/barcode/qr/product/${productId}`);
  return res.data;
};

// Download QR code as PNG file
export const downloadProductQRCode = async (productId) => {
  const res = await api.get(`/barcode/qr/product/${productId}/download`, {
    responseType: "blob",
  });
  return res.data;
};

// Generate custom QR code with any data
export const generateCustomQRCode = async (data) => {
  const res = await api.post("/barcode/qr/custom", { data });
  return res.data;
};

// Generate barcode for a product (returns base64)
export const getProductBarcode = async (productId, type = "code128") => {
  const res = await api.get(`/barcode/barcode/product/${productId}?type=${type}`);
  return res.data;
};

// Download barcode as PNG file
export const downloadProductBarcode = async (productId, type = "code128") => {
  const res = await api.get(`/barcode/barcode/product/${productId}/download?type=${type}`, {
    responseType: "blob",
  });
  return res.data;
};

// Generate custom barcode with any text
export const generateCustomBarcode = async (text, type = "code128") => {
  const res = await api.post(`/barcode/barcode/custom?type=${type}`, { text });
  return res.data;
};

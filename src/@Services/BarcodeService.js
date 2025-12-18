import api from "../api/axiosInstance";

// ==================== QR CODE ENDPOINTS ====================

// Generate QR code for a product (returns base64)
export const getProductQRCode = async (productId) => {
  const res = await api.get(`/barcode/qr/product/${productId}`);
  return res.data;
};

// Download QR code as PNG file
export const downloadProductQRCode = async (productId) => {
  const res = await api.get(`/barcode/qr/product/${productId}/download`, {
    responseType: 'blob', // Important for file download
  });
  return res.data;
};

// Generate custom QR code with any data
export const generateCustomQRCode = async (data) => {
  const res = await api.post('/barcode/qr/custom', { data });
  return res.data;
};

// ==================== BARCODE ENDPOINTS ====================

// Generate barcode for a product (returns base64)
// type: 'code128' | 'ean13' | 'upc' | etc. (optional)
export const getProductBarcode = async (productId, type) => {
  const params = type ? { type } : {};
  const res = await api.get(`/barcode/barcode/product/${productId}`, { params });
  return res.data;
};

// Download barcode as PNG file
export const downloadProductBarcode = async (productId, type) => {
  const params = type ? { type } : {};
  const res = await api.get(`/barcode/barcode/product/${productId}/download`, {
    params,
    responseType: 'blob',
  });
  return res.data;
};

// Generate custom barcode with any text
export const generateCustomBarcode = async (text, type) => {
  const params = type ? { type } : {};
  const res = await api.post('/barcode/barcode/custom', { text }, { params });
  return res.data;
};

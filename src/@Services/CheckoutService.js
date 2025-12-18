import api from "../api/axiosInstance";

// Create a new order
export const createOrder = async (data) => {
  const res = await api.post("/checkout/create", data);
  return res.data;
};

// Get all orders
export const getAllOrders = async () => {
  const res = await api.get("/checkout/all-order");
  return res.data;
};

// Get vendor orders
export const getVendorOrders = async () => {
  const res = await api.get("/checkout/vendor-orders");
  return res.data;
};

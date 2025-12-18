import api from "../api/axiosInstance";

export const getWalletBalance = async () => {
  const res = await api.get("/wallet/balance");
  return res.data;
};

export const getWalletTransactions = async () => {
  const res = await api.get("/wallet/transactions");
  return res.data;
};

export const depositFunds = async (data) => {
  const res = await api.post("/wallet/deposit", data);
  return res.data;
};

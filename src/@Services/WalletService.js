import api from "../api/axiosInstance";

export const getWalletBalance = async () => {
  const res = await api.get("/wallet/balance");
  return res.data;
};

export const getWalletTransactions = async () => {
  const res = await api.get("/wallet/transactions");
  return res.data;
};

export const depositToWallet = async (amount, description) => {
  const res = await api.post("/wallet/deposit", { amount, description });
  return res.data;
};

export const requestWithdrawal = async (amount, description) => {
  const res = await api.post("/wallet/withdraw/request", { amount, description });
  return res.data;
};

export const getWithdrawalRequests = async () => {
  const res = await api.get("/wallet/withdraw/requests");
  return res.data;
};

export const updateWithdrawalStatus = async (id, status, adminNotes) => {
  const res = await api.put(`/wallet/withdraw/approve/${id}`, { status, adminNotes });
  return res.data;
};

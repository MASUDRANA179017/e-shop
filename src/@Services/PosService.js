import api from "../api/axiosInstance";

// ==================== SESSION ENDPOINTS ====================

// Open a new POS session
export const openSession = async (data) => {
  const res = await api.post("/pos/session/open", data);
  return res.data;
};

// Close a POS session
export const closeSession = async (sessionId, data) => {
  const res = await api.put(`/pos/session/close/${sessionId}`, data);
  return res.data;
};

// Get active session for a store
export const getActiveSession = async (storeId) => {
  const res = await api.get(`/pos/session/active/${storeId}`);
  return res.data;
};

// Get session by ID
export const getSessionById = async (sessionId) => {
  const res = await api.get(`/pos/session/${sessionId}`);
  return res.data;
};

// Get all sessions for a store
export const getStoreSessions = async (storeId) => {
  const res = await api.get(`/pos/sessions/store/${storeId}`);
  return res.data;
};

// ==================== TRANSACTION ENDPOINTS ====================

// Create a new sale transaction
export const createTransaction = async (data) => {
  const res = await api.post("/pos/transaction/create", data);
  return res.data;
};

// Get transaction by ID
export const getTransactionById = async (transactionId) => {
  const res = await api.get(`/pos/transaction/${transactionId}`);
  return res.data;
};

// Get transaction by transaction number
export const getTransactionByNumber = async (transactionNumber) => {
  const res = await api.get(`/pos/transaction/number/${transactionNumber}`);
  return res.data;
};

// Get all transactions for a session
export const getSessionTransactions = async (sessionId) => {
  const res = await api.get(`/pos/transactions/session/${sessionId}`);
  return res.data;
};

// Get all transactions for a store
export const getStoreTransactions = async (storeId) => {
  const res = await api.get(`/pos/transactions/store/${storeId}`);
  return res.data;
};

// Refund a transaction
export const refundTransaction = async (transactionId) => {
  const res = await api.put(`/pos/transaction/refund/${transactionId}`);
  return res.data;
};

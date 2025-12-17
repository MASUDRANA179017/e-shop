// src/@Services/InvoiceService.js
import api from "../api/axiosInstance";

// Create a new invoice
export const createInvoice = async (data) => {
  const res = await api.post("/invoices/create", data);
  return res.data;
};

// Get all invoices for store owner
export const getAllInvoices = async () => {
  const res = await api.get("/invoices/all");
  return res.data;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
};

// Get invoice by invoice number
export const getInvoiceByNumber = async (invoiceNumber) => {
  const res = await api.get(`/invoices/number/${invoiceNumber}`);
  return res.data;
};

// Get all invoices for a customer
export const getCustomerInvoices = async (customerId) => {
  const res = await api.get(`/invoices/customer/${customerId}`);
  return res.data;
};

// Update an invoice
export const updateInvoice = async (id, data) => {
  const res = await api.put(`/invoices/update/${id}`, data);
  return res.data;
};

// Mark invoice as paid
export const markInvoiceAsPaid = async (id) => {
  const res = await api.put(`/invoices/mark-paid/${id}`);
  return res.data;
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  const res = await api.delete(`/invoices/delete/${id}`);
  return res.data;
};

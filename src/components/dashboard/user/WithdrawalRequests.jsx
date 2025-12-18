import React, { useEffect, useState } from "react";
import { requestWithdrawal, getWithdrawalRequests } from "../../../@Services/WalletService";

const WithdrawalRequests = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWithdrawalRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const amt = parseFloat(amount);
      if (!amt || amt <= 0) {
        setError("Enter a valid amount");
        setSubmitting(false);
        return;
      }
      await requestWithdrawal(amt, description);
      setMessage("Withdrawal request sent");
      setAmount("");
      setDescription("");
      await loadRequests();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-md p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Send Withdrawal Request</h2>
        <form onSubmit={submitRequest} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional note"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Send Request"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      <div className="bg-white shadow-sm rounded-md p-4 border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">My Withdrawal Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Admin Notes</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2 px-3">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3">${Number(r.amount).toFixed(2)}</td>
                  <td className="py-2 px-3 capitalize">{r.status}</td>
                  <td className="py-2 px-3">{r.description || "-"}</td>
                  <td className="py-2 px-3">{r.adminNotes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequests;

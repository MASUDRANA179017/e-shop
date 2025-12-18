import React, { useEffect, useState } from "react";
import { getWithdrawalRequests, updateWithdrawalStatus } from "../../../@Services/WalletService";

const AdminWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [note, setNote] = useState("");

  const load = async () => {
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
    load();
  }, []);

  const act = async (id, status) => {
    setProcessingId(id);
    setError(null);
    try {
      await updateWithdrawalStatus(id, status, note);
      setNote("");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-md p-4 border border-gray-200">
        <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <div className="mt-3">
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">No requests found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Admin Notes</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 px-3">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-3">
                      {r.user ? `${r.user.firstName} ${r.user.lastName}` : "N/A"}
                    </td>
                    <td className="py-2 px-3">${Number(r.amount).toFixed(2)}</td>
                    <td className="py-2 px-3 capitalize">{r.status}</td>
                    <td className="py-2 px-3">{r.description || "-"}</td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={r.id === processingId ? note : r.adminNotes || ""}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Admin note"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button
                          disabled={processingId === r.id || r.status !== "pending"}
                          onClick={() => act(r.id, "approved")}
                          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={processingId === r.id || r.status !== "pending"}
                          onClick={() => act(r.id, "rejected")}
                          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalRequests;

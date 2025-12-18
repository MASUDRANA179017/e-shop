import React, { useEffect, useState } from "react";
import { getWalletBalance, getWalletTransactions } from "../../../@Services/WalletService";

const UserWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bal = await getWalletBalance();
        setBalance(bal?.balance ?? 0);
        const txns = await getWalletTransactions();
        setTransactions(Array.isArray(txns) ? txns : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading wallet...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-md p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
        <p className="text-2xl font-bold text-green-600">${Number(balance).toFixed(2)}</p>
      </div>

      <div className="bg-white shadow-sm rounded-md p-4 border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2 px-3">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3 capitalize">{t.type}</td>
                  <td className="py-2 px-3">${Number(t.amount).toFixed(2)}</td>
                  <td className="py-2 px-3">{t.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserWallet;


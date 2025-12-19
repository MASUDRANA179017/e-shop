import React from "react";
import { BiBarChart } from "react-icons/bi";
import { FaBoxOpen, FaClipboardList, FaStore, FaTrash, FaPlus, FaMinus, FaCashRegister, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { getVendorProducts, getVendorServices, getVendorPhysicalProducts } from "../../../@Services/ProductService";
import { getAllStores, updateStore, sendStoreEmail } from "../../../@Services/StoreService";
import { getVendorOrders } from "../../../@Services/CheckoutService";
import { getStoreTransactions, getDailySalesReport } from "../../../@Services/PosService";

const VendorDashboard = () => {
  const [stats, setStats] = React.useState([
    { label: "My Products", value: 0, icon: <FaBoxOpen />, color: "bg-blue-500" },
    { label: "Active Services", value: 0, icon: <FaStore />, color: "bg-green-500" },
    { label: "Total Orders", value: 0, icon: <FaClipboardList />, color: "bg-purple-500" },
    { label: "Revenue", value: 0, icon: <BiBarChart />, color: "bg-yellow-500" },
  ]);
  const [revenueChart, setRevenueChart] = React.useState([]);
  const [countChart, setCountChart] = React.useState([]);
  const [recentPos, setRecentPos] = React.useState([]);
  const [recentOnline, setRecentOnline] = React.useState([]);
  const [topProducts, setTopProducts] = React.useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = React.useState({ cash: 0, card: 0 });
  const [myStores, setMyStores] = React.useState([]);
  const [smtp, setSmtp] = React.useState({ host: "", port: "", user: "", pass: "", secure: false, from: "" });
  const [emailForm, setEmailForm] = React.useState({ to: "", subject: "", text: "" });
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadData = async () => {
      const userJson = localStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      let productsCount = 0;
      let servicesCount = 0;
      let stores = [];
      let onlineOrders = [];
      let posTransactions = [];
      try {
        const products = await getVendorPhysicalProducts();
        productsCount = Array.isArray(products) ? products.length : 0;
      } catch (e) {
        console.error("Failed to load vendor products", e);
        productsCount = 0;
      }
      try {
        const services = await getVendorServices();
        servicesCount = Array.isArray(services) ? services.length : 0;
      } catch (e) {
        console.error("Failed to load vendor services", e);
        servicesCount = 0;
      }
      try {
        const allStores = await getAllStores();
        stores = (allStores || []).filter(s => String(s.ownerId || s.owner?.id) === String(user?.id));
        if (stores.length === 0) {
          const vProducts = await getVendorProducts();
          const storeIds = Array.from(new Set((vProducts || []).map(p => p.store?.id).filter(Boolean)));
          stores = (allStores || []).filter(s => storeIds.includes(s.id));
        }
      } catch (e) {
        console.error("Failed to load stores", e);
        stores = [];
      }
      setMyStores(stores);
      try {
        onlineOrders = await getVendorOrders();
      } catch (e) {
        console.error("Failed to load online orders", e);
        onlineOrders = [];
      }
      try {
        for (const store of stores) {
          const txns = await getStoreTransactions(store.id);
          if (Array.isArray(txns)) posTransactions = posTransactions.concat(txns);
        }
      } catch (e) {
        console.error("Failed to load POS transactions", e);
      }
      const totalOnlineOrders = Array.isArray(onlineOrders) ? onlineOrders.length : 0;
      const totalPosOrders = Array.isArray(posTransactions) ? posTransactions.length : 0;
      const onlineRevenue = (onlineOrders || []).reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      const posRevenue = (posTransactions || []).reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
      const totalRevenue = onlineRevenue + posRevenue;
      setStats([
        { label: "My Products", value: productsCount, icon: <FaBoxOpen />, color: "bg-blue-500" },
        { label: "Active Services", value: servicesCount, icon: <FaStore />, color: "bg-green-500" },
        { label: "Total Orders", value: totalOnlineOrders + totalPosOrders, icon: <FaClipboardList />, color: "bg-purple-500" },
        { label: "Revenue", value: formatPrice(totalRevenue), icon: <BiBarChart />, color: "bg-yellow-500" },
      ]);
      const daysBack = 7;
      const now = new Date();
      const bucketsRevenue = [];
      const bucketsCount = [];
      for (let i = daysBack - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        bucketsRevenue.push({ key, label: d.toLocaleDateString(), total: 0, pos: 0, online: 0 });
        bucketsCount.push({ key, label: d.toLocaleDateString(), value: 0 });
      }
      for (const b of bucketsRevenue) {
        const dateStr = b.key;
        let dayOnline = (onlineOrders || [])
          .filter(o => new Date(o.createdAt).toISOString().slice(0, 10) === dateStr)
          .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        let dayPos = 0;
        for (const store of stores) {
          try {
            const report = await getDailySalesReport(store.id, dateStr);
            dayPos += Number(report?.totalSales || 0);
            const cntBucket = bucketsCount.find(x => x.key === dateStr);
            if (cntBucket) cntBucket.value += Number(report?.totalTransactions || 0);
          } catch (e) {
            console.error("Failed to load daily POS report", e);
          }
        }
        const revBucket = bucketsRevenue.find(x => x.key === dateStr);
        if (revBucket) {
          revBucket.pos += dayPos;
          revBucket.online += dayOnline;
          revBucket.total = revBucket.pos + revBucket.online;
        }
      }
      setRevenueChart(bucketsRevenue.map(b => ({ label: b.label, total: b.total, pos: b.pos, online: b.online })));
      setCountChart(bucketsCount.map(b => ({ label: b.label, value: b.value })));
      setRecentPos((posTransactions || []).slice(0, 5));
      setRecentOnline((onlineOrders || []).slice(0, 5));

      const productMap = new Map();
      for (const t of posTransactions || []) {
        for (const it of t.items || []) {
          const name = it.productName || "Unknown";
          const qty = Number(it.quantity || 0);
          const rev = Number(it.totalPrice || (Number(it.unitPrice || 0) * qty));
          const prev = productMap.get(name) || { name, quantity: 0, revenue: 0 };
          prev.quantity += qty;
          prev.revenue += rev;
          productMap.set(name, prev);
        }
      }
      for (const o of onlineOrders || []) {
        for (const it of o.items || []) {
          const name = it.product?.name || it.productName || "Unknown";
          const qty = Number(it.quantity || 0);
          const rev = Number(it.totalPrice || (Number(it.price || it.product?.price || 0) * qty));
          const prev = productMap.get(name) || { name, quantity: 0, revenue: 0 };
          prev.quantity += qty;
          prev.revenue += rev;
          productMap.set(name, prev);
        }
      }
      const top = Array.from(productMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setTopProducts(top);

      const today = new Date().toISOString().slice(0, 10);
      let cash = 0;
      let card = 0;
      for (const store of stores) {
        try {
          const rep = await getDailySalesReport(store.id, today);
          cash += Number(rep?.totalCashSales || 0);
          card += Number(rep?.totalCardSales || 0);
        } catch (e) {
          console.error("Failed to load today's payment breakdown", e);
        }
      }
      setPaymentBreakdown({ cash, card });
      if (stores[0]) {
        const s = stores[0];
        setSmtp({
          host: String(s.smtpHost || ""),
          port: String(s.smtpPort || ""),
          user: String(s.smtpUser || ""),
          pass: "",
          secure: Boolean(s.smtpSecure),
          from: String(s.smtpFrom || "")
        });
      }
    };
    loadData();
  }, [formatPrice]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>

      {/* Top row: Stats + Cart View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <h3 className="text-2xl font-semibold text-gray-800">{item.value}</h3>
                </div>
                <div className={`p-3 rounded-lg text-white ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Cart View Panel */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Cart Preview</h3>
            <button
              onClick={() => navigate("/dashboard/vendor/pos")}
              className="text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <FaCashRegister /> POS
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <FaShoppingCart size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-lg font-semibold text-gray-800">
              {formatPrice(cartTotal)}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => clearCart()}
              className="border border-red-500 text-red-500 px-3 py-2 rounded-md hover:bg-red-50 text-sm"
              disabled={cartItems.length === 0}
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/dashboard/vendor/pos")}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
              disabled={cartItems.length === 0}
            >
              Proceed to POS
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Sales Analytics (Last 7 Days)</h3>
          <div className="text-sm text-gray-500">POS vs Online</div>
        </div>
        <div className="h-64">
          {revenueChart.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No data
            </div>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 760 260" preserveAspectRatio="none">
              {(() => {
                const padding = { left: 40, right: 20, top: 20, bottom: 30 };
                const innerW = 760 - padding.left - padding.right;
                const innerH = 260 - padding.top - padding.bottom;
                const maxV = Math.max(...revenueChart.map(d => d.total), 1);
                const groupW = innerW / revenueChart.length;
                const barW = Math.max(8, groupW / 3);
                return (
                  <>
                    <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} stroke="#e5e7eb" />
                    {revenueChart.map((d, i) => {
                      const groupX = padding.left + i * groupW + groupW / 2 - barW;
                      const posH = (d.pos / maxV) * innerH;
                      const posY = padding.top + innerH - posH;
                      const onlineH = (d.online / maxV) * innerH;
                      const onlineY = padding.top + innerH - onlineH;
                      return (
                        <g key={i}>
                          <rect x={groupX - barW / 2} y={posY} width={barW} height={posH} fill="#10b981" rx="4" />
                          <rect x={groupX + barW / 2} y={onlineY} width={barW} height={onlineH} fill="#3b82f6" rx="4" />
                          <text x={groupX} y={padding.top + innerH + 18} textAnchor="middle" fontSize="10" fill="#6b7280">
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                    <g>
                      <rect x={padding.left + innerW - 140} y={padding.top} width="10" height="10" fill="#10b981" />
                      <text x={padding.left + innerW - 125} y={padding.top + 10} fontSize="10" fill="#374151">POS</text>
                      <rect x={padding.left + innerW - 85} y={padding.top} width="10" height="10" fill="#3b82f6" />
                      <text x={padding.left + innerW - 70} y={padding.top + 10} fontSize="10" fill="#374151">Online</text>
                    </g>
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Payment Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Cash</div>
              <div className="text-2xl font-semibold text-green-600">{formatPrice(paymentBreakdown.cash)}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Card</div>
              <div className="text-2xl font-semibold text-blue-600">{formatPrice(paymentBreakdown.card)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Selling Products</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {topProducts.length === 0 ? (
              <div className="text-sm text-gray-500">No products</div>
            ) : topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{p.name}</div>
                  <div className="text-gray-500">{p.quantity} sold</div>
                </div>
                <div className="text-sm font-semibold text-gray-800">{formatPrice(Number(p.revenue || 0))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">SMTP Settings</h3>
          <div className="space-y-3">
            <input className="w-full border rounded p-2" placeholder="Host" value={smtp.host} onChange={e => setSmtp(prev => ({ ...prev, host: e.target.value }))} />
            <input className="w-full border rounded p-2" placeholder="Port" value={smtp.port} onChange={e => setSmtp(prev => ({ ...prev, port: e.target.value }))} />
            <input className="w-full border rounded p-2" placeholder="User" value={smtp.user} onChange={e => setSmtp(prev => ({ ...prev, user: e.target.value }))} />
            <input className="w-full border rounded p-2" placeholder="Password" type="password" value={smtp.pass} onChange={e => setSmtp(prev => ({ ...prev, pass: e.target.value }))} />
            <input className="w-full border rounded p-2" placeholder="From" value={smtp.from} onChange={e => setSmtp(prev => ({ ...prev, from: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={smtp.secure} onChange={e => setSmtp(prev => ({ ...prev, secure: e.target.checked }))} />
              Use secure (SSL/TLS)
            </label>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={async () => {
                const s = myStores[0];
                if (!s) return;
                const payload = {
                  smtpHost: smtp.host || undefined,
                  smtpPort: smtp.port ? Number(smtp.port) : undefined,
                  smtpUser: smtp.user || undefined,
                  smtpPass: smtp.pass || undefined,
                  smtpSecure: Boolean(smtp.secure),
                  smtpFrom: smtp.from || undefined,
                };
                await updateStore(s.id, payload);
              }}
            >
              Save SMTP
            </button>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Email</h3>
          <div className="space-y-3">
            <input className="w-full border rounded p-2" placeholder="To" value={emailForm.to} onChange={e => setEmailForm(prev => ({ ...prev, to: e.target.value }))} />
            <input className="w-full border rounded p-2" placeholder="Subject" value={emailForm.subject} onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))} />
            <textarea className="w-full border rounded p-2 h-28" placeholder="Message" value={emailForm.text} onChange={e => setEmailForm(prev => ({ ...prev, text: e.target.value }))} />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={async () => {
                const s = myStores[0];
                if (!s) return;
                await sendStoreEmail(s.id, { to: emailForm.to, subject: emailForm.subject, text: emailForm.text });
                setEmailForm({ to: "", subject: "", text: "" });
              }}
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Transactions Count (Last 7 Days)</h3>
        </div>
        <div className="h-64">
          {countChart.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No data
            </div>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 700 260" preserveAspectRatio="none">
              {(() => {
                const padding = { left: 40, right: 10, top: 20, bottom: 30 };
                const innerW = 700 - padding.left - padding.right;
                const innerH = 260 - padding.top - padding.bottom;
                const maxV = Math.max(...countChart.map(d => d.value), 1);
                const points = countChart.map((d, i) => {
                  const x = padding.left + (i * innerW) / (countChart.length - 1);
                  const y = padding.top + innerH - (d.value / maxV) * innerH;
                  return `${x},${y}`;
                }).join(" ");
                return (
                  <>
                    <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />
                    {countChart.map((d, i) => {
                      const x = padding.left + (i * innerW) / (countChart.length - 1);
                      const y = padding.top + innerH - (d.value / maxV) * innerH;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="3" fill="#3b82f6" />
                          <text x={x} y={padding.top + innerH + 18} textAnchor="middle" fontSize="10" fill="#6b7280">
                            {d.label}
                          </text>
                          <text x={x} y={y - 6} textAnchor="middle" fontSize="10" fill="#374151">
                            {d.value}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent POS Transactions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentPos.length === 0 ? (
              <div className="text-sm text-gray-500">No POS transactions</div>
            ) : recentPos.map(t => (
              <div key={t.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{t.transactionNumber || `POS-${t.id}`}</div>
                  <div className="text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold text-gray-800">{formatPrice(Number(t.totalAmount || 0))}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Online Orders</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentOnline.length === 0 ? (
              <div className="text-sm text-gray-500">No online orders</div>
            ) : recentOnline.map(o => (
              <div key={o.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{`ORD-${o.id}`}</div>
                  <div className="text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold text-gray-800">{formatPrice(Number(o.totalAmount || 0))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

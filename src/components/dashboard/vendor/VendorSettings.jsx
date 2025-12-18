import React from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import { getAllStores, updateStore, sendStoreEmail } from "../../../@Services/StoreService";
import { FaCheck } from "react-icons/fa";
import { BiGlobe } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";

const VendorSettings = () => {
  const { countries, selectedCountry, updateCountry, currency, formatPrice } = useCurrency();
  const [stores, setStores] = React.useState([]);
  const [smtp, setSmtp] = React.useState({ host: "", port: "", user: "", pass: "", secure: false, from: "" });
  const [emailForm, setEmailForm] = React.useState({ to: "", subject: "Test from Vendor SMTP", text: "Hello!" });
  const [saving, setSaving] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const all = await getAllStores();
      const user = JSON.parse(localStorage.getItem("user"));
      const mine = (all || []).filter(s => String(s.ownerId || s.owner?.id) === String(user?.id));
      setStores(mine);
      if (mine[0]) {
        const s = mine[0];
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
    load();
  }, []);

  const handleSaveSmtp = async () => {
    if (!stores[0]) return;
    setSaving(true);
    try {
      await updateStore(stores[0].id, {
        smtpHost: smtp.host || undefined,
        smtpPort: smtp.port ? Number(smtp.port) : undefined,
        smtpUser: smtp.user || undefined,
        smtpPass: smtp.pass || undefined,
        smtpSecure: Boolean(smtp.secure),
        smtpFrom: smtp.from || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!stores[0] || !emailForm.to) return;
    setSending(true);
    try {
      await sendStoreEmail(stores[0].id, {
        to: emailForm.to,
        subject: emailForm.subject,
        text: emailForm.text
      });
      setEmailForm({ to: "", subject: "Test from Vendor SMTP", text: "Hello!" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <CiSettings /> Vendor Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BiGlobe /> Country & Currency
            </h3>
            <span className="text-sm text-gray-500">Current: {currency}</span>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select
                className="w-full border rounded-md p-2"
                value={selectedCountry?.code || ""}
                onChange={(e) => {
                  const found = countries.find(c => c.code === e.target.value);
                  if (found) updateCountry(found);
                }}
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Example price: {formatPrice(100)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              onClick={handleSaveSmtp}
              disabled={saving}
            >
              <FaCheck /> {saving ? "Saving..." : "Save SMTP"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Send Test Email</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <input className="border rounded p-2" placeholder="Recipient Email" value={emailForm.to} onChange={e => setEmailForm(prev => ({ ...prev, to: e.target.value }))} />
          <input className="border rounded p-2" placeholder="Subject" value={emailForm.subject} onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))} />
          <input className="border rounded p-2" placeholder="Message" value={emailForm.text} onChange={e => setEmailForm(prev => ({ ...prev, text: e.target.value }))} />
        </div>
        <div className="mt-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSendTest}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;

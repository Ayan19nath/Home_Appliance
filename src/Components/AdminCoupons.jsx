import { useEffect, useState } from "react";
import api from "../api";

const empty = { code: "", percent: "", minOrder: "", maxDiscount: "", usageLimit: "", expiresAt: "" };
const small = { color: "#667d91", fontSize: 12 };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () => api.get("/coupon").then((res) => setCoupons(res.data)).catch(() => setError("Could not load coupons."));

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Run a server call, show any error, then reload the list
  const run = async (call) => {
    try {
      await call();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    load();
  };

  const create = (e) => {
    e.preventDefault();
    run(async () => {
      await api.post("/coupon", form);
      setForm(empty);
    });
  };

  const remove = (c) => window.confirm(`Delete coupon ${c.code}?`) && run(() => api.delete(`/coupon/${c.id}`));

  return (
    <section className="admin-box" style={{ borderTop: "4px solid #10b981" }}>
      <h3>Coupons ({coupons.length})</h3>
      {error && <p className="admin-error">{error}</p>}

      {/* ===== NEW COUPON ===== */}
      <form onSubmit={create} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        <div className="admin-row">
          <input
            placeholder="Code (e.g. HOME10)"
            value={form.code}
            maxLength={20}
            required
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
          />
          <input type="number" min="1" max="90" placeholder="Percent off (1 to 90)" value={form.percent} onChange={set("percent")} required />
          <input type="number" min="0" placeholder="Minimum order ₹ (optional)" value={form.minOrder} onChange={set("minOrder")} />
        </div>
        <div className="admin-row">
          <input type="number" min="0" placeholder="Maximum discount ₹ (optional)" value={form.maxDiscount} onChange={set("maxDiscount")} />
          <input type="number" min="0" placeholder="Total uses (optional)" value={form.usageLimit} onChange={set("usageLimit")} />
          <label className="admin-file">
            Expiry date (optional)
            <input type="date" value={form.expiresAt} onChange={set("expiresAt")} />
          </label>
        </div>
        <div><button type="submit">Create Coupon</button></div>
      </form>

      {/* ===== LIST ===== */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Code</th><th>Discount</th><th>Expires</th><th>Used</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {coupons.length === 0 && <tr><td colSpan="6">No coupons yet</td></tr>}
            {coupons.map((c) => {
              const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
              const on = c.active && !expired;
              return (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>
                    {c.percent}% off
                    <div style={small}>
                      {c.minOrder ? `Min ₹${c.minOrder}` : "No minimum"}{c.maxDiscount ? `, up to ₹${c.maxDiscount}` : ""}
                    </div>
                  </td>
                  <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                  <td>{c.used}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td>
                    <span style={{ background: on ? "#e9faef" : "#fff0f0", color: on ? "#178047" : "#b33c3c", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {expired ? "Expired" : c.active ? "Active" : "Off"}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="edit" onClick={() => run(() => api.put(`/coupon/${c.id}/toggle`))}>
                      {c.active ? "Switch off" : "Switch on"}
                    </button>
                    <button type="button" className="danger" onClick={() => remove(c)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
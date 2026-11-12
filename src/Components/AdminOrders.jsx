import { useEffect, useState } from "react";
import api from "../api";

// Next status for each current status (the server allows only this one step forward)
const NEXT = { Processing: "Shipped", Shipped: "Out for Delivery", "Out for Delivery": "Delivered" };

// Status badge colours: [background, text]
const COLORS = {
  Processing: ["#fff6df", "#9a6500"],
  Shipped: ["#e9f6ff", "#086bb7"],
  "Out for Delivery": ["#e0f2fe", "#0369a1"],
  Delivered: ["#e9faef", "#178047"],
  Cancelled: ["#fff0f0", "#b33c3c"],
};
const FILTERS = ["All", ...Object.keys(COLORS)];

const money = (n) => Number(n || 0).toLocaleString("en-IN");
const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "");
const small = { color: "#667d91", fontSize: 12 };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  // Load every order from the server
  const load = () =>
    api.get("/order")
      .then((res) => { setOrders(res.data); setError(""); })
      .catch((err) => setError(err.response?.data?.message || "Could not load orders."));

  useEffect(() => {
    load();
  }, []);

  // Move an order one step forward (the server emails the customer)
  const advance = async (o) => {
    const next = NEXT[o.status];
    if (!window.confirm(`Mark order #${o.orderId} as "${next}"? The customer will get an email.`)) return;
    setBusy(o.id);
    try {
      await api.put(`/order/${o.id}/status`, { status: next });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not change the status.");
    }
    await load();
    setBusy("");
  };

  const count = (s) => (s === "All" ? orders.length : orders.filter((o) => o.status === s).length);
  const shown = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <section className="admin-box" style={{ borderTop: "4px solid #7c3aed" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <h3 style={{ margin: 0 }}>Orders ({orders.length})</h3>
        <div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {FILTERS.map((f) => <option key={f} value={f}>{f} ({count(f)})</option>)}
          </select>{" "}
          <button type="button" onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan="6">No orders found</td></tr>}
            {shown.map((o) => {
              const [bg, color] = COLORS[o.status] || COLORS.Processing;
              return (
                <tr key={o.id} style={{ verticalAlign: "top" }}>
                  <td>
                    <strong>#{o.orderId}</strong>
                    <div style={small}>{when(o.createdAt)}</div>
                  </td>
                  <td>
                    {o.customer?.name || "-"}
                    <div style={small}>{o.customer?.email}</div>
                    <div style={small}>{o.address?.phone}</div>
                    <div style={small}>{[o.address?.address, o.address?.city, o.address?.state, o.address?.pincode].filter(Boolean).join(", ")}</div>
                  </td>
                  <td>
                    {o.items.map((i, n) => <div key={n}>{i.name} × {i.quantity}</div>)}
                    {o.notes && <div style={small}>Note: {o.notes}</div>}
                  </td>
                  <td>
                    ₹{money(o.total)}
                    <div style={small}>{o.paymentMethod}</div>
                  </td>
                  <td>
                    <span style={{ background: bg, color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{o.status}</span>
                    {o.status === "Cancelled" && <div style={small}>{o.cancellationReason}</div>}
                  </td>
                  <td>
                    {NEXT[o.status] ? (
                      <button type="button" className="approve" disabled={busy === o.id} onClick={() => advance(o)}>
                        {busy === o.id ? "Saving..." : `Mark ${NEXT[o.status]}`}
                      </button>
                    ) : "-"}
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
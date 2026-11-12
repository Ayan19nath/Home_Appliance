import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardList, FileText, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "./CancelOrder.css";

const REASONS = ["Changed my mind", "Product is not needed", "Found a better price", "Wrong product ordered", "Delivery is delayed", "Other reason"];

// Mini timeline: [label, statuses that make it active]
const STEPS = [
  ["Order Placed", ["Processing", "Shipped", "Out for Delivery", "Delivered"]],
  ["Shipped", ["Shipped", "Out for Delivery", "Delivered"]],
  ["Delivered", ["Delivered"]],
];

const when = (v) => {
  const d = new Date(v);
  return v && !Number.isNaN(d.getTime())
    ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "N/A";
};

const CancelOrder = () => {
  const { orderId } = useParams(); // the order's database id (from the Orders page)
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState(REASONS[0]);
  const [other, setOther] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Load the order from the server
  useEffect(() => {
    api.get(`/order/track/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ===== LOADING / NOT FOUND ===== */
  if (loading || !order) {
    return (
      <main className="cancel-order-page">
        <section className="cancel-order-container cancel-order-not-found">
          <div className="cancel-page-icon"><X size={32} /></div>
          <h1>{loading ? "Loading..." : "Order Not Found"}</h1>
          {!loading && <p>We couldn't find the order you're trying to cancel.</p>}
          <Link to="/orders" className="cancel-back-button">
            <ArrowLeft size={17} /> Back to Orders
          </Link>
        </section>
      </main>
    );
  }

  const item = order.items[0] || {};
  const canCancel = order.status === "Processing"; // the server also allows this only while Processing

  /* ===== CONFIRM CANCEL (the server cancels, returns the stock and emails the customer) ===== */
  const confirmCancel = async () => {
    const finalReason = reason === "Other reason" ? other.trim() : reason;
    if (!finalReason) return setError("Please specify your cancellation reason.");

    setBusy(true);
    try {
      const { data } = await api.put(`/order/${order.id}/cancel`, { reason: finalReason });
      navigate(`/cancel-success/${data.orderId}`, { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel this order. Please try again.");
      setBusy(false);
    }
  };

  return (
    <main className="cancel-order-page">
      <section className="cancel-order-container">

        {/* ===== HEADER ===== */}
        <div className="cancel-order-heading">
          <div className="cancel-heading-icon"><X size={32} /></div>
          <div>
            <h1>Cancel Order</h1>
            <p>Easily cancel your order before it has been shipped.</p>
          </div>
        </div>

        {/* ===== ORDER INFO ===== */}
        <section className="cancel-order-card">
          <div className="cancel-order-info">
            <div className="cancel-basic-info">
              <p><strong>Order ID:</strong> #{order.orderId}</p>
              <p><strong>Placed on:</strong> {when(order.createdAt)}</p>
            </div>

            <div className="cancel-product-info">
              {item.image ? (
                <img src={item.image} alt={item.name} className="cancel-product-image" />
              ) : (
                <div className="cancel-product-image-placeholder"><ClipboardList size={30} /></div>
              )}

              <div className="cancel-product-details">
                <h3>{item.name}{order.items.length > 1 && ` +${order.items.length - 1} more`}</h3>
                {item.category && <p>{item.category}</p>}
                <strong>₹{Number(item.price || 0).toLocaleString("en-IN")}</strong>
                <span>Qty: {item.quantity}</span>
                <Link to={`/product/${item.id}`} className="cancel-product-link">View Product</Link>
              </div>
            </div>
          </div>

          {/* STATUS + TIMELINE */}
          <div className="cancel-status-area">
            <div className="cancel-status-badge"><CheckCircle2 size={15} /> {order.status}</div>

            <div className="cancel-timeline">
              {STEPS.map(([label, list], i) => {
                const on = list.includes(order.status);
                return (
                  <div key={label} style={{ display: "contents" }}>
                    {i > 0 && <div className={`cancel-timeline-line ${on ? "active" : ""}`} />}
                    <div className={`cancel-timeline-item ${on ? "active" : ""}`}>
                      <span><CheckCircle2 size={15} /></span>
                      <small>{label}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOTAL */}
          <div className="cancel-total">
            <span>Total Amount</span>
            <strong>₹{Number(order.total || 0).toLocaleString("en-IN")}</strong>
          </div>
        </section>

        {/* ===== REASON ===== */}
        <section className="cancellation-reason-card">
          <div className="reason-heading">
            <FileText size={27} />
            <div>
              <h2>Cancellation Reason</h2>
              <p>{canCancel ? "Please tell us why you want to cancel this order." : `This order is "${order.status}" and can no longer be cancelled.`}</p>
            </div>
          </div>

          {canCancel && (
            <div className="reason-options">
              {REASONS.map((r) => (
                <label key={r} className={`reason-option ${r === "Other reason" ? "reason-other" : ""}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => { setReason(r); setError(""); }}
                  />
                  <span>{r}</span>

                  {r === "Other reason" && (
                    <input
                      type="text"
                      className="other-reason-input"
                      placeholder="Please specify your reason..."
                      value={other}
                      onChange={(e) => { setOther(e.target.value); setReason("Other reason"); setError(""); }}
                    />
                  )}
                </label>
              ))}
            </div>
          )}

          {error && <p className="cancel-error-message">{error}</p>}

          <div className="cancel-action-row">
            <Link to="/orders" className="back-to-orders-button">
              <ArrowLeft size={17} /> Back to Orders
            </Link>
            {canCancel && (
              <button type="button" className="confirm-cancellation-button" onClick={confirmCancel} disabled={busy}>
                <X size={17} /> {busy ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default CancelOrder;
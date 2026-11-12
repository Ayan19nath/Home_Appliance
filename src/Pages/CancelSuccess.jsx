import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, Home, RefreshCw } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api";
import "./CancelSuccess.css";

const when = (v) => {
  const d = new Date(v);
  return v && !Number.isNaN(d.getTime())
    ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "N/A";
};

const CancelSuccess = () => {
  const { orderId } = useParams(); // order number from the page link
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null); // CancelOrder passes the cancelled order

  // After a refresh the state is gone, so load the order from the server
  useEffect(() => {
    if (!order) api.get(`/order/track/${orderId}`).then((res) => setOrder(res.data)).catch(() => {});
  }, [orderId]);

  return (
    <main className="cancel-success-page">
      <section className="cancel-success-container">

        <div className="cancel-success-icon-wrapper">
          <div className="cancel-success-icon">
            <CheckCircle2 size={48} />
          </div>
        </div>

        <h1>Your Order Has Been Cancelled</h1>

        <p className="cancel-success-description">
          Your order has been successfully cancelled. We're sorry to see you go,
          <br className="desktop-break" />
          but we hope to serve you again soon!
        </p>

        {/* ORDER SUMMARY */}
        <div className="cancel-success-summary">
          <div className="success-summary-item">
            <div className="success-summary-icon"><FileText size={21} /></div>
            <div>
              <span>Order ID</span>
              <strong>#{order?.orderId || orderId}</strong>
            </div>
          </div>

          <div className="success-summary-divider" />

          <div className="success-summary-item">
            <div>
              <span>Cancelled On</span>
              <strong>{when(order?.cancelledAt)}</strong>
            </div>
          </div>

          <div className="success-summary-divider" />

          <div className="success-summary-item">
            <div className="refund-summary-icon"><RefreshCw size={21} /></div>
            <div>
              <span>Refund Status</span>
              <strong className="refund-processing">{order?.refundStatus || "Processing"}</strong>
            </div>
          </div>
        </div>

        {/* REASON */}
        {order?.cancellationReason && (
          <div className="cancelled-reason-display">
            <span>Cancellation Reason</span>
            <strong>{order.cancellationReason}</strong>
          </div>
        )}

        {/* BUTTONS */}
        <div className="cancel-success-actions">
          <Link to="/" className="back-home-success-button">
            <Home size={17} />
            Back to Home
            <ArrowRight size={17} />
          </Link>
          <Link to="/orders" className="view-history-success-button">
            <FileText size={17} />
            View Order History
          </Link>
        </div>

      </section>
    </main>
  );
};

export default CancelSuccess;
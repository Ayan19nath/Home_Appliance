import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileText,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CancelOrder.css";



const CancelOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("Changed my mind");
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("homehub-orders") || "[]"
      );

      const foundOrder = savedOrders.find(
        (item) =>
          String(item.id) === String(orderId) ||
          String(item.orderId) === String(orderId)
      );

      setOrder(foundOrder || null);
    } catch (err) {
      console.error("Cancel Order Load Error:", err);
      setOrder(null);
    }
  }, [orderId]);

  const product = useMemo(() => {
    if (!order) return null;

    if (Array.isArray(order.products) && order.products.length > 0) {
      return order.products[0];
    }

    return order.product || null;
  }, [order]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return dateValue;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderNumber = () => {
    if (!order) return orderId;

    return order.orderId || order.id || orderId;
  };

  const getQuantity = () => {
    if (!product) return 1;
    return Number(product.quantity || order.quantity || 1);
  };

  const getPrice = () => {
    if (!product) return Number(order?.total || 0);
    return Number(product.price || 0);
  };

  const handleConfirmCancellation = () => {
    setError("");

    if (!reason) {
      setError("Please select a cancellation reason.");
      return;
    }

    if (reason === "Other reason" && !otherReason.trim()) {
      setError("Please specify your cancellation reason.");
      return;
    }

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("homehub-orders") || "[]"
      );

      const finalReason =
        reason === "Other reason" ? otherReason.trim() : reason;

      const updatedOrders = savedOrders.map((item) => {
        const isSameOrder =
          String(item.id) === String(orderId) ||
          String(item.orderId) === String(orderId);

        if (!isSameOrder) return item;

        return {
          ...item,
          status: "Cancelled",
          cancellationReason: finalReason,
          cancelledAt: new Date().toISOString(),
          refundStatus: "Processing",
        };
      });

      localStorage.setItem(
        "homehub-orders",
        JSON.stringify(updatedOrders)
      );

      window.dispatchEvent(new Event("homehub-orders-changed"));

      navigate(`/cancel-success/${orderId}`);
    } catch (err) {
      console.error("Cancel Order Error:", err);
      setError("Unable to cancel this order. Please try again.");
    }
  };

  if (!order) {
    return (
      <main className="cancel-order-page">
        <section className="cancel-order-container cancel-order-not-found">
          <div className="cancel-page-icon">
            <X size={32} />
          </div>

          <h1>Order Not Found</h1>
          <p>
            We couldn't find the order you're trying to cancel.
          </p>

          <Link to="/orders" className="cancel-back-button">
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cancel-order-page">
      <section className="cancel-order-container">

        {/* PAGE HEADER */}
        <div className="cancel-order-heading">
          <div className="cancel-heading-icon">
            <X size={32} />
          </div>

          <div>
            <h1>Cancel Order</h1>
            <p>Easily cancel your order before it has been shipped.</p>
          </div>
        </div>

        {/* ORDER INFORMATION */}
        <section className="cancel-order-card">
          <div className="cancel-order-info">

            <div className="cancel-basic-info">
              <p>
                <strong>Order ID:</strong>{" "}
                #{getOrderNumber()}
              </p>

              <p>
                <strong>Placed on:</strong>{" "}
                {formatDate(order.createdAt || order.date)}
              </p>
            </div>

            <div className="cancel-product-info">

              {product?.image ? (
                <img
                  src={product.image}
                  alt={product.name || "Product"}
                  className="cancel-product-image"
                />
              ) : (
                <div className="cancel-product-image-placeholder">
                  <ClipboardList size={30} />
                </div>
              )}

              <div className="cancel-product-details">
                <h3>
                  {product?.name || order.productName || "Order Product"}
                </h3>

                {product?.category && (
                  <p>{product.category}</p>
                )}

                <strong>
                  ₹{getPrice().toLocaleString("en-IN")}
                </strong>

                <span>
                  Qty: {getQuantity()}
                </span>

                {product?.color && (
                  <span>Color: {product.color}</span>
                )}

                <Link
                  to={`/product/${product?.id || order.productId}`}
                  className="cancel-product-link"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="cancel-status-area">
            <div className="cancel-status-badge">
              <CheckCircle2 size={15} />
              {order.status || "Processing"}
            </div>

            <div className="cancel-timeline">

              <div className="cancel-timeline-item active">
                <span>
                  <CheckCircle2 size={15} />
                </span>
                <small>Order Placed</small>
              </div>

              <div className="cancel-timeline-line active" />

              <div
                className={`cancel-timeline-item ${
                  ["Shipped", "Delivered"].includes(order.status)
                    ? "active"
                    : ""
                }`}
              >
                <span>
                  <CheckCircle2 size={15} />
                </span>
                <small>Shipped</small>
              </div>

              <div className="cancel-timeline-line" />

              <div
                className={`cancel-timeline-item ${
                  order.status === "Delivered" ? "active" : ""
                }`}
              >
                <span>
                  <CheckCircle2 size={15} />
                </span>
                <small>Delivered</small>
              </div>

            </div>
          </div>

          {/* TOTAL */}
          <div className="cancel-total">
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.total || getPrice()).toLocaleString("en-IN")}
            </strong>
          </div>
        </section>

        {/* CANCELLATION REASON */}
        <section className="cancellation-reason-card">

          <div className="reason-heading">
            <FileText size={27} />

            <div>
              <h2>Cancellation Reason</h2>
              <p>
                Please tell us why you want to cancel this order.
              </p>
            </div>
          </div>

          <div className="reason-options">

            <label className="reason-option">
              <input
                type="radio"
                name="cancelReason"
                value="Changed my mind"
                checked={reason === "Changed my mind"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />
              <span>Changed my mind</span>
            </label>

            <label className="reason-option">
              <input
                type="radio"
                name="cancelReason"
                value="Product is not needed"
                checked={reason === "Product is not needed"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />
              <span>Product is not needed</span>
            </label>

            <label className="reason-option">
              <input
                type="radio"
                name="cancelReason"
                value="Found a better price"
                checked={reason === "Found a better price"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />
              <span>Found a better price</span>
            </label>

            <label className="reason-option">
              <input
                type="radio"
                name="cancelReason"
                value="Wrong product ordered"
                checked={reason === "Wrong product ordered"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />
              <span>Wrong product ordered</span>
            </label>

            <label className="reason-option">
              <input
                type="radio"
                name="cancelReason"
                value="Delivery is delayed"
                checked={reason === "Delivery is delayed"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />
              <span>Delivery is delayed</span>
            </label>

            <label className="reason-option reason-other">
              <input
                type="radio"
                name="cancelReason"
                value="Other reason"
                checked={reason === "Other reason"}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
              />

              <span>Other reason</span>

              <input
                type="text"
                className="other-reason-input"
                placeholder="Please specify your reason..."
                value={otherReason}
                onChange={(e) => {
                  setOtherReason(e.target.value);

                  if (reason !== "Other reason") {
                    setReason("Other reason");
                  }

                  setError("");
                }}
              />
            </label>

          </div>

          {error && (
            <p className="cancel-error-message">
              {error}
            </p>
          )}

          <div className="cancel-action-row">

            <Link
              to="/orders"
              className="back-to-orders-button"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </Link>

            <button
              type="button"
              className="confirm-cancellation-button"
              onClick={handleConfirmCancellation}
            >
              <X size={17} />
              Confirm Cancellation
            </button>

          </div>
        </section>

      </section>
    </main>
  );
};

export default CancelOrder;
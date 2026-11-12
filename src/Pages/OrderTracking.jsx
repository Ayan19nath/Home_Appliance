import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Search, Package, Truck, CheckCircle2, ChevronRight, ShoppingCart, Home } from "lucide-react";
import api from "../api";
import { getUser } from "../data/session";
import "./OrderTracking.css";
import OrderTrackingImage from "../assets/images/order-tracking.jpeg";

// Journey steps: [title, icon, order status that matches this step]
const STEPS = [
  ["Order Placed", ShoppingCart, "Processing"],
  ["Shipped", Package, "Shipped"],
  ["Out for Delivery", Truck, "Out for Delivery"],
  ["Delivered", Home, "Delivered"],
];
const LEVEL = { Processing: 1, Shipped: 2, "Out for Delivery": 3, Delivered: 4 };

// [title, text] for the status message
const MESSAGES = {
  Processing: ["Your order is being processed", "Your order is being prepared for shipping."],
  Shipped: ["Your order has been shipped", "Your package has left our warehouse."],
  "Out for Delivery": ["Your order is on the way", "Your package is currently out for delivery."],
  Delivered: ["Order Delivered", "Your package has been successfully delivered."],
  Cancelled: ["Order Cancelled", "This order has been cancelled."],
};

const when = (v) => {
  const d = new Date(v);
  return v && !Number.isNaN(d.getTime())
    ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";
};

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState(orderId || "");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  // Find an order on the server by its order number
  const track = async (ref) => {
    const q = String(ref || "").trim().replace(/^#/, "");
    if (!q) return;
    if (!getUser() && !localStorage.getItem("adminToken")) return navigate("/login");

    try {
      const { data } = await api.get(`/order/track/${encodeURIComponent(q)}`);
      setOrder(data);
    } catch {
      setOrder(null);
    }
    setSearched(true);
  };

  // Open with the order number from the page link
  useEffect(() => {
    if (orderId) {
      setValue(orderId);
      track(orderId);
    }
  }, [orderId]);

  // Journey steps with dates (a cancelled order shows no progress)
  const steps = useMemo(() => {
    const at = (s) => order?.history?.find((h) => h.status === s)?.at;
    const level = order && order.status !== "Cancelled" ? LEVEL[order.status] || 1 : 0;
    return STEPS.map(([title, Icon, status], i) => ({
      title,
      Icon,
      date: order ? when(i === 0 ? order.createdAt : at(status)) : "",
      completed: i < level,
      current: i === level - 1,
    }));
  }, [order]);

  const done = steps.filter((s) => s.completed).length;
  const item = order?.items?.[0] || {};
  const message = order ? MESSAGES[order.status] || MESSAGES.Processing : null;
  const statusClass = order ? (order.status === "Shipped" ? "out-for-delivery" : order.status.toLowerCase().replace(/\s+/g, "-")) : "";

  return (
    <main className="new-order-tracking-page">

      {/* ===== HERO ===== */}
      <section className="order-tracking-hero">
        <img src={OrderTrackingImage} alt="HomeHub Order Tracking" className="order-tracking-hero-image" />
        <div className="order-tracking-hero-overlay"></div>
        <div className="order-tracking-hero-content">
          <div className="order-tracking-hero-label">
            <Package size={24} />
            <span>ORDER TRACKING</span>
            <span className="hero-line"></span>
          </div>
          <h1>
            Track Your Order
            <br />
            <strong>Anytime, Anywhere</strong>
          </h1>
          <p>Enter your order ID to get real-time updates on your delivery status.</p>
        </div>
      </section>

      <div className="order-tracking-container">

        {/* ===== SEARCH ===== */}
        <section className="order-details-card">
          <div className="order-details-heading">
            <div className="order-details-icon"><Package size={29} /></div>
            <div>
              <h2>Enter Your Order Details</h2>
              <p>Please enter your order ID to check the status of your order.</p>
            </div>
          </div>

          <form className="order-tracking-search-form" onSubmit={(e) => { e.preventDefault(); track(value); }}>
            <div className="order-tracking-input-box">
              <Package size={21} />
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Order ID" aria-label="Order ID" />
              {value && (
                <button type="button" className="input-search-icon" onClick={() => track(value)} aria-label="Search order">
                  <Search size={20} />
                </button>
              )}
            </div>
            <button type="submit" className="track-order-main-button">
              <span>Track Order</span>
              <ChevronRight size={21} />
            </button>
          </form>

          {searched && !order && (
            <div className="order-search-error">
              <Package size={20} />
              <span>Order not found. Please check your order ID.</span>
            </div>
          )}
        </section>

        {/* ===== JOURNEY ===== */}
        <section className="order-journey-card">
          <div className="order-journey-intro">
            <div className="journey-icon"><Truck size={27} /></div>
            <div>
              <h2>Your Order Journey</h2>
              <p>From our warehouse to your doorstep</p>
            </div>
          </div>

          <div className="order-journey-timeline">
            <div className="journey-progress-line">
              <div className="journey-progress-filled" style={{ width: `${(Math.max(0, done - 1) / 3) * 100}%` }}></div>
            </div>

            {steps.map(({ title, Icon, date, completed, current }) => (
              <div className={`journey-step ${completed ? "journey-completed" : ""} ${current ? "journey-current" : ""}`} key={title}>
                <div className="journey-step-icon"><Icon size={23} /></div>
                <h3>{title}</h3>
                {date ? <span className="journey-date">{date}</span> : <span className="journey-pending">Pending</span>}
                {current && order.status !== "Delivered" && <small>In Progress</small>}
              </div>
            ))}
          </div>
        </section>

        {/* ===== ORDER STATUS ===== */}
        <section className="tracked-order-section">
          <div className="tracked-order-heading">
            <h2>Order Status</h2>
            <p>{order ? "Latest updates for your order." : "Enter your order number to view the latest updates."}</p>
          </div>

          {order ? (
            <article className="tracked-order-card">

              <div className="tracked-order-top">
                <div>
                  <span>Order Number</span>
                  <strong>#{order.orderId}</strong>
                </div>
                <div className={`tracked-status ${statusClass}`}>
                  {order.status === "Delivered" ? <CheckCircle2 size={17} /> : order.status === "Cancelled" ? <span>×</span> : <Truck size={17} />}
                  {order.status}
                </div>
              </div>

              <div className="tracked-product-row">
                <div className="tracked-product-image">
                  {item.image ? <img src={item.image} alt={item.name} /> : <Package size={45} />}
                </div>
                <div className="tracked-product-info">
                  <span>{item.category || "Home Appliance"}</span>
                  <h3>{item.name}{order.items.length > 1 && ` +${order.items.length - 1} more`}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <strong>₹{Number(item.price || 0).toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="tracked-order-details">
                <div><span>Placed On</span><strong>{when(order.createdAt) || "Not available"}</strong></div>
                <div><span>Order Total</span><strong>₹{Number(order.total || 0).toLocaleString("en-IN")}</strong></div>
                <div><span>Payment</span><strong>{order.paymentMethod}</strong></div>
              </div>

              <div className="tracked-status-message">
                <div className="status-message-icon"><Truck size={20} /></div>
                <div>
                  <strong>{message[0]}</strong>
                  <p>{message[1]}</p>
                </div>
              </div>

              <div className="tracked-order-actions">
                <Link to={`/product/${item.id}`} className="my-product-button">
                  <Package size={17} />
                  My Product
                </Link>
                <Link to="/orders" className="my-orders-button">
                  View My Orders
                  <ChevronRight size={17} />
                </Link>
              </div>
            </article>
          ) : (
            <div className="tracked-empty-state">
              <div className="empty-package-icon"><Package size={52} /></div>
              <h3>Track Your Order</h3>
              <p>Enter your order ID above and we'll show you the latest delivery status here.</p>
            </div>
          )}
        </section>

        {/* ===== QUICK LINKS ===== */}
        <div className="tracking-bottom-links">
          <Link to="/"><Home size={17} /> Back to Home</Link>
          <Link to="/orders"><Package size={17} /> My Orders</Link>
          <Link to="/shop"><ShoppingCart size={17} /> Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}

export default OrderTracking;
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Headphones, MapPin, ChevronRight, Eye, Truck, X,
  CheckCircle2, Clock3, Package, UserCircle, LogIn, Trash2,
} from "lucide-react";
import api from "../api";
import { getUser } from "../data/session";
import "./Orders.css";

const FILTERS = ["All Orders", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
const STEPS = ["Shipped", "Out for Delivery", "Delivered"];
const ICONS = { Delivered: CheckCircle2, Shipped: Truck, "Out for Delivery": Truck, Processing: Clock3, Cancelled: X };

const money = (n) => Number(n || 0).toLocaleString("en-IN");

// Date and time, e.g. "Thu, 12 Nov 2026, 03:45 PM"
const when = (v) => {
  const d = new Date(v);
  return v && !Number.isNaN(d.getTime())
    ? d.toLocaleString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";
};

// Mini timeline of one order: [title, date, done]
const timelineOf = (o) => {
  const at = (s) => o.history?.find((h) => h.status === s)?.at;
  if (o.status === "Cancelled") return [["Order Placed", o.createdAt, true], ["Cancelled", o.cancelledAt, true]];
  return [["Order Placed", o.createdAt, true], ...STEPS.map((s) => [s, at(s), Boolean(at(s))])];
};

function Orders() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All Orders");
  const [search, setSearch] = useState("");

  // Follow login and logout
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("homehub-auth-changed", sync);
    return () => window.removeEventListener("homehub-auth-changed", sync);
  }, []);

  // Load my orders from the server
  const load = () =>
    api.get("/order/mine")
      .then((res) => { setOrders(res.data); setError(""); })
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    load();
  }, [user?.id]);

  // Filter and search (order number or product name)
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase().replace(/^#/, "");
    return orders.filter(
      (o) =>
        (filter === "All Orders" || o.status === filter) &&
        (!q || o.orderId.toLowerCase().includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q)))
    );
  }, [orders, filter, search]);

  // Remove a cancelled order from my history
  const remove = async (o) => {
    if (!window.confirm("Remove this order from your order history?")) return;
    try {
      await api.delete(`/order/${o.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to remove the order.");
    }
  };

  // Sidebar tracking opens the latest order
  const trackLatest = () => {
    if (!user) return navigate("/login");
    navigate(orders.length ? `/order-tracking/${orders[0].orderId}` : "/shop");
  };

  // Sidebar buttons: [extra class, icon, title, text, action]
  const sideButtons = [
    ["help-button", Headphones, "Help Me", "Get quick support & assistance", () => navigate("/contact")],
    ["tracking-button", MapPin, "Order Tracking", "Track your order status", trackLatest],
    ...(!user ? [["", LogIn, "Login", "Login to view your account", () => navigate("/login")]] : []),
  ];

  return (
    <main className="orders-page">

      {/* HERO */}
      <section className="orders-hero">
        <div className="orders-hero-content">
          <div className="orders-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span>My Orders</span>
          </div>
          <h1>My Orders</h1>
          <p>
            Track, manage and view your recent orders.
            <br />
            Your happiness is our priority!
          </p>
        </div>
        <div className="orders-hero-overlay"></div>
      </section>

      <section className="orders-section">
        <div className="orders-layout">

          {/* SIDEBAR */}
          <aside className="orders-sidebar">
            <div className="orders-user">
              <div className="orders-user-icon"><UserCircle size={58} /></div>
              <div className="orders-user-info">
                <h3>{user?.name || "Guest User"}</h3>
                <p>{user?.email || "Please login to view your orders"}</p>
              </div>
            </div>

            {sideButtons.map(([cls, Icon, title, text, go]) => (
              <button type="button" key={title} className={`orders-side-button ${cls}`} onClick={go}>
                <div className="orders-side-icon"><Icon size={28} /></div>
                <div className="orders-side-text">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
                <ChevronRight size={22} />
              </button>
            ))}
          </aside>

          {/* ORDERS */}
          <div className="orders-content">
            <div className="orders-content-header">
              <h2>My Orders</h2>
              <div className="order-search">
                <Search size={18} />
                <input type="text" placeholder="Search by order ID" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="order-filters">
              {FILTERS.map((f) => (
                <button type="button" key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            <div className="orders-list">
              {loading || error || shown.length === 0 ? (
                <div className="orders-empty">
                  <Package size={48} />
                  <h3>{loading ? "Loading your orders..." : error ? "Something went wrong" : "No orders found"}</h3>
                  <p>
                    {error || (loading ? "" : user ? "You haven't placed any orders yet." : "Please login to view your orders.")}
                  </p>
                  {!loading && !user && <button type="button" onClick={() => navigate("/login")}>Login</button>}
                  {!loading && user && !error && <button type="button" onClick={() => navigate("/shop")}>Start Shopping</button>}
                </div>
              ) : (
                shown.map((o) => {
                  const item = o.items[0] || {};
                  const Icon = ICONS[o.status] || Clock3;
                  const slug = o.status === "Out for Delivery" ? "shipped" : o.status.toLowerCase(); // same colour as Shipped

                  return (
                    <article className="order-card" key={o.id}>

                      {/* PRODUCT */}
                      <div className="order-product">
                        <div className="order-product-image"><img src={item.image} alt={item.name} /></div>
                        <div className="order-product-info">
                          <h3>{item.name}{o.items.length > 1 && ` +${o.items.length - 1} more`}</h3>
                          <p>{item.brand || "HomeHub"}</p>
                          <strong className="order-price">₹{money(item.price)}</strong>
                          <span className="order-meta">Qty: {item.quantity}</span>
                          <span className="product-category">{item.category || "Home Appliance"}</span>
                        </div>
                      </div>

                      {/* ORDER INFORMATION (with the delivery code while the order is active) */}
                      <div className="order-information">
                        <p><span>Order ID:</span> #{o.orderId}</p>
                        <p><span>Placed on:</span> {when(o.createdAt)}</p>
                        <p><span>Payment:</span> {o.paymentMethod}</p>
                        {o.deliveryOtp && (
                          <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#fff6df", border: "1px solid #f1d9a0", color: "#7a5200", fontSize: 11 }}>
                            Delivery code: <strong style={{ fontSize: 17, letterSpacing: 3 }}>{o.deliveryOtp}</strong>
                            <div>Give it to the delivery person only when you receive the order.</div>
                          </div>
                        )}
                      </div>

                      {/* STATUS */}
                      <div className="order-status">
                        <div className={`status-badge ${slug}`}>
                          <Icon size={16} />
                          {o.status}
                        </div>
                        <div className="mini-timeline">
                          {timelineOf(o).map(([title, date, done]) => (
                            <div className={`mini-timeline-item ${done ? "completed" : ""}`} key={title}>
                              <div className="mini-dot">{done && <CheckCircle2 size={15} />}</div>
                              <div className="mini-line-content">
                                <span>{title}</span>
                                {date && <small>{when(date)}</small>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="order-actions">
                        <span className="total-label">Total Amount</span>
                        <strong className="total-price">₹{money(o.total)}</strong>

                        <Link to={`/product/${item.id}`} className="order-action-button view-button">
                          <Eye size={16} />
                          View Details
                        </Link>

                        {o.status === "Processing" && (
                          <button type="button" className="order-action-button cancel-order-button" onClick={() => navigate(`/cancel-order/${o.id}`)}>
                            <X size={16} />
                            Cancel Order
                          </button>
                        )}

                        {o.status !== "Cancelled" && (
                          <button type="button" className="order-action-button track-order-button" onClick={() => navigate(`/order-tracking/${o.orderId}`)}>
                            <Truck size={16} />
                            Track Order
                          </button>
                        )}

                        {o.status === "Cancelled" && (
                          <button type="button" className="order-action-button delete-order-button" onClick={() => remove(o)}>
                            <Trash2 size={16} />
                            Delete Order
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Orders;
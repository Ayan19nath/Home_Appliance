import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, Tag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { getUser } from "../data/session";
import { stockInfo } from "../data/stock";
import "./Cart.css";

const money = (n) => Number(n || 0).toLocaleString("en-IN");

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart, increaseQuantity, decreaseQuantity, removeFromCart,
    cartItemCount, cartSubtotal, cartDiscount, cartTotal,
    coupon, couponDiscount, applyCoupon, removeCoupon,
  } = useCart();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Check the coupon code with the server
  const apply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return setMessage("Please enter a coupon code.");
    if (!getUser()) return setMessage("Please log in to use a coupon.");

    setBusy(true);
    const error = await applyCoupon(code);
    setMessage(error);
    if (!error) setCode("");
    setBusy(false);
  };

  /* ===== EMPTY CART ===== */
  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <ShoppingCart size={55} />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="cart-shop-btn">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* ===== HEADING ===== */}
        <div className="cart-heading">
          <h1>Shopping Cart ({cartItemCount} Items)</h1>
          <Link to="/shop">Continue Shopping →</Link>
        </div>

        <div className="cart-layout">

          {/* ===== LEFT: CART PRODUCTS ===== */}
          <div className="cart-products">
            {cart.map((item) => {
              const [stockText, stockColor] = stockInfo(item.stock);
              const atMax = item.stock != null && Number(item.quantity) >= Number(item.stock); // no more pieces in stock

              return (
                <div className="cart-product" key={item.id}>
                  <div className="cart-product-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-product-info">
                    <Link to={`/product/${item.id}`} className="cart-product-name">{item.name}</Link>
                    <p className="cart-brand">Brand: {item.brand}</p>
                    {item.stock != null && Number(item.stock) <= 5 && (
                      <p style={{ margin: "-6px 0 10px", color: stockColor, fontSize: 13, fontWeight: 600 }}>{stockText}</p>
                    )}

                    <div className="cart-price">
                      <strong>₹{money(item.price)}</strong>
                      {item.oldPrice > item.price && <del>₹{money(item.oldPrice)}</del>}
                    </div>

                    <div className="cart-actions">
                      <div className="quantity-control">
                        <button type="button" onClick={() => decreaseQuantity(item.id)}><Minus size={15} /></button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          disabled={atMax}
                          title={atMax ? "No more pieces in stock" : "Add one more"}
                          style={atMax ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button type="button" className="remove-cart" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">₹{money(Number(item.price || 0) * Number(item.quantity || 1))}</div>
                </div>
              );
            })}
          </div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <aside className="order-summary">
            <h2>Order Summary</h2>

            {/* COUPON */}
            <div style={{ marginBottom: 18 }}>
              {coupon ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: "#eaf8f0", border: "1px solid #b8e5c9", color: "#168447", fontSize: 14, fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Tag size={15} /> {coupon.code} applied</span>
                  <button type="button" onClick={removeCoupon} title="Remove coupon" style={{ color: "#168447", display: "flex" }}><X size={16} /></button>
                </div>
              ) : (
                <form onSubmit={apply} style={{ display: "flex", gap: 8 }}>
                  <input
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")); setMessage(""); }}
                    placeholder="Coupon code"
                    maxLength={20}
                    style={{ flex: 1, minWidth: 0, height: 40, padding: "0 10px", border: "1px solid #d8e0ea", borderRadius: 7, outline: "none" }}
                  />
                  <button type="submit" disabled={busy} style={{ height: 40, padding: "0 16px", border: 0, borderRadius: 7, background: "#1677ff", color: "#fff", fontWeight: 700 }}>
                    {busy ? "..." : "Apply"}
                  </button>
                </form>
              )}
              {message && <p style={{ margin: "8px 0 0", color: "#d93025", fontSize: 13 }}>{message}</p>}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{money(cartSubtotal)}</strong>
            </div>

            <div className="summary-row discount-row">
              <span>Discount</span>
              <strong>-₹{money(cartDiscount)} <small>(Applied)</small></strong>
            </div>

            {couponDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>Coupon ({coupon.code})</span>
                <strong>-₹{money(couponDiscount)}</strong>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <strong className="free">Free</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Estimated Total</span>
              <strong>₹{money(cartTotal)}</strong>
            </div>

            <button type="button" className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
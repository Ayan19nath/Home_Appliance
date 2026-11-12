import React, { useEffect, useState } from "react";
import {
  MapPin, CreditCard, ClipboardList, Lock, CheckCircle2,
  ChevronRight, ShoppingBag, Plus, User, Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../Context/CartContext";
import { getUser } from "../data/session";
import "./Checkout.css";

/* ===== DATA ===== */
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "New Zealand", "Singapore", "Malaysia", "Thailand", "Bangladesh", "Pakistan", "Sri Lanka", "Nepal", "United Arab Emirates", "Saudi Arabia", "Qatar", "Germany", "France", "Italy", "Spain", "Netherlands", "Japan", "China", "Hong Kong", "South Korea"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir",
].sort();

// [id, title, description, name saved in the order (the server accepts only these three)]
const PAYMENTS = [
  ["cod", "Cash on Delivery (COD)", "Pay when you receive your order.", "Cash on Delivery"],
  ["upi", "UPI", "Pay securely using UPI.", "UPI"],
  ["card", "Credit / Debit Card", "Pay securely using your card.", "Credit / Debit Card"],
];

const STEPS = [
  ["Shipping Address", "Where to deliver?"],
  ["Payment Method", "How you'll pay?"],
  ["Review & Confirm", "Check your order"],
  ["Order Placed", "You're all set!"],
];

const EMPTY_ADDRESS = { country: "India", state: "", city: "", address: "", pincode: "", name: "", phone: "", default: false };
const REQUIRED = ["name", "phone", "country", "state", "city", "address", "pincode"];

/* ===== HELPERS ===== */
const addrKey = (u) => `homehub-addresses-${u?.email ? u.email.trim().toLowerCase() : "guest"}`;
const nameOf = (a) => a?.name || a?.fullName || "HomeHub Customer";
const money = (n) => Number(n || 0).toLocaleString("en-IN");
const fmt = (a) =>
  a ? [a.address || a.street || a.addressLine, a.city, a.state, a.pincode, a.country].filter(Boolean).join(", ") : "";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, cartDiscount, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("cod");
  const [notes, setNotes] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [placing, setPlacing] = useState(false);

  const pay = PAYMENTS.find((p) => p[0] === payment);

  /* ===== LOAD SAVED ADDRESSES ===== */
  const loadAddresses = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(addrKey(getUser())));
      const list = Array.isArray(parsed) ? parsed : [];
      setAddresses(list);
      setSelected(list.find((a) => a.default || a.isDefault) || list[0] || null);
    } catch {
      setAddresses([]);
      setSelected(null);
    }
  };

  useEffect(() => {
    loadAddresses();
    window.addEventListener("homehub-addresses-changed", loadAddresses);
    window.addEventListener("storage", loadAddresses);
    return () => {
      window.removeEventListener("homehub-addresses-changed", loadAddresses);
      window.removeEventListener("storage", loadAddresses);
    };
  }, []);

  /* ===== ADDRESS FORM ===== */
  const onFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      // reset state/city when country changes
      ...(name === "country" && value !== p.country ? { state: "", city: "" } : {}),
    }));
  };

  const saveAddress = (e) => {
    e.preventDefault();
    if (REQUIRED.some((k) => !form[k].trim())) return alert("Please fill all required address details.");

    const user = getUser();
    if (!user) {
      alert("Please login before saving an address.");
      return navigate("/login");
    }

    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));
    const item = { id: `ADDR${Date.now()}`, ...clean, default: !!clean.default, isDefault: !!clean.default };

    let list = [...addresses, item];
    if (item.default) list = list.map((a) => ({ ...a, default: a.id === item.id, isDefault: a.id === item.id }));

    try {
      localStorage.setItem(addrKey(user), JSON.stringify(list));
      setAddresses(list);
      setSelected(list.find((a) => a.id === item.id) || item);
      setShowForm(false);
      setForm(EMPTY_ADDRESS);
      window.dispatchEvent(new Event("homehub-addresses-changed"));
    } catch {
      alert("Unable to save address.");
    }
  };

  /* ===== STEP BUTTONS ===== */
  const toPayment = () => (selected ? setStep(2) : alert("Please select or add a shipping address."));

  /* ===== PLACE ORDER (saved on the server: prices, stock and emails are handled there) ===== */
  const placeOrder = async () => {
    if (placing) return;
    if (!getUser()) {
      alert("Please login before placing your order.");
      return navigate("/login");
    }
    if (!selected) {
      setStep(1);
      return alert("Please select a shipping address.");
    }
    if (!cart?.length) {
      alert("Your cart is empty.");
      return navigate("/shop");
    }

    setPlacing(true);
    try {
      const { data } = await api.post("/order", {
        items: cart.map((i) => ({ id: i.id, quantity: Number(i.quantity || 1) })),
        address: {
          name: nameOf(selected),
          phone: selected.phone,
          address: selected.address || selected.street || selected.addressLine,
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode,
          country: selected.country || "India",
        },
        paymentMethod: pay[3],
        notes,
      });
      clearCart();
      navigate("/order-success", { state: { orderId: data.orderId, total: data.total } });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong while placing your order.");
      setPlacing(false);
    }
  };

  /* ===== EMPTY CART ===== */
  if (!cart?.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={60} />
          <h2>Your Cart is Empty</h2>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/shop" className="checkout-empty-btn">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  // Same button is used in the review step and in the summary
  const placeBtn = (
    <button type="button" className="place-order-btn" onClick={placeOrder} disabled={placing}>
      <Lock size={17} />
      <span>{placing ? "Placing order..." : "Place Order"}</span>
      <ChevronRight size={19} />
    </button>
  );

  // Small card header used in every step
  const header = (Icon, title, sub, action) => (
    <div className="checkout-card-header">
      <div className="checkout-title">
        <Icon size={23} />
        <div>
          <h2>{title}</h2>
          <span>{sub}</span>
        </div>
      </div>
      {action}
    </div>
  );

  return (
    <main className="checkout-page">
      {/* ===== HERO ===== */}
      <section className="checkout-hero">
        <div className="checkout-hero-overlay">
          <div className="checkout-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={15} />
            <span>Checkout</span>
          </div>
          <h1>Checkout</h1>
          <p>Complete your purchase and bring home your favorite products.</p>
        </div>
      </section>

      <section className="checkout-section">
        <div className="checkout-container">
          <div className="checkout-left">
            {/* ===== STEPS BAR ===== */}
            <div className="checkout-steps">
              {STEPS.map(([title, sub], i) => {
                const n = i + 1;
                return (
                  <div key={n} className={`checkout-step ${step === n ? "active" : step > n ? "completed" : ""}`}>
                    <span>{step > n ? <CheckCircle2 size={18} /> : n}</span>
                    <div>
                      <strong>{title}</strong>
                      <small>{step > n ? "Completed" : sub}</small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== STEP 1: ADDRESS ===== */}
            {step === 1 && (
              <div className="checkout-card">
                {header(MapPin, "Shipping Address", "Where should we deliver?",
                  <Link to="/addresses" className="checkout-change-link">Manage Addresses</Link>)}

                {addresses.length > 0 && (
                  <div className="saved-addresses">
                    <h3>Your Saved Addresses</h3>
                    {addresses.map((a) => {
                      const on = selected?.id === a.id;
                      return (
                        <label key={a.id || `${a.name}-${a.pincode}`} className={`saved-address-option ${on ? "selected" : ""}`}>
                          <input type="radio" name="shipping-address" checked={on} onChange={() => setSelected(a)} />
                          <div className="saved-address-content">
                            <div className="saved-address-name">
                              <strong>{nameOf(a)}</strong>
                              {(a.default || a.isDefault) && <span className="default-badge">Default</span>}
                            </div>
                            {a.phone && <p>{a.phone}</p>}
                            <p>{fmt(a)}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {!showForm && (
                  <button type="button" className="add-address-btn" onClick={() => setShowForm(true)}>
                    <Plus size={17} />
                    <span>Add New Address</span>
                  </button>
                )}

                {/* NEW ADDRESS FORM */}
                {showForm && (
                  <form className="new-address-form" onSubmit={saveAddress}>
                    <div className="new-address-form-title">
                      <h3>Add New Address</h3>
                      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>

                    <div className="address-form-grid">
                      <div className="address-input-group">
                        <label>Full Name *</label>
                        <div className="address-input-wrap">
                          <User size={17} />
                          <input type="text" name="name" value={form.name} onChange={onFormChange} placeholder="Enter full name" />
                        </div>
                      </div>
                      <div className="address-input-group">
                        <label>Phone Number *</label>
                        <div className="address-input-wrap">
                          <Phone size={17} />
                          <input type="tel" name="phone" value={form.phone} onChange={onFormChange} placeholder="Enter phone number" />
                        </div>
                      </div>
                    </div>

                    {/* COUNTRY */}
                    <div className="address-input-group">
                      <label>Country *</label>
                      <select name="country" value={form.country} onChange={onFormChange} className="address-select">
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* STATE: dropdown for India, text for others */}
                    <div className="address-input-group">
                      {form.country === "India" ? (
                        <>
                          <label>State / Union Territory *</label>
                          <select name="state" value={form.state} onChange={onFormChange} className="address-select">
                            <option value="">Select State / Union Territory</option>
                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </>
                      ) : (
                        <>
                          <label>State / Province *</label>
                          <input type="text" name="state" value={form.state} onChange={onFormChange} placeholder="State / Province" />
                        </>
                      )}
                    </div>

                    {/* CITY */}
                    <div className="address-input-group">
                      <label>City *</label>
                      <input type="text" name="city" value={form.city} onChange={onFormChange} placeholder="City" disabled={!form.state} />
                      {!form.state && <small className="disabled-info">Please select a state first</small>}
                    </div>

                    {/* STREET ADDRESS */}
                    <div className="address-input-group">
                      <label>Address *</label>
                      <input type="text" name="address" value={form.address} onChange={onFormChange} placeholder="House no, street, area" disabled={!form.state || !form.city} />
                      {(!form.state || !form.city) && <small className="disabled-info">Please select state and city first</small>}
                    </div>

                    {/* PINCODE */}
                    <div className="address-form-grid">
                      <div className="address-input-group">
                        <label>Pincode *</label>
                        <input type="text" name="pincode" value={form.pincode} onChange={onFormChange} placeholder="Pincode" />
                      </div>
                    </div>

                    <label className="default-address-check">
                      <input type="checkbox" name="default" checked={form.default} onChange={onFormChange} />
                      <span>Save as default address</span>
                    </label>

                    <button type="submit" className="save-address-btn">Save Address</button>
                  </form>
                )}

                <div className="checkout-next-area">
                  <button type="button" className="checkout-next-btn" disabled={!selected} onClick={toPayment}>
                    <span>Continue to Payment</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 2: PAYMENT ===== */}
            {step === 2 && (
              <div className="checkout-card">
                {header(CreditCard, "Payment Method", "Choose how you'll pay",
                  <button type="button" onClick={() => setStep(1)}>Change Address</button>)}

                <div className="payment-options">
                  {PAYMENTS.map(([id, title, desc]) => (
                    <label key={id} className={`payment-option ${payment === id ? "selected" : ""}`}>
                      <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} />
                      <div className="payment-icon"><CreditCard size={22} /></div>
                      <div>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="checkout-next-area">
                  <button type="button" className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="checkout-next-btn" onClick={() => setStep(3)}>
                    <span>Continue to Review</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 3: REVIEW ===== */}
            {step === 3 && (
              <>
                {/* ADDRESS REVIEW */}
                <div className="checkout-card">
                  {header(MapPin, "Shipping Address", "Delivery address",
                    <button type="button" onClick={() => setStep(1)}>Change</button>)}
                  <div className="selected-address">
                    <div className="selected-address-top">
                      <strong>{nameOf(selected)}</strong>
                      {(selected?.default || selected?.isDefault) && <span className="default-badge">Default</span>}
                    </div>
                    {selected?.phone && <p>{selected.phone}</p>}
                    <p>{fmt(selected)}</p>
                  </div>
                </div>

                {/* PAYMENT REVIEW */}
                <div className="checkout-card">
                  {header(CreditCard, "Payment Method", "Selected payment option",
                    <button type="button" onClick={() => setStep(2)}>Change</button>)}
                  <div className="selected-payment-review">
                    <CreditCard size={22} />
                    <div>
                      <strong>{pay[1]}</strong>
                      <span>Payment method selected</span>
                    </div>
                  </div>
                </div>

                {/* NOTES */}
                <div className="checkout-card">
                  <div className="checkout-card-header">
                    <div className="checkout-title">
                      <ClipboardList size={23} />
                      <div>
                        <h2>Order Notes <span>(Optional)</span></h2>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="order-notes"
                    maxLength={200}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for your order?"
                  />
                  <div className="notes-count">{notes.length}/200</div>
                </div>

                <div className="checkout-next-area">
                  <button type="button" className="checkout-back-btn" onClick={() => setStep(2)}>Back</button>
                  {placeBtn}
                </div>
              </>
            )}
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cart.map((item, i) => (
                <div className="checkout-product" key={item.id || i}>
                  <div className="checkout-product-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="checkout-product-info">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity} | {item.brand}</p>
                    <strong>₹{money(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>₹{money(cartSubtotal)}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Discount</span>
              <strong className="checkout-discount">-₹{money(cartDiscount)}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping Charges</span>
              <strong className="checkout-free">Free</strong>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-total">
              <span>Total Amount</span>
              <strong>₹{money(cartTotal)}</strong>
            </div>

            {step === 3 && placeBtn}

            <div className="checkout-secure">
              <Lock size={14} />
              <span>Your information is safe and secure.</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
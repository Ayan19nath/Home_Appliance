import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartContext = createContext(null);

// Read saved data from this browser (or the fallback when it is missing or broken)
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const qty = (value) => Math.max(1, Number(value) || 1);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = read("homehub-cart", []);
    return Array.isArray(saved) ? saved : [];
  });
  const [coupon, setCoupon] = useState(() => read("homehub-coupon", null)); // { code, amount }

  // Save the cart and the coupon in this browser
  useEffect(() => {
    try {
      localStorage.setItem("homehub-cart", JSON.stringify(cart));
    } catch {
      // ignore a full browser storage
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (coupon) localStorage.setItem("homehub-coupon", JSON.stringify(coupon));
      else localStorage.removeItem("homehub-coupon");
    } catch {
      // ignore a full browser storage
    }
  }, [coupon]);

  // Product ids and quantities (this is all the server needs to price the cart)
  const lines = cart.map((item) => ({ id: item.id, quantity: qty(item.quantity) }));
  const signature = JSON.stringify(lines);

  // Check the coupon again whenever the cart changes (the server gives the new amount, or rejects the code)
  useEffect(() => {
    if (!coupon) return;
    api.post("/coupon/check", { code: coupon.code, items: JSON.parse(signature) })
      .then(({ data }) => setCoupon({ code: data.code, amount: data.amount }))
      .catch(() => setCoupon(null));
  }, [signature]);

  /* ===== COUPON ===== */
  // Ask the server if the code works for this cart. Returns an error message, or "" when it worked.
  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post("/coupon/check", { code, items: lines });
      setCoupon({ code: data.code, amount: data.amount });
      return "";
    } catch (err) {
      return err.response?.data?.message || "Could not apply the coupon.";
    }
  };

  const removeCoupon = () => setCoupon(null);

  /* ===== CART ===== */
  // Add a product (the same product adds up)
  const addProductToCart = (product, quantity = 1) => {
    if (!product || product.id === undefined) return;
    setCart((current) =>
      current.some((item) => item.id === product.id)
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: qty(item.quantity) + qty(quantity) } : item))
        : [...current, { ...product, quantity: qty(quantity) }]
    );
  };

  const addToCart = (product) => addProductToCart(product, 1);

  // Change a quantity (a quantity of 0 removes the product)
  const changeQuantity = (id, by) =>
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Number(item.quantity || 1) + by } : item))
        .filter((item) => Number(item.quantity) > 0)
    );

  const increaseQuantity = (id) => changeQuantity(id, 1);
  const decreaseQuantity = (id) => changeQuantity(id, -1);
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  /* ===== TOTALS ===== */
  const cartItemCount = cart.reduce((total, item) => total + qty(item.quantity), 0);
  const cartSubtotal = cart.reduce((total, item) => total + Number(item.price || 0) * qty(item.quantity), 0);
  // saving from the old prices of the products
  const cartDiscount = cart.reduce(
    (total, item) => total + Math.max(0, Number(item.oldPrice || 0) - Number(item.price || 0)) * qty(item.quantity),
    0
  );
  const couponDiscount = Math.min(coupon?.amount || 0, cartSubtotal);
  const cartTotal = cartSubtotal - couponDiscount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addProductToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartDiscount,
        coupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export default CartContext;
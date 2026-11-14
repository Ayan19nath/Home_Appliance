import { useEffect, useState } from "react";
import { Check, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import api from "../api";
import "./OrderSuccess.css";

function OrderSuccess() {
  const { orderId, total } = useLocation().state || {}; // sent by Checkout after the server saved the order
  const [code, setCode] = useState("");

  // Load the delivery code of this order
  useEffect(() => {
    if (orderId) api.get(`/order/track/${orderId}`).then((res) => setCode(res.data.deliveryOtp || "")).catch(() => {});
  }, [orderId]);

  if (!orderId) return <Navigate to="/orders" replace />;

  return (
    <main className="order-success-page">
      <section className="order-success-container">
        <div className="order-success-icon">
          <Check size={62} strokeWidth={3} />
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className="order-success-thankyou">Thank you for shopping with HomeHub!</p>

        <p className="order-success-id">
          Your order ID is <strong>#{String(orderId).replace(/^#/, "")}</strong>
        </p>

        {Number(total) > 0 && (
          <p className="order-success-total">
            Total Amount: <strong>₹{Number(total).toLocaleString("en-IN")}</strong>
          </p>
        )}

        {/* Delivery code: the customer gives it to the delivery person */}
        {code && (
          <div style={{ margin: "22px auto 0", maxWidth: 430, padding: "14px 18px", borderRadius: 12, background: "#fff6df", border: "1px solid #f1d9a0", color: "#7a5200" }}>
            <div style={{ fontSize: 14 }}>Your delivery code</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, margin: "4px 0" }}>{code}</div>
            <div style={{ fontSize: 13 }}>
              Give this code to the delivery person only when you receive your order. We also emailed it to you, and you can see it on My Orders.
            </div>
          </div>
        )}

        <div className="order-success-actions">
          <Link to="/orders" className="order-success-primary">
            <Package size={20} />
            <span>View Order Details</span>
            <ArrowRight size={20} />
          </Link>
          <Link to="/shop" className="order-success-secondary">
            <ShoppingBag size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Delivery illustration */}
        <div className="order-delivery-illustration">
          <div className="delivery-box">
            <div className="delivery-box-tape"></div>
            <div className="delivery-box-lines"><span></span><span></span><span></span></div>
          </div>
          <div className="delivery-blender">
            <div className="blender-top"></div>
            <div className="blender-jar"><div className="blender-liquid"></div></div>
            <div className="blender-base"><div className="blender-button"></div></div>
          </div>
          <div className="delivery-plant">
            <div className="plant-leaf leaf-one"></div>
            <div className="plant-leaf leaf-two"></div>
            <div className="plant-leaf leaf-three"></div>
            <div className="plant-leaf leaf-four"></div>
            <div className="plant-stem"></div>
            <div className="plant-pot"></div>
          </div>
        </div>

        <h2 className="delivery-message">Your order will be delivered soon!</h2>
        <p className="delivery-submessage">We'll keep you updated about your order status.</p>
      </section>
    </main>
  );
}

export default OrderSuccess;
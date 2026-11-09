import React from "react";
import { Check, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();

  /* ========================================= */
  /* GET ORDER DATA                             */
  /* ========================================= */

  let orderData = location.state || {};

  /* ========================================= */
  /* FALLBACK - LOCAL STORAGE                  */
  /* ========================================= */

  if (!orderData.orderId) {
    try {
      const savedOrders = localStorage.getItem(
        "homehub-orders"
      );

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          const latestOrder =
            parsedOrders[parsedOrders.length - 1];

          orderData = {
            orderId:
              latestOrder.orderId ||
              latestOrder.id ||
              "",
            total:
              latestOrder.total ||
              latestOrder.cartTotal ||
              0,
          };
        }
      }
    } catch (error) {
      console.error(
        "Order Success Load Error:",
        error
      );
    }
  }

  /* ========================================= */
  /* ORDER ID                                   */
  /* ========================================= */

  const orderId =
    orderData.orderId ||
    orderData.id ||
    "#HH" + Date.now().toString().slice(-6);

  /* ========================================= */
  /* TOTAL                                      */
  /* ========================================= */

  const total = Number(
    orderData.total ||
      orderData.cartTotal ||
      0
  );

  return (
    <main className="order-success-page">

      <section className="order-success-container">

        {/* ===================================== */}
        {/* SUCCESS ICON                           */}
        {/* ===================================== */}

        <div className="order-success-icon">
          <Check size={62} strokeWidth={3} />
        </div>

        {/* ===================================== */}
        {/* HEADING                               */}
        {/* ===================================== */}

        <h1>
          Order Placed Successfully!
        </h1>

        <p className="order-success-thankyou">
          Thank you for shopping with HomeHub!
        </p>

        {/* ===================================== */}
        {/* ORDER ID                              */}
        {/* ===================================== */}

        <p className="order-success-id">
          Your order ID is{" "}
          <strong>
            {String(orderId).startsWith("#")
              ? orderId
              : `#${orderId}`}
          </strong>
        </p>

        {/* ===================================== */}
        {/* TOTAL - ONLY IF AVAILABLE             */}
        {/* ===================================== */}

        {total > 0 && (
          <p className="order-success-total">
            Total Amount:{" "}
            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </p>
        )}

        {/* ===================================== */}
        {/* BUTTONS                               */}
        {/* ===================================== */}

        <div className="order-success-actions">

          <Link
            to="/orders"
            className="order-success-primary"
          >
            <Package size={20} />
            <span>
              View Order Details
            </span>
            <ArrowRight size={20} />
          </Link>

          <Link
            to="/shop"
            className="order-success-secondary"
          >
            <ShoppingBag size={20} />
            <span>
              Continue Shopping
            </span>
          </Link>

        </div>

        {/* ===================================== */}
        {/* DELIVERY ILLUSTRATION                 */}
        {/* ===================================== */}

        <div className="order-delivery-illustration">

          {/* PACKAGE */}

          <div className="delivery-box">

            <div className="delivery-box-tape"></div>

            <div className="delivery-box-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

          {/* BLENDER */}

          <div className="delivery-blender">

            <div className="blender-top"></div>

            <div className="blender-jar">

              <div className="blender-liquid"></div>

            </div>

            <div className="blender-base">

              <div className="blender-button"></div>

            </div>

          </div>

          {/* PLANT */}

          <div className="delivery-plant">

            <div className="plant-leaf leaf-one"></div>

            <div className="plant-leaf leaf-two"></div>

            <div className="plant-leaf leaf-three"></div>

            <div className="plant-leaf leaf-four"></div>

            <div className="plant-stem"></div>

            <div className="plant-pot"></div>

          </div>

        </div>

        {/* ===================================== */}
        {/* DELIVERY MESSAGE                      */}
        {/* ===================================== */}

        <h2 className="delivery-message">
          Your order will be delivered soon!
        </h2>

        <p className="delivery-submessage">
          We'll keep you updated about your order status.
        </p>

      </section>

    </main>
  );
}

export default OrderSuccess;
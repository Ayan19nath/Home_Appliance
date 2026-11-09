import React from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../Context/CartContext";

import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartItemCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
  } = useCart();

  /* =========================
     EMPTY CART
  ========================= */

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">

          <ShoppingCart size={55} />

          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/shop"
            className="cart-shop-btn"
          >
            Continue Shopping
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="cart-heading">

          <h1>
            Shopping Cart ({cartItemCount} Items)
          </h1>

          <Link to="/shop">
            Continue Shopping →
          </Link>

        </div>

        <div className="cart-layout">

          {/* =========================
              LEFT - CART PRODUCTS
          ========================= */}

          <div className="cart-products">

            {cart.map((item) => (

              <div
                className="cart-product"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="cart-product-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                {/* PRODUCT INFO */}

                <div className="cart-product-info">

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-product-name"
                  >
                    {item.name}
                  </Link>

                  <p className="cart-brand">
                    Brand: {item.brand}
                  </p>

                  {/* PRICE */}

                  <div className="cart-price">

                    <strong>
                      ₹
                      {Number(item.price || 0).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    {item.oldPrice && (
                      <del>
                        ₹
                        {Number(
                          item.oldPrice
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </del>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="cart-actions">

                    {/* QUANTITY */}

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        <Minus size={15} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        <Plus size={15} />
                      </button>

                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      className="remove-cart"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>

                  </div>

                </div>

                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  ).toLocaleString("en-IN")}

                </div>

              </div>

            ))}

          </div>

          {/* =========================
              RIGHT - ORDER SUMMARY
          ========================= */}

          <aside className="order-summary">

            <h2>
              Order Summary
            </h2>

            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {cartSubtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* DISCOUNT */}

            <div className="summary-row discount-row">

              <span>
                Discount
              </span>

              <strong>

                -₹
                {cartDiscount.toLocaleString(
                  "en-IN"
                )}

                {" "}

                <small>
                  (Applied)
                </small>

              </strong>

            </div>

            {/* SHIPPING */}

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <strong className="free">
                Free
              </strong>

            </div>

            <div className="summary-divider" />

            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Estimated Total
              </span>

              <strong>
                ₹
                {cartTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
};

export default Cart;
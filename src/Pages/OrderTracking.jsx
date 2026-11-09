import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
  Home,
} from "lucide-react";

import "./OrderTracking.css";

import { products } from "../data/products";
import OrderTrackingImage from "../assets/images/order-tracking.jpeg";

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    const sessionUser = sessionStorage.getItem("homehub-user");

    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);

        if (user?.loggedIn) {
          return user;
        }
      } catch (error) {
        console.error("Session User Error:", error);
      }
    }

    const localUser = localStorage.getItem("homehub-user");

    if (localUser) {
      try {
        const user = JSON.parse(localUser);

        if (user?.loggedIn) {
          return user;
        }
      } catch (error) {
        console.error("Local User Error:", error);
      }
    }

    return null;
  };

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDateTime = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =====================================================
     GET ORDERS
  ===================================================== */

  const getOrders = () => {
    try {
      const savedOrders = localStorage.getItem("homehub-orders");

      if (!savedOrders) {
        return [];
      }

      const parsedOrders = JSON.parse(savedOrders);

      if (!Array.isArray(parsedOrders)) {
        return [];
      }

      const currentUser = getCurrentUser();

      if (!currentUser?.email) {
        return [];
      }

      const email = currentUser.email.trim().toLowerCase();

      return parsedOrders.filter((order) => {
        const orderEmail = String(order?.userEmail || "")
          .trim()
          .toLowerCase();

        return orderEmail === email;
      });
    } catch (error) {
      console.error("Order Tracking Load Error:", error);
      return [];
    }
  };

  /* =====================================================
     PRODUCT DATA
  ===================================================== */

  const getProductData = (order) => {
    const firstProduct = order?.products?.[0] || {};

    const id =
      firstProduct.id ||
      firstProduct.productId ||
      order?.productId;

    const product = products.find(
      (item) => Number(item.id) === Number(id)
    );

    return {
      id,

      name:
        firstProduct.name ||
        product?.name ||
        "HomeHub Product",

      image:
        firstProduct.image ||
        product?.image ||
        "",

      category:
        firstProduct.category ||
        product?.category ||
        "Home Appliance",

      quantity:
        Number(firstProduct.quantity || 1),

      price:
        Number(
          firstProduct.price ||
            product?.price ||
            0
        ),
    };
  };

  /* =====================================================
     GET STAGE DATE
  ===================================================== */

  const getStageDate = (order, stage) => {
    if (!order) {
      return "";
    }

    /*
      Supports different possible names so the page
      can work with your current localStorage orders
      and future backend orders.
    */

    const timeline = Array.isArray(order.timeline)
      ? order.timeline
      : [];

    const timelineStep = timeline.find((item) => {
      const title = String(item?.title || "")
        .trim()
        .toLowerCase();

      return title === stage.toLowerCase();
    });

    if (timelineStep?.date) {
      return formatDateTime(timelineStep.date);
    }

    const possibleFields = {
      "Order Placed": [
        order.placedAt,
        order.orderPlacedAt,
        order.createdAt,
      ],

      Processing: [
        order.processingAt,
        order.processedAt,
      ],

      "Out for Delivery": [
        order.outForDeliveryAt,
        order.outForDeliveryDate,
        order.shippedAt,
        order.shippingAt,
      ],

      Delivered: [
        order.deliveredAt,
        order.deliveryAt,
        order.deliveredDate,
      ],
    };

    const values = possibleFields[stage] || [];

    const validValue = values.find(Boolean);

    return validValue
      ? formatDateTime(validValue)
      : "";
  };

  /* =====================================================
     STATUS NORMALIZER
  ===================================================== */

  const normalizeStatus = (status) => {
    const value = String(status || "")
      .trim()
      .toLowerCase();

    if (value === "processing") {
      return "Processing";
    }

    if (
      value === "shipped" ||
      value === "shipping" ||
      value === "on the way"
    ) {
      return "Out for Delivery";
    }

    if (
      value === "out for delivery" ||
      value === "out_for_delivery"
    ) {
      return "Out for Delivery";
    }

    if (value === "delivered") {
      return "Delivered";
    }

    if (value === "cancelled" || value === "canceled") {
      return "Cancelled";
    }

    return "Processing";
  };

  /* =====================================================
     SEARCH ORDER
  ===================================================== */

  const findOrder = (value) => {
    const orders = getOrders();

    const cleanValue = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^#/, "");

    if (!cleanValue) {
      return null;
    }

    const found = orders.find((order) => {
      const possibleIds = [
        order?.id,
        order?.orderId,
        order?.trackingNumber,
        order?.trackingId,
      ];

      return possibleIds.some((id) => {
        return (
          String(id || "")
            .trim()
            .toLowerCase()
            .replace(/^#/, "") === cleanValue
        );
      });
    });

    if (!found) {
      return null;
    }

    const product = getProductData(found);

    const status = normalizeStatus(found.status);

    return {
      ...found,

      productId: product.id,
      productName: product.name,
      productImage: product.image,
      category: product.category,
      quantity: product.quantity,
      unitPrice: product.price,

      displayOrderId:
        found.orderId ||
        found.id ||
        `HH${Date.now()}`,

      status,

      total:
        Number(
          found.total ||
            found.cartTotal ||
            product.price * product.quantity ||
            0
        ),
    };
  };

  /* =====================================================
     TRACK ORDER
  ===================================================== */

  const handleTrackOrder = (event) => {
    event.preventDefault();

    const order = findOrder(searchValue);

    setSearched(true);
    setSelectedOrder(order);
  };

  /* =====================================================
     LOAD URL ORDER
  ===================================================== */

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const order = findOrder(orderId);

    setSearchValue(
      String(
        order?.displayOrderId ||
          orderId
      )
    );

    setSelectedOrder(order);
    setSearched(true);
  }, [orderId]);

  /* =====================================================
     LISTEN FOR ORDER CHANGES
  ===================================================== */

  useEffect(() => {
    const refreshOrder = () => {
      if (searchValue) {
        const order = findOrder(searchValue);
        setSelectedOrder(order);
      }
    };

    window.addEventListener(
      "homehub-orders-changed",
      refreshOrder
    );

    window.addEventListener(
      "homehub-order-placed",
      refreshOrder
    );

    window.addEventListener(
      "storage",
      refreshOrder
    );

    return () => {
      window.removeEventListener(
        "homehub-orders-changed",
        refreshOrder
      );

      window.removeEventListener(
        "homehub-order-placed",
        refreshOrder
      );

      window.removeEventListener(
        "storage",
        refreshOrder
      );
    };
  }, [searchValue]);

  /* =====================================================
     TIMELINE
  ===================================================== */

  const timeline = useMemo(() => {
    const status =
      selectedOrder?.status || "Processing";

    const statusLevel = {
      Processing: 2,
      "Out for Delivery": 3,
      Delivered: 4,
    };

    const currentLevel =
      statusLevel[status] || 2;

    return [
      {
        id: 1,
        title: "Order Placed",
        description: "Your order has been placed.",
        icon: ShoppingCart,
        level: 1,
        date: selectedOrder
          ? getStageDate(
              selectedOrder,
              "Order Placed"
            )
          : "",
      },

      {
        id: 2,
        title: "Processing",
        description:
          "Your order is being prepared.",
        icon: Package,
        level: 2,
        date: selectedOrder
          ? getStageDate(
              selectedOrder,
              "Processing"
            )
          : "",
      },

      {
        id: 3,
        title: "Out for Delivery",
        description:
          "Your package is on the way.",
        icon: Truck,
        level: 3,
        date: selectedOrder
          ? getStageDate(
              selectedOrder,
              "Out for Delivery"
            )
          : "",
      },

      {
        id: 4,
        title: "Delivered",
        description:
          "Your order has been delivered.",
        icon: Home,
        level: 4,
        date: selectedOrder
          ? getStageDate(
              selectedOrder,
              "Delivered"
            )
          : "",
      },
    ].map((step) => ({
      ...step,

      completed:
        selectedOrder &&
        status !== "Cancelled" &&
        step.level <= currentLevel,

      current:
        selectedOrder &&
        status !== "Cancelled" &&
        step.level === currentLevel,
    }));
  }, [selectedOrder]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="new-order-tracking-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="order-tracking-hero">

        <img
          src={OrderTrackingImage}
          alt="HomeHub Order Tracking"
          className="order-tracking-hero-image"
        />

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
            <strong>
              Anytime, Anywhere
            </strong>
          </h1>

          <p>
            Enter your order ID or tracking number
            to get real-time updates on your
            delivery status.
          </p>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="order-tracking-container">

        {/* =================================================
            SEARCH CARD
        ================================================= */}

        <section className="order-details-card">

          <div className="order-details-heading">

            <div className="order-details-icon">
              <Package size={29} />
            </div>

            <div>
              <h2>
                Enter Your Order Details
              </h2>

              <p>
                Please enter your order ID or
                tracking number to check the
                status of your order.
              </p>
            </div>

          </div>

          <form
            className="order-tracking-search-form"
            onSubmit={handleTrackOrder}
          >

            <div className="order-tracking-input-box">

              <Package size={21} />

              <input
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder="Order ID / Tracking Number"
                aria-label="Order ID or Tracking Number"
              />

              {searchValue && (
                <button
                  type="button"
                  className="input-search-icon"
                  onClick={() => {
                    const order =
                      findOrder(searchValue);

                    setSearched(true);
                    setSelectedOrder(order);
                  }}
                  aria-label="Search order"
                >
                  <Search size={20} />
                </button>
              )}

            </div>

            <button
              type="submit"
              className="track-order-main-button"
            >
              <span>Track Order</span>
              <ChevronRight size={21} />
            </button>

          </form>

          {searched && !selectedOrder && (
            <div className="order-search-error">
              <Package size={20} />
              <span>
                Order not found. Please check your
                order ID or tracking number.
              </span>
            </div>
          )}

        </section>

        {/* =================================================
            JOURNEY
        ================================================= */}

        <section className="order-journey-card">

          <div className="order-journey-intro">

            <div className="journey-icon">
              <Truck size={27} />
            </div>

            <div>
              <h2>
                Your Order Journey
              </h2>

              <p>
                From our warehouse to your doorstep
              </p>
            </div>

          </div>

          <div className="order-journey-timeline">

            <div className="journey-progress-line">
              <div
                className="journey-progress-filled"
                style={{
                  width: selectedOrder
                    ? `${
                        timeline.filter(
                          (step) =>
                            step.completed
                        ).length === 1
                          ? "0%"
                          : timeline.filter(
                              (step) =>
                                step.completed
                            ).length === 2
                          ? "33.33%"
                          : timeline.filter(
                              (step) =>
                                step.completed
                            ).length === 3
                          ? "66.66%"
                          : "100%"
                      }`
                    : "0%",
                }}
              ></div>
            </div>

            {timeline.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  className={`journey-step ${
                    step.completed
                      ? "journey-completed"
                      : ""
                  } ${
                    step.current
                      ? "journey-current"
                      : ""
                  }`}
                  key={step.id}
                >

                  <div className="journey-step-icon">
                    <Icon size={23} />
                  </div>

                  <h3>
                    {step.title}
                  </h3>

                  {step.date ? (
                    <span className="journey-date">
                      {step.date}
                    </span>
                  ) : (
                    <span className="journey-pending">
                      Pending
                    </span>
                  )}

                  {step.current &&
                    selectedOrder?.status !==
                      "Delivered" && (
                      <small>
                        In Progress
                      </small>
                    )}

                </div>
              );
            })}

          </div>

        </section>

        {/* =================================================
            ORDER RESULT
        ================================================= */}

        <section className="tracked-order-section">

          <div className="tracked-order-heading">

            <div>
              <h2>
                Order Status
              </h2>

              <p>
                {selectedOrder
                  ? "Latest updates for your order."
                  : "Enter your order number to view the latest updates."}
              </p>
            </div>

          </div>

          {selectedOrder ? (

            <article className="tracked-order-card">

              {/* TOP */}

              <div className="tracked-order-top">

                <div>
                  <span>
                    Order Number
                  </span>

                  <strong>
                    #
                    {String(
                      selectedOrder.displayOrderId
                    ).replace(/^#/, "")}
                  </strong>
                </div>

                <div
                  className={`tracked-status ${
                    selectedOrder.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  }`}
                >
                  {selectedOrder.status ===
                    "Delivered" ? (
                    <CheckCircle2 size={17} />
                  ) : selectedOrder.status ===
                    "Cancelled" ? (
                    <span>×</span>
                  ) : (
                    <Truck size={17} />
                  )}

                  {selectedOrder.status}
                </div>

              </div>

              {/* PRODUCT */}

              <div className="tracked-product-row">

                <div className="tracked-product-image">

                  {selectedOrder.productImage ? (
                    <img
                      src={
                        selectedOrder.productImage
                      }
                      alt={
                        selectedOrder.productName
                      }
                    />
                  ) : (
                    <Package size={45} />
                  )}

                </div>

                <div className="tracked-product-info">

                  <span>
                    {selectedOrder.category}
                  </span>

                  <h3>
                    {selectedOrder.productName}
                  </h3>

                  <p>
                    Quantity:{" "}
                    {selectedOrder.quantity}
                  </p>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder.unitPrice || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

              {/* DETAILS */}

              <div className="tracked-order-details">

                <div>
                  <span>
                    Placed On
                  </span>

                  <strong>
                    {getStageDate(
                      selectedOrder,
                      "Order Placed"
                    ) || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>
                    Order Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedOrder.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment
                  </span>

                  <strong>
                    {selectedOrder.paymentMethod ||
                      "Online Payment"}
                  </strong>
                </div>

              </div>

              {/* STATUS MESSAGE */}

              <div className="tracked-status-message">

                <div className="status-message-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <strong>
                    {selectedOrder.status ===
                    "Delivered"
                      ? "Order Delivered"
                      : selectedOrder.status ===
                        "Cancelled"
                      ? "Order Cancelled"
                      : selectedOrder.status ===
                        "Out for Delivery"
                      ? "Your order is on the way"
                      : "Your order is being processed"}
                  </strong>

                  <p>
                    {selectedOrder.status ===
                    "Delivered"
                      ? "Your package has been successfully delivered."
                      : selectedOrder.status ===
                        "Cancelled"
                      ? "This order has been cancelled."
                      : selectedOrder.status ===
                        "Out for Delivery"
                      ? "Your package is currently out for delivery."
                      : "Your order is being prepared for shipping."}
                  </p>
                </div>

              </div>

              {/* ACTIONS */}

              <div className="tracked-order-actions">

                <Link
                  to={`/product/${selectedOrder.productId}`}
                  className="my-product-button"
                >
                  <Package size={17} />
                  My Product
                </Link>

                <Link
                  to="/orders"
                  className="my-orders-button"
                >
                  View My Orders
                  <ChevronRight size={17} />
                </Link>

              </div>

            </article>

          ) : (

            <div className="tracked-empty-state">

              <div className="empty-package-icon">
                <Package size={52} />
              </div>

              <h3>
                Track Your Order
              </h3>

              <p>
                Enter your order ID above and
                we'll show you the latest delivery
                status here.
              </p>

            </div>

          )}

        </section>

        {/* =================================================
            QUICK LINKS
        ================================================= */}

        <div className="tracking-bottom-links">

          <Link to="/">
            <Home size={17} />
            Back to Home
          </Link>

          <Link to="/orders">
            <Package size={17} />
            My Orders
          </Link>

          <Link to="/shop">
            <ShoppingCart size={17} />
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderTracking;
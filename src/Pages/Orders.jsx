import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Headphones,
  MapPin,
  ChevronRight,
  Eye,
  ShoppingCart,
  Truck,
  X,
  CheckCircle2,
  Clock3,
  Package,
  UserCircle,
  LogIn,
  Trash2,
} from "lucide-react";

import "./Orders.css";

import { products } from "../data/products";

function Orders() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] =
    useState("All Orders");

  const [searchOrder, setSearchOrder] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  /* ================================================= */
  /* GET CURRENT USER                                  */
  /* ================================================= */

  const getCurrentUser = () => {
    const sessionUser =
      sessionStorage.getItem("homehub-user");

    if (sessionUser) {
      try {
        const parsedUser =
          JSON.parse(sessionUser);

        if (parsedUser?.loggedIn) {
          return parsedUser;
        }
      } catch {
        return null;
      }
    }

    const savedUser =
      localStorage.getItem("homehub-user");

    if (savedUser) {
      try {
        const parsedUser =
          JSON.parse(savedUser);

        if (parsedUser?.loggedIn) {
          return parsedUser;
        }
      } catch {
        return null;
      }
    }

    return null;
  };

  /* ================================================= */
  /* LOAD USER                                         */
  /* ================================================= */

  useEffect(() => {
    const loadUser = () => {
      setUser(getCurrentUser());
    };

    loadUser();

    window.addEventListener(
      "homehub-auth-changed",
      loadUser
    );

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "homehub-auth-changed",
        loadUser
      );

      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  /* ================================================= */
  /* PRODUCT IMAGE                                     */
  /* ================================================= */

  const getProductImage = (productId) => {
    const product = products.find(
      (item) =>
        Number(item.id) === Number(productId)
    );

    return product?.image || "";
  };

  /* ================================================= */
  /* DATE FORMAT                                       */
  /* ================================================= */

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "Recently";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================================================= */
  /* CREATE TIMELINE                                   */
  /* ================================================= */

  const createTimeline = (
    status,
    createdAt,
    cancelledAt
  ) => {
    const placedDate =
      formatDateTime(createdAt);

    const cancelledDate =
      cancelledAt
        ? formatDateTime(cancelledAt)
        : "";

    if (status === "Cancelled") {
      return [
        {
          title: "Order Placed",
          date: placedDate,
          completed: true,
        },
        {
          title: "Cancelled",
          date: cancelledDate,
          completed: true,
        },
      ];
    }

    return [
      {
        title: "Order Placed",
        date: placedDate,
        completed: true,
      },
      {
        title: "Shipped",
        date: "",
        completed:
          status === "Shipped" ||
          status === "Out for Delivery" ||
          status === "Delivered",
      },
      {
        title: "Out for Delivery",
        date: "",
        completed:
          status === "Out for Delivery" ||
          status === "Delivered",
      },
      {
        title: "Delivered",
        date: "",
        completed:
          status === "Delivered",
      },
    ];
  };

  /* ================================================= */
  /* LOAD ORDERS                                       */
  /* ================================================= */

  const loadOrders = () => {
    try {
      const savedOrders =
        localStorage.getItem(
          "homehub-orders"
        );

      if (!savedOrders) {
        setOrders([]);
        return;
      }

      const parsedOrders =
        JSON.parse(savedOrders);

      if (!Array.isArray(parsedOrders)) {
        setOrders([]);
        return;
      }

      const currentUser =
        getCurrentUser();

      if (!currentUser?.email) {
        setOrders([]);
        return;
      }

      const currentEmail =
        currentUser.email
          .trim()
          .toLowerCase();

      const userOrders =
        parsedOrders.filter(
          (order) =>
            order?.userEmail &&
            order.userEmail
              .trim()
              .toLowerCase() ===
            currentEmail
        );

      const formattedOrders =
        userOrders.map(
          (order, index) => {

            const firstProduct =
              order.products?.[0] || {};

            const productId =
              firstProduct.id ||
              firstProduct.productId ||
              order.productId;

            const product =
              products.find(
                (item) =>
                  Number(item.id) ===
                  Number(productId)
              );

            const productName =
              firstProduct.name ||
              product?.name ||
              "HomeHub Product";

            const image =
              firstProduct.image ||
              product?.image ||
              getProductImage(
                productId
              );

            const quantity =
              Number(
                firstProduct.quantity ||
                1
              );

            const unitPrice =
              Number(
                firstProduct.price ||
                product?.price ||
                0
              );

            const orderTotal =
              Number(
                order.total ||
                order.cartTotal ||
                unitPrice * quantity ||
                0
              );

            const status =
              order.status ||
              "Processing";

            return {
              ...order,

              id:
                order.id ||
                `order-${index}`,

              productId,

              productName,

              description:
                firstProduct.description ||
                product?.category ||
                "Home appliance",

              image,

              quantity,

              unitPrice,

              price:
                `₹${unitPrice.toLocaleString(
                  "en-IN"
                )}`,

              color:
                firstProduct.color ||
                firstProduct.selectedColor ||
                "Standard",

              category:
                firstProduct.category ||
                product?.category ||
                "Electric Product",

              orderId:
                order.orderId ||
                `#${order.id}`,

              date:
                formatDateTime(
                  order.createdAt
                ),

              status,

              total:
                orderTotal,

              timeline:
                createTimeline(
                  status,
                  order.createdAt,
                  order.cancelledAt
                ),
            };
          }
        );

      setOrders(formattedOrders);

    } catch (error) {
      console.error(
        "Orders Load Error:",
        error
      );

      setOrders([]);
    }
  };

  /* ================================================= */
  /* INITIAL LOAD + EVENTS                             */
  /* ================================================= */

  useEffect(() => {
    loadOrders();

    const handleOrdersChanged = () => {
      loadOrders();
    };

    window.addEventListener(
      "homehub-order-placed",
      handleOrdersChanged
    );

    window.addEventListener(
      "homehub-orders-changed",
      handleOrdersChanged
    );

    window.addEventListener(
      "homehub-auth-changed",
      handleOrdersChanged
    );

    window.addEventListener(
      "storage",
      handleOrdersChanged
    );

    return () => {
      window.removeEventListener(
        "homehub-order-placed",
        handleOrdersChanged
      );

      window.removeEventListener(
        "homehub-orders-changed",
        handleOrdersChanged
      );

      window.removeEventListener(
        "homehub-auth-changed",
        handleOrdersChanged
      );

      window.removeEventListener(
        "storage",
        handleOrdersChanged
      );
    };
  }, []);

  /* ================================================= */
  /* FILTERS                                           */
  /* ================================================= */

  const filters = [
    "All Orders",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  /* ================================================= */
  /* FILTER + SEARCH                                   */
  /* ================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {

      const matchesFilter =
        activeFilter === "All Orders" ||
        order.status === activeFilter;

      const search =
        searchOrder
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        order.orderId
          .toLowerCase()
          .includes(search) ||
        order.productName
          .toLowerCase()
          .includes(search);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [
    orders,
    activeFilter,
    searchOrder,
  ]);

  /* ================================================= */
  /* CANCEL ORDER                                      */
  /* ================================================= */

  const handleCancelOrder = (order) => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (order.status !== "Processing") {
      return;
    }

    navigate(
      `/cancel-order/${order.id}`
    );
  };

  /* ================================================= */
  /* DELETE ORDER                                      */
  /* ================================================= */

  const handleDeleteOrder = (order) => {

    if (!user) {
      navigate("/login");
      return;
    }

    const confirmed =
      window.confirm(
        "Remove this order from your order history? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {

      const savedOrders =
        localStorage.getItem(
          "homehub-orders"
        );

      const parsedOrders =
        savedOrders
          ? JSON.parse(savedOrders)
          : [];

      if (!Array.isArray(parsedOrders)) {
        return;
      }

      const updatedOrders =
        parsedOrders.filter(
          (savedOrder) =>
            String(savedOrder.id || savedOrder.orderId) !==
            String(order.id || order.orderId)
        );

      localStorage.setItem(
        "homehub-orders",
        JSON.stringify(
          updatedOrders
        )
      );

      window.dispatchEvent(
        new Event(
          "homehub-orders-changed"
        )
      );

      window.alert(
        "Order removed from history."
      );

    } catch (error) {

      console.error(
        "Delete Order Error:",
        error
      );

      window.alert(
        "Unable to remove the order."
      );
    }
  };

  /* ================================================= */
  /* ORDER ACTION                                      */
  /* ================================================= */

  const handleOrderAction = (order) => {

    if (!user) {
      navigate("/login");
      return;
    }

    /* =========================
       TRACK ORDER
    ========================= */

    if (
      order.status === "Shipped" ||
      order.status === "Out for Delivery" ||
      order.status === "Delivered" ||
      order.status === "Processing"
    ) {
      navigate(
        `/order-tracking/${order.id}`
      );

      return;
    }
  };

  /* ================================================= */
  /* SIDEBAR ORDER TRACKING                            */
  /* ================================================= */

  const handleSidebarTracking = () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (orders.length === 0) {
      navigate("/shop");
      return;
    }

    navigate(
      `/order-tracking/${orders[0].id}`
    );
  };

  /* ================================================= */
  /* DISPLAY USER                                      */
  /* ================================================= */

  const displayName =
    user?.name ||
    "Guest User";

  const displayEmail =
    user?.email ||
    "Please login to view your orders";

  /* ================================================= */
  /* RENDER                                            */
  /* ================================================= */

  return (
    <main className="orders-page">

      {/* HERO */}

      <section className="orders-hero">

        <div className="orders-hero-content">

          <div className="orders-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <ChevronRight size={14} />

            <span>
              My Orders
            </span>

          </div>

          <h1>
            My Orders
          </h1>

          <p>
            Track, manage and view your recent orders.
            <br />
            Your happiness is our priority!
          </p>

        </div>

        <div className="orders-hero-overlay"></div>

      </section>

      {/* MAIN CONTENT */}

      <section className="orders-section">

        <div className="orders-layout">

          {/* SIDEBAR */}

          <aside className="orders-sidebar">

            <div className="orders-user">

              <div className="orders-user-icon">
                <UserCircle size={58} />
              </div>

              <div className="orders-user-info">

                <h3>
                  {displayName}
                </h3>

                <p>
                  {displayEmail}
                </p>

              </div>

            </div>

            {/* HELP */}

            <Link
              to="/contact"
              className="orders-side-button help-button"
            >

              <div className="orders-side-icon">
                <Headphones size={28} />
              </div>

              <div className="orders-side-text">

                <strong>
                  Help Me
                </strong>

                <span>
                  Get quick support & assistance
                </span>

              </div>

              <ChevronRight size={22} />

            </Link>

            {/* ORDER TRACKING */}

            <button
              type="button"
              className="orders-side-button tracking-button"
              onClick={
                handleSidebarTracking
              }
            >

              <div className="orders-side-icon">
                <MapPin size={29} />
              </div>

              <div className="orders-side-text">

                <strong>
                  Order Tracking
                </strong>

                <span>
                  Track your order status
                </span>

              </div>

              <ChevronRight size={22} />

            </button>

            {/* LOGIN */}

            {!user && (

              <button
                type="button"
                className="orders-side-button"
                onClick={() =>
                  navigate("/login")
                }
              >

                <div className="orders-side-icon">
                  <LogIn size={28} />
                </div>

                <div className="orders-side-text">

                  <strong>
                    Login
                  </strong>

                  <span>
                    Login to view your account
                  </span>

                </div>

                <ChevronRight size={22} />

              </button>

            )}

          </aside>

          {/* ORDERS CONTENT */}

          <div className="orders-content">

            <div className="orders-content-header">

              <h2>
                My Orders
              </h2>

              <div className="order-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search by order ID"
                  value={searchOrder}
                  onChange={(e) =>
                    setSearchOrder(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* FILTERS */}

            <div className="order-filters">

              {filters.map(
                (filter) => (

                  <button
                    type="button"
                    key={filter}
                    className={
                      activeFilter ===
                      filter
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveFilter(
                        filter
                      )
                    }
                  >
                    {filter}
                  </button>

                )
              )}

            </div>

            {/* ORDER LIST */}

            <div className="orders-list">

              {filteredOrders.length > 0 ? (

                filteredOrders.map(
                  (order) => (

                    <article
                      className="order-card"
                      key={
                        order.id
                      }
                    >

                      {/* PRODUCT */}

                      <div className="order-product">

                        <div className="order-product-image">

                          <img
                            src={
                              order.image
                            }
                            alt={
                              order.productName
                            }
                          />

                        </div>

                        <div className="order-product-info">

                          <h3>
                            {
                              order.productName
                            }
                          </h3>

                          <p>
                            {
                              order.description
                            }
                          </p>

                          <strong className="order-price">
                            {
                              order.price
                            }
                          </strong>

                          <span className="order-meta">

                            Qty:{" "}
                            {
                              order.quantity
                            }

                            <span>
                              |
                            </span>

                            Color:{" "}
                            {
                              order.color
                            }

                          </span>

                          <span className="product-category">
                            {
                              order.category
                            }
                          </span>

                        </div>

                      </div>

                      {/* ORDER INFORMATION */}

                      <div className="order-information">

                        <p>

                          <span>
                            Order ID:
                          </span>{" "}

                          {
                            order.orderId
                          }

                        </p>

                        <p>

                          <span>
                            Placed on:
                          </span>{" "}

                          {
                            order.date
                          }

                        </p>

                      </div>

                      {/* STATUS */}

                      <div className="order-status">

                        <div
                          className={`status-badge ${
                            order.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >

                          {order.status ===
                            "Delivered" && (
                            <CheckCircle2
                              size={16}
                            />
                          )}

                          {order.status ===
                            "Shipped" && (
                            <Truck
                              size={16}
                            />
                          )}

                          {order.status ===
                            "Processing" && (
                            <Clock3
                              size={16}
                            />
                          )}

                          {order.status ===
                            "Cancelled" && (
                            <X
                              size={16}
                            />
                          )}

                          {
                            order.status
                          }

                        </div>

                        <div className="mini-timeline">

                          {order.timeline.map(
                            (
                              step,
                              index
                            ) => (

                              <div
                                className={`mini-timeline-item ${
                                  step.completed
                                    ? "completed"
                                    : ""
                                }`}
                                key={
                                  `${step.title}-${index}`
                                }
                              >

                                <div className="mini-dot">

                                  {step.completed && (
                                    <CheckCircle2
                                      size={15}
                                    />
                                  )}

                                </div>

                                <div className="mini-line-content">

                                  <span>
                                    {
                                      step.title
                                    }
                                  </span>

                                  {step.date && (

                                    <small>
                                      {
                                        step.date
                                      }
                                    </small>

                                  )}

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="order-actions">

                        <span className="total-label">
                          Total Amount
                        </span>

                        <strong className="total-price">

                          ₹
                          {Number(
                            order.total ||
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                        {/* VIEW DETAILS */}

                        <Link
                          to={`/product/${order.productId}`}
                          className="order-action-button view-button"
                        >

                          <Eye size={16} />

                          View Details

                        </Link>

                        {/* ACTIVE ORDER (PROCESSING) */}

                        {order.status ===
                          "Processing" && (

                          <button
                            type="button"
                            className="order-action-button cancel-order-button"
                            onClick={() =>
                              handleCancelOrder(
                                order
                              )
                            }
                          >

                            <X
                              size={16}
                            />

                            Cancel Order

                          </button>

                        )}

                        {/* TRACK ORDER (SHIPPED, OUT FOR DELIVERY, DELIVERED) */}

                        {(order.status ===
                          "Shipped" ||
                          order.status ===
                          "Out for Delivery" ||
                          order.status ===
                          "Delivered") && (

                          <button
                            type="button"
                            className="order-action-button track-order-button"
                            onClick={() =>
                              handleOrderAction(
                                order
                              )
                            }
                          >

                            <Truck
                              size={16}
                            />

                            Track Order

                          </button>

                        )}

                        {/* DELETE ORDER (CANCELLED ONLY) */}

                        {order.status ===
                          "Cancelled" && (

                          <button
                            type="button"
                            className="order-action-button delete-order-button"
                            onClick={() =>
                              handleDeleteOrder(
                                order
                              )
                            }
                          >

                            <Trash2 size={16} />

                            Delete Order

                          </button>

                        )}

                      </div>

                    </article>

                  )
                )

              ) : (

                <div className="orders-empty">

                  <Package size={48} />

                  <h3>
                    No orders found
                  </h3>

                  <p>
                    {user
                      ? "You haven't placed any orders yet."
                      : "Please login to view your orders."}
                  </p>

                  {!user && (

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/login")
                      }
                    >
                      Login
                    </button>

                  )}

                  {user && (

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/shop")
                      }
                    >
                      Start Shopping
                    </button>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Orders;
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout components and the first page (always in the main file, so the site opens fast)
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import RequireLogin from "./Components/RequireLogin";
import Home from "./Pages/Home";

// Cart and wishlist data shared by all pages
import { WishlistProvider } from "./Context/WishlistContext";
import { CartProvider } from "./Context/CartContext";

// Every other page loads only when it is opened. If a new version was published meanwhile,
// the page reloads once to get the new files.
const page = (load) =>
  lazy(() =>
    load()
      .then((module) => {
        sessionStorage.removeItem("page-reloaded");
        return module;
      })
      .catch(() => {
        if (!sessionStorage.getItem("page-reloaded")) {
          sessionStorage.setItem("page-reloaded", "1");
          window.location.reload();
        }
        return new Promise(() => {});
      })
  );

// Shopping pages
const Shop = page(() => import("./Pages/Shop"));
const Categories = page(() => import("./Pages/Categories"));
const ProductDetails = page(() => import("./Pages/ProductDetails"));
const Wishlist = page(() => import("./Pages/Wishlist"));
const Cart = page(() => import("./Pages/Cart"));

// Order pages
const Checkout = page(() => import("./Pages/Checkout"));
const Orders = page(() => import("./Pages/Orders"));
const OrderSuccess = page(() => import("./Pages/OrderSuccess"));
const OrderTracking = page(() => import("./Pages/OrderTracking"));
const CancelOrder = page(() => import("./Pages/CancelOrder"));
const CancelSuccess = page(() => import("./Pages/CancelSuccess"));

// Account pages
const Addresses = page(() => import("./Pages/Addresses"));
const Profile = page(() => import("./Pages/Profile"));
const ChangePassword = page(() => import("./Pages/ChangePassword"));

// Info pages
const About = page(() => import("./Pages/About"));
const Contact = page(() => import("./Pages/Contact"));
const FAQ = page(() => import("./Pages/FAQ"));

// Login and password pages
const Login = page(() => import("./Pages/Login"));
const LoginSuccess = page(() => import("./Pages/LoginSuccess"));
const Register = page(() => import("./Pages/Register"));
const Logout = page(() => import("./Pages/Logout"));
const ForgotPassword = page(() => import("./Pages/ForgotPassword"));
const VerifyOTP = page(() => import("./Pages/VerifyOTP"));
const ResetPassword = page(() => import("./Pages/ResetPassword"));

// Policy pages
const PrivacyPolicy = page(() => import("./Pages/PrivacyPolicy"));
const TermsConditions = page(() => import("./Pages/TermsConditions"));
const ReturnPolicy = page(() => import("./Pages/ReturnPolicy"));

// Admin pages
const AdminRequest = page(() => import("./Pages/AdminRequest"));
const AdminDashboard = page(() => import("./Pages/AdminDashboard"));

// Shopping assistant chat bubble (loads in the background, after the page)
const AssistantChat = page(() => import("./Components/AssistantChat"));

// Shown for a moment while a page is loading
const Loading = () => (
  <div style={{ minHeight: "50vh", display: "grid", placeItems: "center", color: "#087ee8", fontWeight: 600 }}>
    Loading...
  </div>
);

// Short name: opens the page only for a logged-in customer or admin (a visitor is sent to the login page)
const login = (element) => <RequireLogin>{element}</RequireLogin>;

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Navbar />

          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Shopping (open to everybody) */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />

              {/* Orders (login needed) */}
              <Route path="/checkout" element={login(<Checkout />)} />
              <Route path="/orders" element={login(<Orders />)} />
              <Route path="/order-success" element={login(<OrderSuccess />)} />
              <Route path="/order-tracking" element={login(<OrderTracking />)} />
              <Route path="/order-tracking/:orderId" element={login(<OrderTracking />)} />
              <Route path="/cancel-order/:orderId" element={login(<CancelOrder />)} />
              <Route path="/cancel-success/:orderId" element={login(<CancelSuccess />)} />

              {/* Account (login needed) */}
              <Route path="/addresses" element={login(<Addresses />)} />
              <Route path="/profile" element={login(<Profile />)} />
              <Route path="/payment-methods" element={login(<Profile />)} />
              <Route path="/change-password" element={login(<ChangePassword />)} />

              {/* Info */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Login and password */}
              <Route path="/login" element={<Login />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Policies */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />

              {/* Admin (admin login is on /login, the dashboard only opens after admin login) */}
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              <Route path="/admin/request" element={<AdminRequest />} />
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />
            </Routes>
          </Suspense>

          <Footer />

          {/* Chat bubble (stays on screen while the customer moves between pages) */}
          <Suspense fallback={null}>
            <AssistantChat />
          </Suspense>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
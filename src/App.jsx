import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";

// Shopping pages
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Categories from "./Pages/Categories";
import ProductDetails from "./Pages/ProductDetails";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";

// Order pages
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderTracking from "./Pages/OrderTracking";
import CancelOrder from "./Pages/CancelOrder";
import CancelSuccess from "./Pages/CancelSuccess";

// Account pages
import Addresses from "./Pages/Addresses";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";

// Info pages
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import FAQ from "./Pages/FAQ";

// Login and password pages
import Login from "./Pages/Login";
import LoginSuccess from "./Pages/LoginSuccess";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";

// Policy pages
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsConditions from "./Pages/TermsConditions";
import ReturnPolicy from "./Pages/ReturnPolicy";

// Admin pages
import AdminRequest from "./Pages/AdminRequest";
import AdminDashboard from "./Pages/AdminDashboard";

// Cart and wishlist data shared by all pages
import { WishlistProvider } from "./Context/WishlistContext";
import { CartProvider } from "./Context/CartContext";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* Shopping */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />

            {/* Orders */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/cancel-order/:orderId" element={<CancelOrder />} />
            <Route path="/cancel-success/:orderId" element={<CancelSuccess />} />

            {/* Account */}
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-methods" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />

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

          <Footer />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
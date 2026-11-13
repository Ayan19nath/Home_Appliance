import { useEffect, useRef, useState } from "react";
import {
  Search, Heart, ShoppingCart, UserCircle, Menu,
  Package, MapPin, CreditCard, Lock, LogOut, LogIn, UserPlus,
} from "lucide-react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import ThemeToggle from "./ThemeToggle";

// Main navigation links: [path, label]
const links = [["/", "Home"], ["/shop", "Shop"], ["/categories", "Categories"], ["/about", "About"], ["/contact", "Contact"]];

// Dropdown items for a logged-in customer: [path, icon, label]
const userItems = [
  ["/orders", Package, "My Orders"],
  ["/wishlist", Heart, "Wishlist"],
  ["/addresses", MapPin, "Addresses"],
  ["/payment-methods", CreditCard, "Payment Methods"],
  ["/change-password", Lock, "Change Password"],
];

// Dropdown items for a visitor who is not logged in
const guestItems = [["/login", LogIn, "Login"], ["/register", UserPlus, "Register"]];

// Get the logged-in customer (session login first, then "remember me")
const getUser = () => {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const user = JSON.parse(store.getItem("homehub-user"));
      if (user?.loggedIn === true) return user;
    } catch {
      // ignore invalid saved data
    }
  }
  return null;
};

function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { cartItemCount } = useCart();

  // Re-checks the admin login after every page change
  useLocation();

  // Admin button is shown only after a successful admin login
  const isAdmin = !!localStorage.getItem("adminToken") && localStorage.getItem("adminRole") === "admin";

  // Load the customer and update when login/logout happens (same tab or other tab)
  useEffect(() => {
    const update = () => setCurrentUser(getUser());
    update();
    window.addEventListener("homehub-auth-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("homehub-auth-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Search: go to the shop page with the search text
  const handleSearch = () => {
    const query = searchText.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  // Close the dropdown and open a page
  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // Class for the icon buttons (adds "active-action" on the current page)
  const actionClass = (name) => ({ isActive }) => `${name} ${isActive ? "active-action" : ""}`;

  // Build the dropdown buttons from a list
  const menuItems = (items) =>
    items.map(([path, Icon, label]) => (
      <button key={path} type="button" className="profile-dropdown-item" onClick={() => go(path)}>
        <Icon size={20} />
        <span>{label}</span>
      </button>
    ));

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <svg className="homehub-logo" viewBox="0 0 260 70" xmlns="http://www.w3.org/2000/svg">
            {/* house outline */}
            <g fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 30 L38 7 L68 30" />
              <path d="M16 25 V57 H60 V25" />
              <path d="M51 18 V7 H60 V25" />
            </g>
            {/* window squares */}
            <g fill="white">
              <rect x="29" y="31" width="9" height="9" rx="2" />
              <rect x="41" y="31" width="9" height="9" rx="2" />
              <rect x="29" y="43" width="9" height="9" rx="2" />
              <rect x="41" y="43" width="9" height="9" rx="2" />
            </g>
            {/* orange curve */}
            <path d="M5 49 C25 68, 65 69, 78 45" fill="none" stroke="#ff9d00" strokeWidth="7" strokeLinecap="round" />
            {/* logo text */}
            <text x="82" y="43" fill="white" fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Home</text>
            <text x="178" y="43" fill="#ff9d00" fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Hub</text>
            <text x="115" y="59" fill="white" fontSize="7" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">YOUR HOME, OUR APPLIANCES</text>
          </svg>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="nav-links">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* SEARCH BOX */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search size={21} onClick={handleSearch} style={{ cursor: "pointer" }} />
        </div>

        {/* ACTION ICONS */}
        <div className="nav-actions">

          {/* ADMIN BUTTON (only visible to a logged-in admin) */}
          {isAdmin && (
            <Link to="/admin/dashboard" className="nav-admin">Admin</Link>
          )}

          {/* WISHLIST */}
          <NavLink to="/wishlist" className={actionClass("Wishlist-button")} title="Wishlist">
            {({ isActive }) => <Heart size={25} fill={isActive ? "currentColor" : "none"} />}
          </NavLink>

          {/* CART (with item count badge) */}
          <NavLink to="/cart" className={actionClass("cart-button")} title="Cart">
            <ShoppingCart size={26} />
            {cartItemCount > 0 && <span>{cartItemCount}</span>}
          </NavLink>

          {/* PROFILE */}
          <NavLink to="/profile" className={actionClass("profile-button")} title="Profile">
            <UserCircle size={35} />
          </NavLink>

          {/* COLOUR MODE: light, dark or default */}
          <ThemeToggle />

          {/* 3-LINE MENU */}
          <div className="profile-menu-wrapper" ref={menuRef}>
            <button
              type="button"
              className={`navbar-menu-button ${menuOpen ? "menu-open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              title="More"
            >
              <Menu size={29} />
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="profile-dropdown">
                {currentUser ? (
                  <>
                    {/* logged-in menu */}
                    {menuItems(userItems)}
                    <button type="button" className="profile-dropdown-item logout-dropdown-item" onClick={() => go("/logout")}>
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // logged-out menu
                  menuItems(guestItems)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
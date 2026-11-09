import { useEffect, useState } from "react";
import { Grid2X2, Truck, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
import { categoryIcons, defaultIcon } from "../data/categoryIcons";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the categories from the database
  useEffect(() => {
    api.get("/category")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Could not load categories. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Link to the shop page filtered by this category
  const shopLink = (name) => `/shop?category=${encodeURIComponent(name)}`;

  return (
    <main className="categories-page">
      <div className="categories-wrapper">

        {/* ========== LEFT SIDEBAR ========== */}
        <aside className="categories-sidebar">

          {/* Logo */}
          <div className="categories-sidebar-logo">
            <Link to="/" className="logo">
              <svg className="homehub-logo" viewBox="0 0 260 70" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 30 L38 7 L68 30" />
                  <path d="M16 25 V57 H60 V25" />
                  <path d="M51 18 V7 H60 V25" />
                </g>
                <g fill="black">
                  <rect x="29" y="31" width="9" height="9" rx="2" />
                  <rect x="41" y="31" width="9" height="9" rx="2" />
                  <rect x="29" y="43" width="9" height="9" rx="2" />
                  <rect x="41" y="43" width="9" height="9" rx="2" />
                </g>
                <path d="M5 49 C25 68, 65 69, 78 45" fill="none" stroke="#ff9d00" strokeWidth="7" strokeLinecap="round" />
                <text x="82" y="43" fill="black" fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Home</text>
                <text x="178" y="43" fill="#ff9d00" fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Hub</text>
                <text x="115" y="59" fill="black" fontSize="7" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">YOUR HOME, OUR APPLIANCES</text>
              </svg>
            </Link>
          </div>

          <nav className="categories-sidebar-menu">

            {/* All Categories (this page) */}
            <Link to="/categories" className="categories-sidebar-item active">
              <span className="categories-sidebar-icon"><Grid2X2 size={21} /></span>
              <span className="categories-sidebar-name">All Categories</span>
              <ChevronRight size={18} />
            </Link>

            {/* One link per category from the database */}
            {categories.map((c) => {
              const Icon = categoryIcons[c.cat_icon] || defaultIcon;
              return (
                <Link key={c._id} to={shopLink(c.cat_name)} className="categories-sidebar-item">
                  <span className="categories-sidebar-icon"><Icon size={21} /></span>
                  <span className="categories-sidebar-name">{c.cat_name}</span>
                  <ChevronRight size={18} />
                </Link>
              );
            })}
          </nav>

          {/* Free shipping box */}
          <div className="categories-shipping-box">
            <div className="categories-shipping-icon"><Truck size={28} /></div>
            <div>
              <strong>Free Shipping</strong>
              <span>On all orders over ₹499</span>
            </div>
          </div>
        </aside>

        {/* ========== RIGHT CONTENT ========== */}
        <section className="categories-content">

          {/* Hero banner */}
          <section className="categories-hero">
            <div className="categories-hero-overlay">
              <div className="categories-hero-content">
                <span className="categories-hero-small">SHOP BY CATEGORY</span>
                <h1>
                  Explore Our Wide Range of
                  <strong>Home Appliances</strong>
                </h1>
                <p>
                  Top brands <span>|</span> Best prices <span>|</span> Trusted quality
                </p>
                <Link to="/shop" className="categories-hero-btn">
                  Shop Now
                  <ArrowRight size={19} />
                </Link>
              </div>
            </div>
          </section>

          {/* Section title */}
          <div className="categories-section-header">
            <h2>Shop by Category</h2>
            <Link to="/categories" className="categories-view-all">
              View All Categories
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Category cards from the database */}
          <div className="categories-grid">
            {loading && <p>Loading categories...</p>}
            {error && <p>{error}</p>}

            {categories.map((c) => (
              <article className="category-card" key={c._id}>
                <Link to={shopLink(c.cat_name)} className="category-card-image">
                  <img src={c.cat_image} alt={c.cat_name} />
                </Link>
                <div className="category-card-content">
                  <Link to={shopLink(c.cat_name)} className="category-card-title">{c.cat_name}</Link>
                  <p>{c.cat_description}</p>
                  <Link to={shopLink(c.cat_name)} className="category-shop-link">
                    Shop Now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}

            {/* Best deals card (fixed promo, not a category) */}
            <article className="category-deals-card">
              <div className="category-deals-image">
                <img
                  src="https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=900&q=80"
                  alt="Best Deals"
                />
              </div>
              <div className="category-deals-content">
                <span className="category-deals-label">✦ Best Deals</span>
                <h3>Top Brands</h3>
                <p>Get the best deals from leading brands.</p>
                <Link to="/shop" className="category-deals-link">
                  Shop Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Categories;
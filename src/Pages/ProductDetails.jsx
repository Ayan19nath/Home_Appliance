import { useEffect, useState } from "react";
import {
  Heart, ShoppingCart, Star, Minus, Plus, Truck, ShieldCheck, RotateCcw,
  Headphones, Zap, ChevronLeft, ChevronRight, CheckCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import "./ProductDetails.css";

// Sample reviews (customer reviews are not stored in the database yet)
const reviews = [
  { name: "Rohit S.", rating: 5, date: "13 Jun, 2025", comment: "Great product! Works perfectly and the quality is excellent." },
  { name: "Priya M.", rating: 5, date: "08 May, 2025", comment: "Very good quality product. The design and performance are excellent." },
  { name: "Amit K.", rating: 4, date: "21 Apr, 2025", comment: "Good product with excellent performance. Value for money." },
];

// Right side service box: [link, icon, title, text]
const services = [
  ["/terms-conditions", Truck, "Free Shipping", "On all orders"],
  ["/return-policy", RotateCcw, "Easy Returns", "Within 7 days"],
  ["/terms-conditions", ShieldCheck, "Secure Payments", "100% Secure"],
  ["/contact", Headphones, "24/7 Support", "We're here to help"],
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addProductToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, ready or missing
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Load this product from the database
  useEffect(() => {
    setStatus("loading");
    setSelectedImage(0);
    setQuantity(1);
    api.get(`/item/${id}`)
      .then((res) => {
        setProduct(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  // Loading or product not found
  if (status !== "ready") {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h2>{status === "loading" ? "Loading..." : "Product Not Found"}</h2>
          {status === "missing" && (
            <>
              <p>Sorry, this product could not be found.</p>
              <button type="button" onClick={() => navigate("/shop")}>Continue Shopping</button>
            </>
          )}
        </div>
      </main>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const inStock = Number(product.stock) > 0;
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  // Gallery: go to an image (loops around)
  const goTo = (index) => setSelectedImage((index + images.length) % images.length);

  // Add to cart and show a message for 2.5 seconds
  const handleAddToCart = () => {
    addProductToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // Buy now: add to cart and open the cart
  const handleBuyNow = () => {
    addProductToCart(product, quantity);
    navigate("/cart");
  };

  // Specifications tab
  const specifications = [
    ["Brand", product.brand],
    ["Category", product.category],
    ["Rating", `${product.rating} / 5`],
    ["Reviews", product.reviews],
    ["Price", money(product.price)],
    ["Stock", inStock ? `${product.stock} available` : "Out of stock"],
    ["Warranty", "1 Year Manufacturer Warranty"],
    ["Delivery", "Free Delivery"],
    ["Return", "7 Days Easy Return"],
  ];

  return (
    <main className="product-details-page">

      {/* BREADCRUMB */}
      <div className="product-breadcrumb">
        <button type="button" onClick={() => navigate("/")}>Home</button>
        <span>›</span>
        <button type="button" onClick={() => navigate("/shop")}>Shop</button>
        <span>›</span>
        <button type="button" onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>›</span>
        <strong>{product.name}</strong>
      </div>

      {/* MAIN PRODUCT AREA */}
      <section className="product-main-area">

        {/* LEFT: GALLERY */}
        <div className="product-gallery">

          {/* Thumbnails */}
          <div className="product-thumbnails">
            {images.map((image, index) => (
              <button
                type="button"
                key={index}
                className={selectedImage === index ? "thumbnail active" : "thumbnail"}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="product-main-image">
            {product.discount > 0 && <span className="product-discount">-{product.discount}%</span>}

            {images.length > 1 && (
              <button type="button" className="gallery-arrow gallery-left" onClick={() => goTo(selectedImage - 1)}>
                <ChevronLeft size={22} />
              </button>
            )}

            <img src={images[selectedImage]} alt={product.name} />

            {images.length > 1 && (
              <button type="button" className="gallery-arrow gallery-right" onClick={() => goTo(selectedImage + 1)}>
                <ChevronRight size={22} />
              </button>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="gallery-dots">
                {images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={selectedImage === index ? "dot active" : "dot"}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER: PRODUCT INFO */}
        <div className="product-main-info">
          <h1>{product.name}</h1>

          {/* Rating */}
          <div className="product-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={19} fill={star <= Math.round(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span>{product.rating}</span>
            <span>({product.reviews} Reviews)</span>
          </div>

          {/* Price */}
          <div className="product-price">
            <strong>{money(product.price)}</strong>
            {product.oldPrice > product.price && <del>{money(product.oldPrice)}</del>}
            {product.discount > 0 && <span className="price-discount">{product.discount}% OFF</span>}
          </div>

          {/* Features (up to 4, from the database) */}
          <div className="product-features">
            {(product.features || []).slice(0, 4).map((feature, index) => (
              <div className="feature-item" key={index}>
                <span className="feature-icon">✔</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Brand and stock */}
          <div className="product-stock">
            <span>Brand: <strong>{product.brand}</strong></span>
            <span className="stock-divider">|</span>
            <span className="in-stock" style={inStock ? undefined : { color: "#d23939" }}>
              ● {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Quantity */}
          <div className="quantity-area">
            <strong>Quantity:</strong>
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus size={18} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Add to cart and buy now */}
          <div className="main-action-buttons">
            <button type="button" className="add-cart-button" onClick={handleAddToCart} disabled={!inStock}>
              {addedToCart ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
              {!inStock ? "Out of Stock" : addedToCart ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            <button type="button" className="buy-now-button" onClick={handleBuyNow} disabled={!inStock}>
              <Zap size={20} />
              Buy Now
            </button>
          </div>

          {/* Success message */}
          {addedToCart && (
            <div className="cart-success-message" role="status" aria-live="polite">
              <CheckCircle size={17} />
              <span>Product added to cart successfully</span>
            </div>
          )}

          {/* Wishlist */}
          <button type="button" className="details-wishlist-button" onClick={() => toggleWishlist(product)}>
            <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {/* RIGHT: SERVICE BOX */}
        <aside className="product-service-box">
          {services.map(([to, Icon, title, text]) => (
            <Link to={to} className="service-item" key={title}>
              <Icon size={32} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </Link>
          ))}
        </aside>
      </section>

      {/* LOWER CONTENT */}
      <section className="product-bottom-area">

        {/* Tabs */}
        <div className="product-tabs-box">
          <div className="product-tabs">
            <button type="button" className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
              Product Information
            </button>
            <button type="button" className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
              Reviews ({product.reviews})
            </button>
            <button type="button" className={activeTab === "specifications" ? "active" : ""} onClick={() => setActiveTab("specifications")}>
              Specifications
            </button>
          </div>

          {/* Product information */}
          {activeTab === "info" && (
            <div className="tab-content">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <>
                  <p>{product.name} with modern design, advanced technology and excellent performance. Perfect choice for your modern home.</p>
                  <p>Enjoy reliable quality, efficient performance and convenient features designed for everyday home use.</p>
                </>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="tab-content">
              <h2>Reviews ({product.reviews})</h2>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div className="review-card" key={review.name}>
                    <div className="review-top">
                      <div className="review-avatar">{review.name.charAt(0)}</div>
                      <div>
                        <strong>{review.name}</strong>
                        <div className="review-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={15} fill={star <= review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p>{review.comment}</p>
                    <span className="verified">
                      <CheckCircle size={14} />
                      Verified Purchase
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === "specifications" && (
            <div className="tab-content">
              <h2>Product Specifications</h2>
              <div className="specifications">
                {specifications.map(([label, value]) => (
                  <div className="specification-row" key={label}>
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wishlist banner */}
        <div className="wishlist-banner">
          <div className="wishlist-banner-icon">♥</div>
          <div>
            <h2>Save your favorite items<br />for later!</h2>
            <p>Keep shopping and add more items to your wishlist.</p>
          </div>
          <button type="button" onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
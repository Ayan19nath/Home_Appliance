import { Heart, ShoppingCart, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import QuantityControl from "./QuantityControl";
import { useWishlist } from "../Context/WishlistContext.jsx";
import { useCart } from "../Context/CartContext.jsx";
import { stockInfo } from "../data/stock";

function ShopProductCard({ product }) {
  const navigate = useNavigate();
  const [note, setNote] = useState(null); // { text, ok } shown for 2.5 seconds after "Add to Cart"
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlisted = isWishlisted(product.id);
  const inStock = Number(product.stock) > 0;
  const [stockText, stockColor] = stockInfo(product.stock);

  // Open the product page
  const openProduct = () => navigate(`/product/${product.id}`);

  // Add or remove from the wishlist
  const handleWishlist = (event) => {
    event.stopPropagation();
    toggleWishlist(product);
  };

  // Add to cart (a message appears if the stock limit stopped it)
  const handleAddToCart = (event) => {
    event.stopPropagation();
    const problem = addToCart(product);
    setNote({ text: problem || "Product added to cart successfully", ok: !problem });
    setTimeout(() => setNote(null), 2500);
  };

  return (
    <div className="shop-product-card">

      {/* WISHLIST */}
      <button
        type="button"
        className="shop-wishlist"
        title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        onClick={handleWishlist}
      >
        <Heart size={21} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      {/* IMAGE */}
      <div className="shop-product-image" onClick={openProduct} style={{ cursor: "pointer" }}>
        <img src={product.image} alt={product.name} />
      </div>

      {/* INFO */}
      <div className="shop-product-info">
        <h3 onClick={openProduct} style={{ cursor: "pointer" }}>{product.name}</h3>

        {/* Price */}
        <div className="shop-price">
          <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
          {product.oldPrice > product.price && (
            <del>₹{Number(product.oldPrice).toLocaleString("en-IN")}</del>
          )}
          {product.discount > 0 && <span>{product.discount}% OFF</span>}
        </div>

        {/* Rating */}
        <div className="shop-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={star <= Math.round(product.rating || 0) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span>{product.rating || 0} ({product.reviews || 0})</span>
        </div>

        {/* Features */}
        <ul className="product-features">
          {(product.features || []).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {/* Brand and stock */}
        <div className="product-bottom">
          <span>Brand: {product.brand || "HomeHub"}</span>
          <span className="stock" style={{ color: stockColor }}>● {stockText}</span>
        </div>

        <QuantityControl />

        {/* Add to cart */}
        <button
          type="button"
          className="shop-add-cart"
          onClick={handleAddToCart}
          disabled={!inStock}
          style={inStock ? undefined : { opacity: 0.6, cursor: "not-allowed" }}
        >
          {note?.ok ? (
            <>
              <CheckCircle size={17} />
              Added to Cart ✓
            </>
          ) : (
            <>
              <ShoppingCart size={17} />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </button>

        {/* Message after adding */}
        {note && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              fontSize: "14px",
              fontWeight: "600",
              color: note.ok ? undefined : "#e67e00",
            }}
          >
            {note.ok && <CheckCircle size={16} />}
            <span>{note.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopProductCard;
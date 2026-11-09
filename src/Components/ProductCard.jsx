import { useState } from "react";
import { Heart, ShoppingCart, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const inStock = Number(product.stock) > 0;

  // Open the product page
  const openProduct = () => navigate(`/product/${product.id}`);

  // Add or remove from the wishlist
  const handleWishlist = (event) => {
    event.stopPropagation();
    toggleWishlist(product);
  };

  // Add to cart and show a message for 2.5 seconds
  const handleCart = (event) => {
    event.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="product-card" onClick={openProduct} style={{ cursor: "pointer" }}>

      {product.discount > 0 && <span className="discount">-{product.discount}%</span>}

      {/* Wishlist */}
      <button
        type="button"
        className="wishlist-btn"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        onClick={handleWishlist}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        {/* Rating */}
        <div className="rating">
          <Star size={13} fill="currentColor" />
          <span>{product.rating}</span>
          <small>({product.reviews})</small>
        </div>

        {/* Price */}
        <div className="price">
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          {product.oldPrice > product.price && (
            <del>₹{Number(product.oldPrice).toLocaleString("en-IN")}</del>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          className="add-cart"
          onClick={handleCart}
          disabled={!inStock}
          style={inStock ? undefined : { opacity: 0.6, cursor: "not-allowed" }}
        >
          {addedToCart ? (
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

        {/* Success message */}
        {addedToCart && (
          <div className="cart-success-message" role="status" aria-live="polite">
            <CheckCircle size={15} />
            <span>Product added to cart successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
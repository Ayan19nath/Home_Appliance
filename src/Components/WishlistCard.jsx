import { useState } from "react";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";

function WishlistCard({ product }) {
  const navigate = useNavigate();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();

  const [addedToCart, setAddedToCart] = useState(false);

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const handleRemove = () => {
    toggleWishlist(product);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    // Add product through CartContext
    addToCart(product);

    // Show success message on same screen
    setAddedToCart(true);

    // Hide message after 2.5 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  return (
    <article className="wishlist-card">

      {/* Wishlist Heart */}

      <button
        type="button"
        className="wishlist-card-heart"
        onClick={handleRemove}
        title="Remove from Wishlist"
      >
        <Heart
          size={20}
          fill={
            isWishlisted(product.id)
              ? "currentColor"
              : "none"
          }
        />
      </button>


      {/* Product Image */}

      <div
        className="wishlist-card-image"
        onClick={handleViewProduct}
      >
        <img
          src={product.image}
          alt={product.name}
        />

        {/* Eye */}

        <button
          type="button"
          className="wishlist-view"
          onClick={(event) => {
            event.stopPropagation();
            handleViewProduct();
          }}
          title="View Product"
        >
          <Eye size={19} />
        </button>
      </div>


      {/* Product Info */}

      <div className="wishlist-card-info">

        <h3
          onClick={handleViewProduct}
          className="wishlist-product-name"
        >
          {product.name}
        </h3>


        {/* Rating */}

        <div className="wishlist-rating">

          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>★</span>
            ))}
          </div>

          <span>
            {product.rating} ({product.reviews})
          </span>

        </div>


        {/* Price */}

        <div className="wishlist-price">

          <strong>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </strong>

          <del>
            ₹{Number(product.oldPrice).toLocaleString("en-IN")}
          </del>

          <span>
            {product.discount}% OFF
          </span>

        </div>


        {/* Stock */}

        <div className="wishlist-stock">
          <span>●</span>
          In Stock
        </div>


        {/* Add To Cart Success Message */}

        {addedToCart && (
          <div
            className="wishlist-cart-success"
            role="status"
            aria-live="polite"
          >
            <CheckCircle size={16} />
            <span>
              Product added to cart successfully
            </span>
          </div>
        )}


        {/* Buttons */}

        <div className="wishlist-card-actions">

          <button
            type="button"
            className={`wishlist-cart-btn ${
              addedToCart ? "added" : ""
            }`}
            onClick={handleAddToCart}
          >

            {addedToCart ? (
              <>
                <CheckCircle size={17} />
                Added to Cart ✓
              </>
            ) : (
              <>
                <ShoppingCart size={17} />
                Add to Cart
              </>
            )}

          </button>


          <button
            type="button"
            className="wishlist-remove-btn"
            onClick={handleRemove}
          >
            <Trash2 size={17} />
            Remove
          </button>

        </div>

      </div>

    </article>
  );
}

export default WishlistCard;
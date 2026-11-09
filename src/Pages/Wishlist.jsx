import React, { useEffect, useState } from "react";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Tag,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";

import "./Wishlist.css";


function Wishlist() {

  const navigate = useNavigate();

  const {
    wishlist,
    toggleWishlist,
    clearWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();


  // =========================
  // SELECTED PRODUCTS
  // =========================

  const [selectedItems, setSelectedItems] = useState([]);


  // =========================
  // CART SUCCESS
  // =========================

  const [cartSuccess, setCartSuccess] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);
  const [allAdded, setAllAdded] = useState(false);


  // =========================
  // CLEAR SUCCESS MESSAGE
  // =========================

  useEffect(() => {

    if (!cartSuccess) {
      return;
    }

    const timer = setTimeout(() => {

      setCartSuccess("");
      setAddedProductId(null);
      setAllAdded(false);

    }, 2500);

    return () => clearTimeout(timer);

  }, [cartSuccess]);


  // =========================
  // SELECT PRODUCT
  // =========================

  const handleSelectProduct = (productId) => {

    setSelectedItems((current) => {

      if (current.includes(productId)) {

        return current.filter(
          (id) => id !== productId
        );

      }

      return [
        ...current,
        productId,
      ];

    });

  };


  // =========================
  // SELECT ALL
  // =========================

  const handleSelectAll = () => {

    if (
      selectedItems.length === wishlist.length &&
      wishlist.length > 0
    ) {

      setSelectedItems([]);

    } else {

      setSelectedItems(
        wishlist.map((product) => product.id)
      );

    }

  };


  // =========================
  // REMOVE PRODUCT
  // =========================

  const handleRemove = (product) => {

    toggleWishlist(product);

    setSelectedItems((current) =>
      current.filter(
        (id) => id !== product.id
      )
    );

  };


  // =========================
  // ADD PRODUCT TO CART
  // =========================

  const addProductToCart = (product) => {

    try {

      addToCart(product);

      setAddedProductId(product.id);
      setAllAdded(false);

      setCartSuccess(
        "Product added to cart successfully"
      );

    } catch (error) {

      console.error(
        "Cart Error:",
        error
      );

      setCartSuccess(
        "Unable to add product to cart"
      );

    }

  };


  // =========================
  // ADD ALL TO CART
  // =========================

  const handleAddAllToCart = () => {

    if (wishlist.length === 0) {
      return;
    }

    try {

      wishlist.forEach((product) => {
        addToCart(product);
      });

      setAddedProductId(null);
      setAllAdded(true);

      setCartSuccess(
        "All wishlist products added to cart successfully"
      );

    } catch (error) {

      console.error(
        "Add All Cart Error:",
        error
      );

      setCartSuccess(
        "Unable to add all products to cart"
      );

    }

  };


  // =========================
  // REMOVE SELECTED
  // =========================

  const handleRemoveSelected = () => {

    if (selectedItems.length === 0) {
      return;
    }

    selectedItems.forEach((productId) => {

      const product = wishlist.find(
        (item) => item.id === productId
      );

      if (product) {

        toggleWishlist(product);

      }

    });

    setSelectedItems([]);

  };


  // =========================
  // CLEAR WISHLIST
  // =========================

  const handleClearWishlist = () => {

    clearWishlist();

    setSelectedItems([]);

  };


  // =========================
  // OPEN PRODUCT DETAILS
  // =========================

  const handleProductClick = (product) => {

    navigate(
      `/product/${product.id}`
    );

  };


  const allSelected =
    wishlist.length > 0 &&
    selectedItems.length === wishlist.length;


  return (

    <main className="wishlist-page">


      {/* =========================
          BREADCRUMB
      ========================== */}

      <div className="wishlist-breadcrumb">

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <span>›</span>

        <span>Wishlist</span>

      </div>


      {/* =========================
          PAGE TITLE
      ========================== */}

      <div className="wishlist-page-title">

        <h1>
          My Wishlist
        </h1>

      </div>


      {/* =========================
          CART SUCCESS MESSAGE
      ========================== */}

      {cartSuccess && (

        <div
          className={`wishlist-cart-success ${
            cartSuccess.includes("Unable")
              ? "error"
              : ""
          }`}
          role="status"
          aria-live="polite"
        >

          {cartSuccess.includes("Unable") ? (

            <ShoppingCart size={18} />

          ) : (

            <CheckCircle size={18} />

          )}

          <span>
            {cartSuccess}
          </span>

        </div>

      )}


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <section className="wishlist-layout">


        {/* =========================
            LEFT PRODUCTS
        ========================== */}

        <div className="wishlist-products">


          {wishlist.length > 0 ? (

            <>

              {wishlist.map((product) => {

                const isSelected =
                  selectedItems.includes(
                    product.id
                  );

                const isThisProductAdded =
                  addedProductId === product.id;


                return (

                  <article
                    className="wishlist-product-card"
                    key={product.id}
                  >


                    {/* HEART */}

                    <button
                      type="button"
                      className="wishlist-product-heart"
                      title="Remove from Wishlist"
                      onClick={() =>
                        handleRemove(product)
                      }
                    >

                      <Heart
                        size={20}
                        fill="currentColor"
                      />

                    </button>


                    {/* PRODUCT IMAGE */}

                    <div
                      className="wishlist-product-image"
                      onClick={() =>
                        handleProductClick(product)
                      }
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                    </div>


                    {/* PRODUCT INFO */}

                    <div
                      className="wishlist-product-info"
                      onClick={() =>
                        handleProductClick(product)
                      }
                    >

                      <h3>
                        {product.name}
                      </h3>


                      {/* RATING */}

                      <div className="wishlist-rating">

                        <div className="wishlist-stars">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <Star
                                key={star}
                                size={16}
                                fill={
                                  star <=
                                  Math.round(
                                    product.rating
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                            )
                          )}

                        </div>


                        <span>
                          {product.rating}
                        </span>

                        <span>
                          ({product.reviews} Reviews)
                        </span>

                      </div>


                      {/* PRICE */}

                      <div className="wishlist-price">

                        <strong>
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <del>
                          ₹
                          {Number(
                            product.oldPrice
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </del>

                        {product.discount && (

                          <span>
                            {product.discount}% OFF
                          </span>

                        )}

                      </div>


                      {/* STOCK */}

                      <div className="wishlist-stock">

                        <span>
                          ●
                        </span>

                        In Stock

                      </div>

                    </div>


                    {/* CARD ACTIONS */}

                    <div className="wishlist-product-actions">


                      {/* CHECKBOX */}

                      <label className="wishlist-checkbox">

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleSelectProduct(
                              product.id
                            )
                          }
                        />

                        <span></span>

                      </label>


                      {/* ADD CART */}

                      <button
                        type="button"
                        className={`wishlist-add-cart ${
                          isThisProductAdded
                            ? "added"
                            : ""
                        }`}
                        onClick={(event) => {

                          event.stopPropagation();

                          addProductToCart(product);

                        }}
                      >

                        {isThisProductAdded ? (

                          <>
                            <CheckCircle size={18} />
                            Added to Cart ✓
                          </>

                        ) : (

                          <>
                            <ShoppingCart size={18} />
                            Add to Cart
                          </>

                        )}

                      </button>


                      {/* REMOVE */}

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() =>
                          handleRemove(product)
                        }
                      >

                        <Trash2 size={18} />

                        Remove

                      </button>

                    </div>

                  </article>

                );

              })}


              {/* =========================
                  BOTTOM ACTION BAR
              ========================== */}

              <div className="wishlist-bottom-actions">


                <div className="wishlist-selection-actions">

                  <label className="select-all">

                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />

                    <span></span>

                    Select All

                  </label>


                  <button
                    type="button"
                    className="remove-selected"
                    disabled={
                      selectedItems.length === 0
                    }
                    onClick={
                      handleRemoveSelected
                    }
                  >

                    <Trash2 size={18} />

                    Remove Selected

                  </button>

                </div>


                {/* ADD ALL */}

                <button
                  type="button"
                  className={`add-all-cart ${
                    allAdded
                      ? "added"
                      : ""
                  }`}
                  onClick={
                    handleAddAllToCart
                  }
                >

                  {allAdded ? (

                    <>
                      <CheckCircle size={18} />
                      Added All to Cart ✓
                    </>

                  ) : (

                    <>
                      <ShoppingCart size={18} />
                      Add All to Cart
                    </>

                  )}

                </button>

              </div>

            </>

          ) : (

            /* =========================
               EMPTY WISHLIST
            ========================== */

            <div className="wishlist-empty">

              <Heart size={70} />

              <h2>
                Your Wishlist is Empty
              </h2>

              <p>
                Save your favorite products here
                and shop them whenever you're ready.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/shop")
                }
              >
                Continue Shopping
                <ArrowRight size={17} />
              </button>

            </div>

          )}

        </div>


        {/* =========================
            RIGHT SIDEBAR
        ========================== */}

        <aside className="wishlist-sidebar">


          {/* MY WISHLIST SUMMARY */}

          <div className="wishlist-summary-card">

            <h2>
              My Wishlist
            </h2>


            <div className="wishlist-summary-item">

              <Tag size={39} />

              <div>

                <strong>
                  {wishlist.length} Items
                </strong>

                <span>
                  In your wishlist
                </span>

              </div>

            </div>


            <div className="wishlist-summary-item">

              <Star size={39} />

              <div>

                <strong>
                  Best Deals
                </strong>

                <span>
                  Save for later
                </span>

              </div>

            </div>


            <div className="wishlist-summary-item">

              <Heart size={39} />

              <div>

                <strong>
                  More Savings
                </strong>

                <span>
                  Get notified on price drops
                </span>

              </div>

            </div>

          </div>


          {/* WISHLIST BANNER */}

          <div className="wishlist-save-banner">

            <div className="wishlist-save-content">

              <h2>
                Save your favorite
                <br />
                items for later!
              </h2>

              <p>
                Keep shopping and add more
                items to your wishlist.
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/shop")
                }
              >

                Continue Shopping

                <ArrowRight size={17} />

              </button>

            </div>


            <div className="wishlist-save-icon">

              <Heart
                size={65}
                fill="currentColor"
              />

              <Sparkles
                size={24}
              />

            </div>

          </div>

        </aside>

      </section>

    </main>

  );

}


export default Wishlist;
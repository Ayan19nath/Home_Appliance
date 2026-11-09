import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("homehub-cart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error("Cart Load Error:", error);
      return [];
    }
  });

  /* =========================
     SAVE CART
  ========================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "homehub-cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Cart Save Error:", error);
    }
  }, [cart]);


  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product) => {
    if (!product || product.id === undefined) {
      return;
    }

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      /* Same product exists */
      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) + 1,
              }
            : item
        );
      }

      /* New product */
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };


  /* =========================
     ADD PRODUCT WITH QUANTITY
  ========================= */

  const addProductToCart = (
    product,
    quantity = 1
  ) => {
    if (!product || product.id === undefined) {
      return;
    }

    const qty = Math.max(
      1,
      Number(quantity) || 1
    );

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) +
                  qty,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: qty,
        },
      ];
    });
  };


  /* =========================
     INCREASE QUANTITY
  ========================= */

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1,
            }
          : item
      )
    );
  };


  /* =========================
     DECREASE QUANTITY
  ========================= */

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) - 1,
              }
            : item
        )
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  };


  /* =========================
     REMOVE PRODUCT
  ========================= */

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };


  /* =========================
     CLEAR CART
  ========================= */

  const clearCart = () => {
    setCart([]);
  };


  /* =========================
     TOTAL ITEM QUANTITY
  ========================= */

  const cartItemCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );


  /* =========================
     SUBTOTAL
  ========================= */

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );


  /* =========================
     DISCOUNT
  ========================= */

  const cartDiscount = cart.reduce(
    (total, item) => {
      const oldPrice =
        Number(item.oldPrice || 0);

      const price =
        Number(item.price || 0);

      const quantity =
        Number(item.quantity || 1);

      if (oldPrice > price) {
        return (
          total +
          (oldPrice - price) * quantity
        );
      }

      return total;
    },
    0
  );


  /* =========================
     FINAL TOTAL
  ========================= */

  const cartTotal =
    cartSubtotal;


  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,
        addProductToCart,

        increaseQuantity,
        decreaseQuantity,

        removeFromCart,
        clearCart,

        cartItemCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};


export default CartContext;
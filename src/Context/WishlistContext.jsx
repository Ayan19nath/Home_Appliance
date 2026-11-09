import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "homehub-wishlist"
      );

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });


  // Save wishlist in localStorage
  useEffect(() => {
    localStorage.setItem(
      "homehub-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);


  // Check product
  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => item.id === productId
    );
  };


  // Add / Remove wishlist
  const toggleWishlist = (product) => {

    setWishlist((currentWishlist) => {

      const alreadyExists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {

        return currentWishlist.filter(
          (item) => item.id !== product.id
        );

      }

      return [
        ...currentWishlist,
        product,
      ];

    });
  };


  // Clear all
  const clearWishlist = () => {
    setWishlist([]);
  };


  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => {

  const context = useContext(
    WishlistContext
  );

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
};


export default WishlistContext;
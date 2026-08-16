import { useState, useCallback } from "react";
import { WishlistContext } from "./WishlistContextInstance";
import api from "../api/axios";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await api.get("/users/wishlist");
      setWishlist(data.map((p) => ({ ...p, id: p._id })));
      setLoaded(true);
    } catch {
      setWishlist([]);
    }
  }, []);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId || item._id === productId);

  const toggleWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        await api.delete(`/users/wishlist/${productId}`);
        setWishlist((prev) =>
          prev.filter((item) => item.id !== productId && item._id !== productId)
        );
      } else {
        await api.post(`/users/wishlist/${productId}`);
        // Refetch to get full product details for the newly added item
        fetchWishlist();
      }
    } catch {
      // ignore on failure, UI stays as-is
    }
  };

  const clearWishlistState = () => {
    setWishlist([]);
    setLoaded(false);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loaded,
        fetchWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlistState,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
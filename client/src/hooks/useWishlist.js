import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContextInstance";

export const useWishlist = () => useContext(WishlistContext);
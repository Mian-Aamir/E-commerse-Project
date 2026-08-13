import { useContext } from "react";
import { CartContext } from "../context/CartContextInstance";

// Custom hook so components can just call useCart() instead of importing
// useContext and CartContext separately every time.
export const useCart = () => useContext(CartContext);
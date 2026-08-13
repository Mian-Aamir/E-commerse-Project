import { useState } from "react";
import { CartContext } from "./CartContextInstance";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Adds a product to the cart. If the same product with the same size and
  // color already exists, it increases the quantity instead of duplicating it.
  const addToCart = (product, size, color, quantity) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
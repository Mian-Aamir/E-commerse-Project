import { createContext } from "react";

// The context object itself lives in its own file, separate from the
// CartProvider component and the useCart hook, so that React Fast Refresh
// can treat CartContext.jsx as a component-only file.
export const CartContext = createContext(null);
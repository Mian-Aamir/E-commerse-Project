import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleCheckout = () => {
  if (!isLoggedIn) {
    navigate("/login?redirect=/checkout");
  } else {
    navigate("/checkout");
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">
          Looks like you have not added anything to your cart yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Cart</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart items list */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Size: {item.size} | Color:{" "}
                  <span
                    className="inline-block w-3 h-3 rounded-full align-middle border"
                    style={{ backgroundColor: item.color }}
                  />
                </p>
                <p className="font-semibold text-slate-900 mt-1">${item.price}</p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center border rounded-md shrink-0">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                  }
                  className="px-2 py-1.5 hover:bg-slate-50"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                  }
                  className="px-2 py-1.5 hover:bg-slate-50"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id, item.size, item.color)}
                className="text-slate-400 hover:text-red-500 shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-4">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-900 text-base border-t pt-4 mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
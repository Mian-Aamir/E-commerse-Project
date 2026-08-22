import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Wallet, CreditCard } from "lucide-react";
import { useCart } from "../hooks/useCart";
import api from "../api/axios";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      await api.post("/orders", {
        items,
        address: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod,
      });

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not place order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  // Redirect if someone lands here with an empty cart, unless the order was just placed.
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center">
        <p className="text-slate-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-blue-600 font-medium">
          Browse Products
        </Link>
      </div>
    );
  }

  // Order confirmation view, shown right after placing the order.
  if (orderPlaced) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center">
        <CheckCircle2 className="text-green-500 mx-auto mb-4" size={56} />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Order Placed Successfully
        </h1>
        <p className="text-slate-500 mb-6">
          Thank you for your order. A confirmation has been sent to you.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col md:flex-row gap-8">
        {/* Left side, delivery address and payment method */}
        <div className="flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-3">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Delivery Address</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                required
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                required
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer ${
                  paymentMethod === "cod" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-blue-600"
                />
                <Wallet size={18} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  Cash on Delivery
                </span>
              </label>

              <label
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer ${
                  paymentMethod === "card" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-blue-600"
                />
                <CreditCard size={18} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  Credit or Debit Card
                </span>
              </label>

              {/* Card fields, only shown when card payment is selected */}
              {paymentMethod === "card" && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <input
                    required
                    type="text"
                    placeholder="Card Number"
                    className="sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="MM/YY"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="CVV"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side, order summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-slate-900 text-base border-t pt-4 mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium disabled:opacity-60"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
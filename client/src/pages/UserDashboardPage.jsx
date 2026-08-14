import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { newArrivals } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

// Mock past orders, built from the existing product data so the dashboard
// looks realistic. Once the backend is ready, this will come from the
// orders API instead.
const mockOrders = [
  {
    id: "ORD-1042",
    date: "August 2, 2026",
    status: "Delivered",
    product: newArrivals[1],
  },
  {
    id: "ORD-1039",
    date: "July 21, 2026",
    status: "Shipped",
    product: newArrivals[2],
  },
];

// Mock wishlist items, same idea as above.
const mockWishlist = [newArrivals[0], newArrivals[4]];

// A small set of products to recommend, shown regardless of which tab is open.
const recommended = newArrivals.slice(0, 4);

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const UserDashboardPage = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Account</h1>
      <p className="text-slate-500 mb-8">
        Manage your orders, wishlist, addresses and profile details.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left text-red-500 hover:bg-red-50 mt-2 border-t pt-4"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

        {/* Right side content, changes based on selected section */}
        <div className="flex-1 space-y-8">
          {activeSection === "orders" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">My Orders</h2>

              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/product/${order.product.id}`}
                    className="flex items-center gap-4 border rounded-lg p-4 hover:border-blue-300"
                  >
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-16 h-16 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {order.product.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {order.id} | Placed on {order.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold text-slate-900 shrink-0">
                      ${order.product.price}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeSection === "wishlist" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Wishlist</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockWishlist.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {activeSection === "addresses" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">
                  Saved Addresses
                </h2>
                <button className="text-sm text-blue-600 font-medium">
                  + Add New Address
                </button>
              </div>
              <div className="text-center py-10">
                <MapPin className="text-slate-300 mx-auto mb-3" size={40} />
                <p className="text-sm text-slate-500">
                  No saved addresses yet.
                </p>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">
                Profile Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium">
                Save Changes
              </button>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Change Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="accent-blue-600" />
                  Email me about order updates and offers
                </label>
              </div>
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium">
                Save Settings
              </button>
            </div>
          )}

          {/* Recommended products, shown under every tab so the dashboard
              always feels like a normal ecommerce page, not an empty admin screen. */}
          <div>
            <h2 className="font-semibold text-slate-900 mb-4">
              Recommended For You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
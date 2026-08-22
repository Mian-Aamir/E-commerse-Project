import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Productcard from "../components/Productcard";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";

const menuItems = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusColors = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels = {
  delivered: "Delivered",
  shipped: "Shipped",
  pending: "Pending",
};

const UserDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeSection, setActiveSection] = useState(tabFromUrl || "orders");
  const { logout, user } = useAuth();
  const { wishlist, fetchWishlist, loaded: wishlistLoaded, clearWishlistState } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [recommended, setRecommended] = useState([]);

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount is expected here
    fetchOrders();
    if (!wishlistLoaded) {
      fetchWishlist();
    }
  }, [fetchOrders, fetchWishlist, wishlistLoaded]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { data } = await api.get("/products");
        setRecommended(data.slice(0, 4).map((p) => ({ ...p, id: p._id })));
      } catch {
        setRecommended([]);
      }
    };
    fetchRecommended();
  }, []);

  const handleLogout = () => {
    logout();
    clearWishlistState();
    navigate("/");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    try {
      await api.put("/users/profile", {
        name: profileName,
        phone: profilePhone,
      });
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileMessage(
        err.response?.data?.message || "Could not update profile."
      );
    } finally {
      setSavingProfile(false);
    }
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

              {ordersLoading ? (
                <p className="text-sm text-slate-500">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-slate-500">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-slate-400">
                          #{order._id.slice(-6).toUpperCase()} | Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <Link
                            key={index}
                            to={`/product/${item.productId}`}
                            className="flex items-center gap-4 hover:bg-slate-50 rounded-md p-1"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-md object-contain shrink-0 bg-slate-50"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-slate-900 shrink-0 text-sm">
                              ${item.price}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="text-right mt-3 pt-3 border-t">
                        <span className="font-semibold text-slate-900">
                          Total: ${order.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "wishlist" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Your wishlist is empty. Tap the heart icon on any product to
                  save it here.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <Productcard key={product.id} product={product} />
                  ))}
                </div>
              )}
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

              {profileMessage && (
                <div className="bg-blue-50 text-blue-700 text-sm rounded-md px-3 py-2 mb-4">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-slate-50 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-60"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
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

          <div>
            <h2 className="font-semibold text-slate-900 mb-4">
              Recommended For You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <Productcard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
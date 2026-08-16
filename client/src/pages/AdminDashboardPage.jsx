import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PackageCheck,
  Store,
  Users,
  Tags,
  ShoppingBag,
  LogOut,
  Check,
  X,
  Ban,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "approvals", label: "Product Approvals", icon: PackageCheck },
  { id: "sellers", label: "Manage Sellers", icon: Store },
  { id: "users", label: "Manage Users", icon: Users },
  { id: "categories", label: "Manage Categories", icon: Tags },
  { id: "orders", label: "All Orders", icon: ShoppingBag },
];

const statusColors = {
  active: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  Pending: "bg-yellow-100 text-yellow-700",
  blocked: "bg-red-100 text-red-700",
  Blocked: "bg-red-100 text-red-700",
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
};

const AdminDashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");

  const [pendingProducts, setPendingProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories, now backed by the real /api/categories endpoint
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Load everything needed for the overview stats + all tabs once on mount
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get("/users"),
        api.get("/orders"),
      ]);

      const allUsers = usersRes.data;
      setSellers(allUsers.filter((u) => u.role === "seller"));
      setUsers(allUsers.filter((u) => u.role === "user"));
      setOrders(ordersRes.data);
    } catch {
      // leave lists empty on failure
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products awaiting approval. The public endpoint filters to
  // "approved" only, so we fetch per-seller using each seller's id
  // once sellers are loaded, and merge the pending ones.
  const fetchPendingProducts = useCallback(async (sellerList) => {
    if (!sellerList || sellerList.length === 0) {
      setPendingProducts([]);
      return;
    }
    try {
      const results = await Promise.all(
        sellerList.map((seller) =>
          api.get("/products", { params: { sellerId: seller._id } })
        )
      );
      const allSellerProducts = results.flatMap((res, index) =>
        res.data.map((p) => ({
          ...p,
          id: p._id,
          sellerName: sellerList[index].name,
        }))
      );
      setPendingProducts(allSellerProducts.filter((p) => p.status === "pending"));
    } catch {
      setPendingProducts([]);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount is expected here
    fetchAllData();
    fetchCategories();
  },  [fetchAllData, fetchCategories]);

  useEffect(() => {
    if (sellers.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching after sellers load is expected here
      fetchPendingProducts(sellers);
    }
  }, [sellers, fetchPendingProducts]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/products/${id}/approve`);
      setPendingProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      // ignore, keep item in list so admin can retry
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/products/${id}/reject`);
      setPendingProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      // ignore, keep item in list so admin can retry
    }
  };

  const toggleSellerStatus = async (seller) => {
    try {
      const action = seller.status === "active" ? "block" : "unblock";
      await api.patch(`/users/${seller._id}/${action}`);
      setSellers((prev) =>
        prev.map((s) =>
          s._id === seller._id
            ? { ...s, status: s.status === "active" ? "blocked" : "active" }
            : s
        )
      );
    } catch {
      // ignore on failure
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const action = user.status === "active" ? "block" : "unblock";
      await api.patch(`/users/${user._id}/${action}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, status: u.status === "active" ? "blocked" : "active" }
            : u
        )
      );
    } catch {
      // ignore on failure
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError("");

    if (!newCategoryName.trim() || !newCategoryImage.trim()) {
      setCategoryError("Both name and image URL are required");
      return;
    }

    try {
      await api.post("/categories", {
        name: newCategoryName.trim(),
        image: newCategoryImage.trim(),
      });
      setNewCategoryName("");
      setNewCategoryImage("");
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || "Could not add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // ignore on failure
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">
        Manage products, sellers, users, categories and orders across the site.
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

        {/* Right side content */}
        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          ) : (
            <>
              {activeSection === "overview" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                    <p className="text-sm text-slate-500">Total Users</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-2xl font-bold text-slate-900">{sellers.length}</p>
                    <p className="text-sm text-slate-500">Total Sellers</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-2xl font-bold text-slate-900">
                      {pendingProducts.length}
                    </p>
                    <p className="text-sm text-slate-500">Pending Approvals</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                    <p className="text-sm text-slate-500">Total Orders</p>
                  </div>
                </div>
              )}

              {activeSection === "approvals" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">
                    Pending Product Approvals
                  </h2>

                  {pendingProducts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No products waiting for approval right now.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-md object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              Seller: {product.sellerName} | ${product.price}
                            </p>
                          </div>
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-md shrink-0"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(product.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-md shrink-0"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "sellers" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Manage Sellers</h2>
                  {sellers.length === 0 ? (
                    <p className="text-sm text-slate-500">No sellers registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {sellers.map((seller) => (
                        <div
                          key={seller._id}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900">
                              {seller.storeName || seller.name}
                            </p>
                            <p className="text-xs text-slate-400">{seller.email}</p>
                          </div>
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 capitalize ${statusColors[seller.status]}`}
                          >
                            {seller.status}
                          </span>
                          <button
                            onClick={() => toggleSellerStatus(seller)}
                            className="flex items-center gap-1 border text-slate-600 hover:bg-slate-50 text-xs font-medium px-3 py-2 rounded-md shrink-0"
                          >
                            <Ban size={14} />
                            {seller.status === "active" ? "Block" : "Unblock"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "users" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Manage Users</h2>
                  {users.length === 0 ? (
                    <p className="text-sm text-slate-500">No users registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 capitalize ${statusColors[user.status]}`}
                          >
                            {user.status}
                          </span>
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className="flex items-center gap-1 border text-slate-600 hover:bg-slate-50 text-xs font-medium px-3 py-2 rounded-md shrink-0"
                          >
                            <Ban size={14} />
                            {user.status === "active" ? "Block" : "Unblock"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "categories" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Manage Categories</h2>

                  {categoryError && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
                      {categoryError}
                    </div>
                  )}

                  <form onSubmit={handleAddCategory} className="space-y-2 mb-5">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newCategoryImage}
                      onChange={(e) => setNewCategoryImage(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full"
                    >
                      Add Category
                    </button>
                  </form>

                  {categories.length === 0 ? (
                    <p className="text-sm text-slate-500">No categories yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center gap-3 border rounded-lg px-4 py-2.5"
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 rounded-md object-cover shrink-0"
                          />
                          <span className="flex-1 text-sm text-slate-700">
                            {category.name}
                          </span>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "orders" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">All Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-sm text-slate-500">No orders placed yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order.address?.fullName}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 capitalize ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </span>
                          <span className="font-semibold text-slate-900 shrink-0">
                            ${order.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
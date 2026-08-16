import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingBag, DollarSign, Plus, X, LogOut, Trash2, Pencil } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const emptyFormData = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

const SellerDashboardPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const names = data.map((c) => c.name);
        setCategoryOptions(names);
        setFormData((prev) => ({ ...prev, category: prev.category || names[0] || "" }));
      } catch {
        setCategoryOptions([]);
      }
    };
    fetchCategories();
  }, []);

  const fetchMyProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { sellerId: user._id },
      });
      setProducts(data.map((p) => ({ ...p, id: p._id })));
    } catch {
      // silently ignore, list just stays empty
    } finally {
      setLoading(false);
    }
  }, [user]);


  const fetchMyOrders = useCallback(async () => {
  try {
    const { data } = await api.get("/orders");
    let count = 0;
    let total = 0;
    data.forEach((order) => {
      order.items.forEach((item) => {
        if (item.sellerId === user._id) {
          count += 1;
          total += item.price * item.quantity;
        }
      });
    });
    setOrderCount(count);
    setEarnings(total);
    } catch {
      setOrderCount(0);
      setEarnings(0);
    }
  },   [user]);

  useEffect(() => {
    if (user?._id) {
       // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount is expected here
      fetchMyProducts();
      fetchMyOrders();
    }
  }, [user, fetchMyProducts, fetchMyOrders]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...emptyFormData, category: categoryOptions[0] || "" });
    setFormError("");
    setShowAddForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock || "",
      image: product.image,
      description: product.description,
    });
    setFormError("");
    setShowAddForm(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const image =
        formData.image || "https://picsum.photos/seed/newproduct/400/400";

      if (editingId) {
        await api.put(`/products/${editingId}`, {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          description: formData.description || formData.name,
          image,
          images: [image],
        });
      } else {
        await api.post("/products", {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          description: formData.description || formData.name,
          image,
          images: [image],
          sku: `SKU-${Date.now()}`,
          sizes: ["One Size"],
          colors: ["#1e293b"],
        });
      }

      await fetchMyProducts();
      setFormData({ ...emptyFormData, category: categoryOptions[0] || "" });
      setEditingId(null);
      setShowAddForm(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          `Could not ${editingId ? "update" : "add"} product. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      // if delete fails, leave the list as-is
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            <Plus size={16} />
            Add Product
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
      <p className="text-slate-500 mb-8">
        This is your seller dashboard. Once orders start coming in, your real
        sales stats will appear here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Package className="text-blue-600 mb-3" size={26} />
          <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          <p className="text-sm text-slate-500">Products Listed</p>
        </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
          <ShoppingBag className="text-blue-600 mb-3" size={26} />
          <p className="text-2xl font-bold text-slate-900">{orderCount}</p>
          <p className="text-sm text-slate-500">Orders Received</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <DollarSign className="text-blue-600 mb-3" size={26} />
          <p className="text-2xl font-bold text-slate-900">${earnings.toFixed(2)}</p>
          <p className="text-sm text-slate-500">Total Earnings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-4">My Products</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading your products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">
            You have not added any products yet. Click "Add Product" above to
            list your first item, it will show here once submitted for admin
            approval.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
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
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
                <span className="font-semibold text-slate-900 shrink-0">
                  ${product.price}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusColors[product.status]}`}
                >
                  {statusLabels[product.status]}
                </span>
                <button
                  onClick={() => openEditForm(product)}
                  className="text-slate-400 hover:text-blue-600 shrink-0"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-slate-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowAddForm(false)}>
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Stock Quantity
                  </label>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Image URL (temporary, until real upload is connected)
                </label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-sm font-medium disabled:opacity-60"
              >
                {submitting
                  ? editingId
                    ? "Updating..."
                    : "Submitting..."
                  : editingId
                    ? "Update Product"
                    : "Submit for Approval"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
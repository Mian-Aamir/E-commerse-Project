import { useState, useEffect } from "react";
import api from "../api/axios";
import Productcard from "./Productcard";

const HomeSections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        // Add `id` alongside `_id` so existing components (Productcard, etc.)
        // that rely on product.id keep working without changes.
        const normalized = data.map((p) => ({ ...p, id: p._id }));
        setProducts(normalized);
      } catch {
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-10">
      <div id="new-arrivals-section">
        <h2 className="text-xl font-bold text-slate-900 mb-4">New Arrivals</h2>

        {loading ? (
          <p className="text-sm text-slate-500 py-6 text-center">Loading products...</p>
        ) : error ? (
          <p className="text-sm text-red-500 py-6 text-center">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Productcard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSections;
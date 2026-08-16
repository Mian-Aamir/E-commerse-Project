import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Productcard from "../components/Productcard";

const ratingOptions = [4, 3, 2];

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [allCategories, setAllCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setAllCategories(data.map((c) => c.name));
      } catch {
        setAllCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (selectedCategories.length === 1) params.category = selectedCategories[0];
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedRating) params.rating = selectedRating;

      const { data } = await api.get("/products", { params });
      let result = data.map((p) => ({ ...p, id: p._id }));

      if (selectedCategories.length > 1) {
        result = result.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      if (sortBy === "price-low") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        result.sort((a, b) => b.rating - a.rating);
      }

      setProducts(result);
    } catch {
      setError("Could not load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, minPrice, maxPrice, selectedRating, sortBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount is expected here
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Category</h3>
            <div className="space-y-2">
              {allCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="accent-blue-600"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Rating</h3>
            <div className="space-y-2">
              {ratingOptions.map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                    className="accent-blue-600"
                  />
                  {rating}+ Stars
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 font-medium"
          >
            Clear All Filters
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm py-10 text-center">Loading products...</p>
          ) : error ? (
            <p className="text-red-500 text-sm py-10 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-slate-500 text-sm py-10 text-center">
              No products match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <Productcard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
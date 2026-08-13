import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { newArrivals } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";

const allCategories = [
  "Electronics",
  "Clothes and Wear",
  "Home Interiors",
  "Books and Magazines",
  "Tools Equipment",
  "Sports and Outdoor",
  "Animal and Pets",
  "Toys for Kids",
];

const ratingOptions = [4, 3, 2];

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Recalculate the visible product list whenever a filter or the sort
  // option changes, instead of on every render.
  const filteredProducts = useMemo(() => {
    let result = [...newArrivals];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (minPrice) {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (selectedRating) {
      result = result.filter((product) => product.rating >= selectedRating);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategories, minPrice, maxPrice, selectedRating, sortBy]);

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
        {/* Filters sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          {/* Category filter */}
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

          {/* Price range filter */}
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

          {/* Rating filter */}
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

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {filteredProducts.length} products found
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

          {filteredProducts.length === 0 ? (
            <p className="text-slate-500 text-sm py-10 text-center">
              No products match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
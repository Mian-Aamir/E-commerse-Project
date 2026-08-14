import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { newArrivals } from "../data/mockProducts";
import Productcard from "../components/Productcard";
import { useCart } from "../hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = newArrivals.find((item) => String(item.id) === id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // If someone opens a product id that does not exist in the mock data.
  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center">
        <p className="text-slate-600">Product not found.</p>
        <Link to="/" className="text-blue-600 font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  const relatedProducts = newArrivals.filter((item) => item.id !== product.id).slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left side, image gallery */}
        <div>
          <div className="rounded-xl overflow-hidden bg-slate-100 aspect-square mb-4">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  index === activeImage ? "border-blue-600" : "border-transparent"
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right side, product info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < product.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-sm text-slate-500">
              ({product.reviews} reviews)
            </span>
            <span className="text-sm text-slate-400">| SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-slate-900">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-slate-400 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>

          {/* Size selector */}
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-700 mb-2">Sizes:</p>
            <div className="flex gap-2">
              {product.sizes.map((size, index) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(index)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    index === selectedSize
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-2">Colors:</p>
            <div className="flex gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(index)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    index === selectedColor ? "border-blue-600" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quantity stepper and add to cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 hover:bg-slate-50"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 hover:bg-slate-50"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(
                  product,
                  product.sizes[selectedSize],
                  product.colors[selectedColor],
                  quantity
                );
                navigate("/cart");
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
            >
              Add to Cart
            </button>

            <button className="border rounded-md p-3 hover:bg-slate-50">
              <Heart size={18} />
            </button>
          </div>

          {/* Share row */}
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <span>Share Now:</span>
            <FaFacebookF size={14} className="cursor-pointer hover:text-blue-600" />
            <FaInstagram size={14} className="cursor-pointer hover:text-blue-600" />
            <FaTwitter size={14} className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>

      {/* Description and reviews tabs */}
      <div className="mt-14">
        <div className="flex gap-8 border-b mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-medium border-b-2 ${
              activeTab === "description"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-medium border-b-2 ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            Reviews ({product.reviews})
          </button>
        </div>

        {activeTab === "description" ? (
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            No reviews to show yet in this demo. Once the backend is connected,
            real customer reviews will appear here.
          </p>
        )}
      </div>

      {/* Related products */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {relatedProducts.map((item) => (
            <Productcard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
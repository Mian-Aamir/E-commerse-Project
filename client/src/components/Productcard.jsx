import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";

const Productcard = ({ product }) => {
  const { id, name, price, oldPrice, rating, reviews, badge, image } = product;
  const { isLoggedIn } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isLoggedIn && isInWishlist(id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return; // silently ignore if not logged in
    toggleWishlist(id);
  };

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3"
    >
      <div className="relative rounded-lg overflow-hidden bg-slate-50 aspect-square mb-3">
        {badge && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
            {badge}
          </span>
        )}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 bg-white rounded-full p-1.5 ${
            inWishlist ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart size={16} className={inWishlist ? "fill-red-500" : ""} />
        </button>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-1">
        {name}
      </h3>

      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={13}
            className={
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-slate-400 ml-1">({reviews})</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900">${price}</span>
        {oldPrice && (
          <span className="text-sm text-slate-400 line-through">
            ${oldPrice}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Productcard;
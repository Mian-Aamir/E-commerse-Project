import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Replace each image path with your own file placed inside the public folder.
const categoryList = [
  { name: "Electronics", image: "/category-electronics.png" },
  { name: "Clothes and Wear", image: "/category-clothes.png" },
  { name: "Home Interiors", image: "/category-home.png" },
  { name: "Books and Magazines", image: "/category-books.png" },
  { name: "Tools Equipment", image: "/category-tools.png" },
  { name: "Sports and Outdoor", image: "/category-sports.png" },
  { name: "Animal and Pets", image: "/category-pets.png" },
  { name: "Toys for Kids", image: "/category-toys.png" },
];

const AllCategory = () => {
  const scrollRef = useRef(null);

  const scrollByAmount = (amount) => {
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div id="categories-section" className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Shop by Category</h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scrollByAmount(-300)}
            className="border rounded-full p-1.5 hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollByAmount(300)}
            className="border rounded-full p-1.5 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable row of category cards */}
      <div
        ref={scrollRef}
        className="flex gap-13 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categoryList.map((category) => (
          <Link
            key={category.name}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="shrink-0 w-44 md:w-70 cursor-pointer"
          >
            <div className="w-44 h-44 md:w-70 md:h-60 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-center font-semibold text-slate-800 mt-2">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategory;
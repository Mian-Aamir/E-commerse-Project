import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Zap,
  Shirt,
  Home as HomeIcon,
  BookOpen,
  Wrench,
  Dumbbell,
  PawPrint,
  Blocks,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

const categoryList = [
  { name: "Electronics", icon: Zap },
  { name: "Clothes and Wear", icon: Shirt },
  { name: "Home Interiors", icon: HomeIcon },
  { name: "Books and Magazines", icon: BookOpen },
  { name: "Tools Equipment", icon: Wrench },
  { name: "Sports and Outdoor", icon: Dumbbell },
  { name: "Animal and Pets", icon: PawPrint },
  { name: "Toys for Kids", icon: Blocks },
  { name: "More Category", icon: MoreHorizontal },
];

const CategoryPanel = ({ isOpen, onClose }) => {
  // Close the panel when the Escape key is pressed, a common UX pattern for overlays.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent the page from scrolling behind the panel while it is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark backdrop, clicking it closes the panel */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b bg-slate-900 text-white">
          <h2 className="font-semibold">Shop by Category</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {categoryList.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-blue-50 hover:text-blue-600"
              >
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Icon size={18} />
                  {category.name}
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryPanel;
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, Menu, User } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ onCategoriesClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { isLoggedIn, role } = useAuth();
  const dashboardPath = role === "seller" ? "/dashboard/seller" : "/dashboard/user";

  const categories = [
    "Home",
    "Categories",
    "New Arrivals",
    "Sell",
    "Contact Us",
  ];

  // Each of these items scrolls to a section that only exists on the homepage.
  const sectionIds = {
    Categories: "categories-section",
    "New Arrivals": "new-arrivals-section",
    "Contact Us": "contact-section",
  };

  const handleNavClick = (item) => {
    if (item === "Home") {
      navigate("/");
      return;
    }

    const sectionId = sectionIds[item];
    if (!sectionId) return;

    if (location.pathname !== "/") {
      // Not on the homepage right now, navigate there first and pass the
      // target section in the URL hash, HomePage will scroll to it once loaded.
      navigate(`/#${sectionId}`);
    } else {
      // Already on the homepage, just scroll directly.
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Renders "Sell" as a real router Link (navigates to /sell),
  // and every other item as a clickable span that scrolls to its section
  // (navigating back to the homepage first if needed).
  const renderNavItem = (item, className) => {
    if (item === "Sell") {
      return (
        <Link key={item} to="/sell" className={className}>
          {item}
        </Link>
      );
    }
    return (
      <span key={item} onClick={() => handleNavClick(item)} className={className}>
        {item}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Top thin promo bar, hidden on small screens to save space */}
      <div className="bg-slate-900 text-white text-xs">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-2 hidden sm:flex justify-between items-center">
          <span>Promo text goes here</span>
          <div className="flex gap-4">
            <span>PKR</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex md:grid md:grid-cols-[11rem_1fr_9rem] items-center gap-4">
          {/* Hamburger icon, only visible on small screens, opens the categories panel directly */}
          <button className="md:hidden text-slate-700" onClick={onCategoriesClick}>
            <Menu size={24} />
          </button>

          {/* Brand name, also links back to the homepage */}
          <Link to="/" className="shrink-0 text-xl md:text-2xl font-bold text-slate-900">
            Brand Name
          </Link>

          {/* Search bar, visible only on medium screens and up, centered within its column */}
          <div className="hidden md:flex md:justify-self-center w-full max-w-xl">
            <input
              type="text"
              placeholder="Search products"
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 outline-none focus:border-blue-500"
            />
            <button className="bg-blue-900 hover:bg-blue-700 text-white px-4 rounded-r-md shrink-0">
              <Search size={18} />
            </button>
          </div>

          {/* Icons section */}
          <div className="flex items-center gap-4 md:gap-5 text-slate-700 shrink-0 ml-auto md:ml-0 md:justify-self-end">
            {isLoggedIn ? (
              <>
                <Link to={dashboardPath} className="md:hidden text-sm font-medium cursor-pointer hover:text-blue-600">
                  My Account
                </Link>
                <Link
                  to={dashboardPath}
                  className="hidden md:flex items-center gap-1.5 cursor-pointer hover:text-blue-600 text-sm font-medium"
                >
                  <User size={16} />
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="md:hidden text-sm font-medium cursor-pointer hover:text-blue-600">
                  Sign In
                </Link>
                <Link to="/login" className="hidden md:block cursor-pointer hover:text-blue-600 text-sm font-medium">
                  Sign In
                </Link>
              </>
            )}

            <Heart className="cursor-pointer hover:text-blue-600" size={22} />

            <Link to="/cart" className="relative cursor-pointer hover:text-blue-600">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Search bar, always visible on small screens, placed below the top row */}
        <div className="md:hidden px-4 pb-3 flex">
          <input
            type="text"
            placeholder="Search products"
            className="w-full border border-gray-300 rounded-l-md px-4 py-2 outline-none focus:border-blue-500"
          />
          <button className="bg-blue-900 hover:bg-blue-700 text-white px-4 rounded-r-md shrink-0">
            <Search size={18} />
          </button>
        </div>

        {/* Category shortcut links, always visible on small screens, placed below the search bar */}
        <div className="md:hidden px-4 pb-3 flex items-center gap-5 overflow-x-auto text-sm text-slate-700">
          {categories.map((item) =>
            renderNavItem(item, "cursor-pointer hover:text-blue-600 shrink-0")
          )}
        </div>
      </div>

      {/* Category bar, only visible on medium screens and up */}
      <div className="bg-blue-900 text-white text-sm hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-2 grid grid-cols-[11rem_1fr_9rem] items-center gap-4 overflow-x-auto">
          <div
            className="flex items-center gap-1 cursor-pointer font-medium shrink-0"
            onClick={onCategoriesClick}
          >
            <Menu size={16} />
            All Categories
          </div>

          <div className="flex items-center gap-6 justify-self-center">
            {categories.map((item) =>
              renderNavItem(item, "cursor-pointer hover:underline shrink-0")
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
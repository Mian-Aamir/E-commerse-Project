import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardHeader from "./components/DashboardHeader";
import Hero from "./components/Hero";
import CategoryShowcase from "./components/allCategory";
import HomeSections from "./components/HomeSections";
import Footer from "./components/Footer";
import CategoryPanel from "./components/Categorypanel";
import SellerPage from "./pages/SellerPage";
import ProductDetail from "./pages/ProductDetail";
import ProductListingPage from "./pages/ProductListingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// The homepage groups together the sections that only belong on "/".
// It also watches the URL hash (e.g. "/#new-arrivals-section") so that
// links from other pages, like Sell, can navigate back here and land
// directly on the right section.
const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Small delay so the page content has time to render before scrolling.
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <HomeSections />
    </>
  );
};

function App() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const toggleCategories = () => {
    setIsCategoriesOpen((prev) => !prev);
  };

  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      {isDashboardRoute ? (
        <DashboardHeader />
      ) : (
        <>
          <Navbar onCategoriesClick={toggleCategories} />
          <CategoryPanel isOpen={isCategoriesOpen} onClose={closeCategories} />
        </>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sell" element={<SellerPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/user" element={<UserDashboardPage />} />
        <Route path="/dashboard/seller" element={<SellerDashboardPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default App;
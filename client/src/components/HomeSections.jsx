import { newArrivals } from "../data/mockProducts";
import ProductCard from "./ProductCard";

const HomeSections = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-10">
      {/* New Arrivals grid, now taking the full width */}
      <div id="new-arrivals-section">
        <h2 className="text-xl font-bold text-slate-900 mb-4">New Arrivals</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSections;
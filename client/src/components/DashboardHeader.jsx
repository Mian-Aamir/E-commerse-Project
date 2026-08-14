import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold text-slate-900">
          Brand Name
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
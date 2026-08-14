import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Phone, Store } from "lucide-react";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role");
  const [role, setRole] = useState(roleFromUrl === "seller" ? "seller" : "user");

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Create Account
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Join us and start shopping or selling today
        </p>

        {/* Role toggle */}
        <div className="flex bg-slate-100 rounded-md p-1 mb-6">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "user" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            Register as User
          </button>
          <button
            onClick={() => setRole("seller")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "seller" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            Register as Seller
          </button>
        </div>

        <form className="space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Extra fields, only shown when registering as a seller */}
          {role === "seller" && (
            <div className="relative">
              <Store size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Business / Store Name"
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input required type="checkbox" className="accent-blue-600 mt-0.5" />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium"
          >
            Create {role === "user" ? "User" : "Seller"} Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
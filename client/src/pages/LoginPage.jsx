import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend yet, so we simulate a successful login, mark the user as
    // logged in globally, and route to the matching dashboard.
    login(role);
    if (role === "user") {
      navigate("/dashboard/user");
    } else {
      navigate("/dashboard/seller");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Sign in to continue
        </p>

        {/* Role toggle */}
        <div className="flex bg-slate-100 rounded-md p-1 mb-6">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "user" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("seller")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "seller" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>
            <span className="text-blue-600 cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium"
          >
            Sign In as {role === "user" ? "User" : "Seller"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
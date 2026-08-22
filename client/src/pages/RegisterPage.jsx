import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Store } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role");
  const [role, setRole] = useState(roleFromUrl === "seller" ? "seller" : "user");
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Field-specific errors instead of one generic error box
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = "Enter a valid phone number (10-15 digits, numbers only)";
    }

    if (role === "seller" && !storeName.trim()) {
      errors.storeName = "Business/Store name is required";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.password = "At least 8 characters with a letter and a number";
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        name,
        email,
        phone,
        password,
        role,
        storeName: role === "seller" ? storeName : undefined,
      });

      if (data.role === "seller") {
        navigate("/dashboard/seller");
      } else {
        navigate("/dashboard/user");
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          Create Account
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Join us and start shopping or selling today
        </p>

        {submitError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
            {submitError}
          </div>
        )}

        {/* Role toggle */}
        <div className="flex bg-slate-100 rounded-md p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "user" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            Register as User
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${
              role === "seller" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            Register as Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  fieldErrors.name ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  fieldErrors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  fieldErrors.phone ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {role === "seller" && (
            <div>
              <div className="relative">
                <Store size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Business / Store Name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                    fieldErrors.storeName ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              {fieldErrors.storeName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.storeName}</p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  fieldErrors.password ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.password ? (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Must be at least 8 characters with a letter and a number
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  fieldErrors.confirmPassword ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input required type="checkbox" className="accent-blue-600 mt-0.5" />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium disabled:opacity-60"
          >
            {loading ? "Creating Account..." : `Create ${role === "user" ? "User" : "Seller"} Account`}
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
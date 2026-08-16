import { useState } from "react";
import { AuthContext } from "./AuthContextInstance";
import api from "../api/axios";

// Reads any existing session from localStorage once, before first render.
// This avoids needing a useEffect just to sync state on mount.
const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return { isLoggedIn: true, role: parsedUser.role, user: parsedUser };
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return { isLoggedIn: false, role: null, user: null };
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setAuthState({ isLoggedIn: true, role: data.role, user: data });

    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setAuthState({ isLoggedIn: true, role: data.role, user: data });

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ isLoggedIn: false, role: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        role: authState.role,
        user: authState.user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
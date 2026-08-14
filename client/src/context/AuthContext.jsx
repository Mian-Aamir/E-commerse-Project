import { useState } from "react";
import { AuthContext } from "./AuthContextInstance";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  // No backend yet, so login just marks the user as logged in with the
  // role they selected on the form.
  const login = (selectedRole) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
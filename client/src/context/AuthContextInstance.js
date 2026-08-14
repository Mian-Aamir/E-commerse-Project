import { createContext } from "react";

// Kept in its own file, separate from AuthContext.jsx and useAuth.js,
// so React Fast Refresh only sees one component per file.
export const AuthContext = createContext(null);
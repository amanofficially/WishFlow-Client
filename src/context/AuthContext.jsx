// This context lets ANY component in the app know:
// - who is currently logged in
// - functions to log in / log out
// without passing that data down through every single component manually.

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check "am I logged in?"

  // On first app load, ask the backend "who am I?" using the saved cookie.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (error) {
        setUser(null); // not logged in, that's fine
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Already logged out / session expired — clearing local state below
      // still gets the user back to a logged-out UI either way.
    }
    setUser(null);
  };

  // Merges partial updates into the current user (e.g. after toggling
  // Auto-Pilot, or editing the profile) without needing a full /auth/me
  // round trip.
  const updateUser = (partial) => setUser((prev) => (prev ? { ...prev, ...partial } : prev));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components just do: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);

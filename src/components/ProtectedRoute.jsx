// Wrap any page that needs login in this component.
// If the user isn't logged in, they get redirected to /login.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While we're still checking "is there a logged-in user?", show a branded loader.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-800/60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-brand-100 border-t-brand-600 animate-spin" />
          <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">Loading WishFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

// Wrap any admin page in this. Three distinct states, in order:
//   1. Still checking auth  -> loader
//   2. Not logged in at all -> straight to /login (ProtectedRoute's job normally,
//      but this component is used standalone in the route tree so it repeats
//      that check)
//   3. Logged in but not an admin -> redirect to /dashboard, not to /login.
//      Sending a regular, legitimately logged-in user to a login screen
//      would be a confusing dead end for them.
//
// This is a UX guard, not a security boundary — hiding a link and
// redirecting a stray visit does not grant or check any permission by
// itself. Every actual admin API call is independently re-checked server
// side by `protect` + `requireAdmin`, so even if someone bypassed this
// component entirely, they'd get a 403 from the API, not real data.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

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

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

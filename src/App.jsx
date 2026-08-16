// This file defines which page shows for which URL.

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Templates from "./pages/Templates";
import Schedule from "./pages/Schedule";
import SentWishes from "./pages/SentWishes";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Upcoming from "./pages/Upcoming";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminWishes from "./pages/admin/AdminWishes";

function App() {
  return (
    <Routes>
      {/* Public pages — anyone can see these */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected pages — only logged-in users can see these.
          They all share the same sidebar + header shell. */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/sent-wishes" element={<SentWishes />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin panel — its own layout/sidebar, guarded by AdminRoute
          (role === "admin"). Every API call underneath is independently
          re-checked server-side, so this route guard is UX only. */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/wishes" element={<AdminWishes />} />
      </Route>
    </Routes>
  );
}

export default App;

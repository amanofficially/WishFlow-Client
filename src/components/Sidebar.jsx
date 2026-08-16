import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  FileText,
  Send,
  History,
  BarChart3,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/upcoming", label: "Upcoming Occasions", icon: CalendarClock },
  { to: "/templates", label: "Templates", icon: FileText },
  { to: "/schedule", label: "Schedule", icon: Send },
  { to: "/sent-wishes", label: "Sent Wishes", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

const SidebarContent = ({
  collapsed,
  onToggleCollapse,
  onNavigate,
  showCloseButton,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Explicitly send the user to /login after logging out. We don't rely
  // only on ProtectedRoute's redirect-when-logged-out fallback here,
  // since that only fires on the next render of a protected route — this
  // guarantees a clean, immediate landing spot every time.
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-100 dark:border-slate-800 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <Logo variant="mark" className="h-7 w-auto" />}
        {collapsed && <Logo variant="icon" className="h-7 w-7" />}

        {showCloseButton ? (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:text-slate-500 dark:hover:text-brand-300 dark:hover:bg-brand-500/10 transition-colors"
          >
            {collapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-gradient text-white shadow-brand"
                  : "text-gray-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
              }`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-white" : ""}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`border-t border-gray-100 dark:border-slate-800 p-3 ${
          collapsed ? "flex flex-col items-center gap-2" : ""
        }`}
      >
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            onClick={onNavigate}
            title={collapsed ? "Admin Panel" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-sm font-medium border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <ShieldCheck className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && "Admin Panel"}
          </NavLink>
        )}
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors ${
            collapsed
              ? ""
              : "bg-brand-50/60 hover:bg-brand-50 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          }`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 truncate">
                Free plan
              </p>
            </div>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`mt-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors w-full px-3 py-2 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

// Desktop: fixed collapsible column. Mobile: slide-in drawer with backdrop.
const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => (
  <>
    <aside
      className={`hidden lg:block fixed inset-y-0 left-0 z-30 border-r border-gray-100 dark:border-slate-800 transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <SidebarContent
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </aside>

    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.25 }}
          className="absolute inset-y-0 left-0 w-72 shadow-2xl"
        >
          <SidebarContent
            collapsed={false}
            onNavigate={onCloseMobile}
            showCloseButton
            onClose={onCloseMobile}
          />
        </motion.div>
      </div>
    )}
  </>
);

export default Sidebar;

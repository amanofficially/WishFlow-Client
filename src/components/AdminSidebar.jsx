import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Send,
  ShieldCheck,
  LogOut,
  ArrowLeftCircle,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/templates", label: "Templates", icon: FileText },
  { to: "/admin/wishes", label: "Wish Logs", icon: Send },
];

// Deliberately a separate component from the regular Sidebar rather than
// a set of conditional branches inside it — the admin panel is a distinct
// context (dark, system-toned) and keeping it separate means a bug in one
// can never leak into the other.
const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800">
      <div className="flex items-center h-16 px-4 border-b border-slate-800 gap-2">
        <Logo variant="icon" className="h-7 w-7" />
        <div className="flex items-center gap-1.5">
          <span className="text-white font-display font-bold text-sm">WishFlow</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-300 bg-brand-500/15 border border-brand-500/30 rounded px-1.5 py-0.5">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-500/15 text-brand-200 border border-brand-500/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3 space-y-1">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
        >
          <ArrowLeftCircle className="w-[18px] h-[18px]" />
          Back to app
        </button>
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 mt-2 bg-slate-900/60">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || "A"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Administrator
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors px-3 py-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

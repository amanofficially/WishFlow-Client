import { Outlet, NavLink } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const MOBILE_NAV = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/templates", label: "Templates" },
  { to: "/admin/wishes", label: "Wish Logs" },
];

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-900">
    <AdminSidebar />

    {/* Mobile: a horizontal pill nav instead of the fixed desktop sidebar. */}
    <div className="lg:hidden sticky top-0 z-20 bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-300 bg-brand-500/15 border border-brand-500/30 rounded px-1.5 py-0.5 shrink-0">
        Admin
      </span>
      {MOBILE_NAV.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isActive ? "bg-brand-500/15 text-brand-200" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>

    <div className="lg:pl-64">
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;


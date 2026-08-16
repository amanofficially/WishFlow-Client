import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users, UserCheck, ShieldAlert, UserCog, Contact2, FileText,
  Send, CheckCircle2, XCircle, Clock, Loader2, Database, Mail, Server,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import api from "../../services/api";

const StatCard = ({ label, value, icon: Icon, index, tone = "brand" }) => {
  const tones = {
    brand: "text-brand-300 bg-brand-500/10",
    green: "text-emerald-300 bg-emerald-500/10",
    red: "text-red-300 bg-red-500/10",
    amber: "text-amber-300 bg-amber-500/10",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5"
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${tones[tone]}`}>
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-xl sm:text-2xl font-display font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  );
};

const HealthRow = ({ label, value, ok, icon: Icon }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
    <span className="flex items-center gap-2 text-sm text-slate-400">
      <Icon className="w-4 h-4" /> {label}
    </span>
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ok ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
      {value}
    </span>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, growthRes, healthRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/stats/growth"),
          api.get("/admin/system"),
        ]);
        setStats(statsRes.data.data);
        setGrowth(
          growthRes.data.data.map((d) => ({
            ...d,
            label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          }))
        );
        setHealth(healthRes.data.data);
      } catch {
        toast.error("Couldn't load admin stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.users.total, icon: Users, tone: "brand" },
    { label: "Verified Users", value: stats.users.verified, icon: UserCheck, tone: "green" },
    { label: "Suspended", value: stats.users.suspended, icon: ShieldAlert, tone: "red" },
    { label: "Admins", value: stats.users.admins, icon: UserCog, tone: "amber" },
    { label: "New (7 days)", value: stats.users.new7d, icon: Users, tone: "brand" },
    { label: "Active (24h)", value: stats.users.active24h, icon: UserCheck, tone: "green" },
    { label: "Total Contacts", value: stats.contacts.total, icon: Contact2, tone: "brand" },
    { label: "Templates", value: `${stats.templates.total} (${stats.templates.custom} custom)`, icon: FileText, tone: "brand" },
    { label: "Wishes Sent", value: stats.wishes.total, icon: Send, tone: "brand" },
    { label: "Delivered", value: stats.wishes.delivered, icon: CheckCircle2, tone: "green" },
    { label: "Failed", value: stats.wishes.failed, icon: XCircle, tone: "red" },
    { label: "Delivery Rate", value: `${stats.wishes.deliveryRate}%`, icon: Clock, tone: "amber" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100">Admin Overview</h1>
        <p className="text-slate-500 text-sm">System-wide numbers across every WishFlow account</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display font-semibold text-slate-100 mb-4">Signups — last 30 days</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c2fe0" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c2fe0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} interval={4} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} width={28} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="signups" stroke="#7c2fe0" strokeWidth={2} fill="url(#signupFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display font-semibold text-slate-100 mb-2">System health</h2>
          <HealthRow label="Database" value={health.database} ok={health.database === "connected"} icon={Database} />
          <HealthRow label="SMTP" value={health.smtp} ok={health.smtp === "connected"} icon={Mail} />
          <HealthRow label="Queue" value={health.queue} ok icon={Server} />
          <div className="pt-3 text-xs text-slate-500 space-y-1">
            <p>Environment: <span className="text-slate-300">{health.environment}</span></p>
            <p>Uptime: <span className="text-slate-300">{Math.floor(health.uptimeSeconds / 3600)}h {Math.floor((health.uptimeSeconds % 3600) / 60)}m</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

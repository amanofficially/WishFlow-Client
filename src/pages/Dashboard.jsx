import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Users, Cake, Heart, Send, TrendingUp, Plus, FileText,
  CalendarClock, ArrowRight, Loader2, PartyPopper,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { relativeLabel } from "../utils/occasion";

const greetingFor = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const StatCard = ({ label, value, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-brand-100 transition-all"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="w-8 h-8 rounded-lg bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center">
        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-300" />
      </span>
    </div>
    <p className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">{value}</p>
    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [wishStats, setWishStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [autoPilotSaving, setAutoPilotSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const autoPilot = user?.settings?.automationEnabled !== false;

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, upcomingRes, wishStatsRes] = await Promise.all([
          api.get("/contacts/stats"),
          api.get("/contacts/upcoming"),
          api.get("/wishes/stats"),
        ]);
        setStats(statsRes.data.data);
        setUpcoming(upcomingRes.data.data);
        setWishStats(wishStatsRes.data.data);
      } catch {
        // Non-fatal — dashboard just shows empty/zero state.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleAutoPilot = async () => {
    setAutoPilotSaving(true);
    try {
      const res = await api.patch("/auth/automation", { enabled: !autoPilot });
      updateUser({ settings: res.data.data.settings });
      toast.success(!autoPilot ? "Auto-Pilot activated" : "Auto-Pilot paused");
    } catch {
      toast.error("Couldn't update Auto-Pilot right now");
    } finally {
      setAutoPilotSaving(false);
    }
  };

  const statCards = [
    { label: "Total Contacts", value: stats?.total ?? "—", icon: Users },
    { label: "Birthdays This Week", value: stats?.birthdaysSoon ?? "—", icon: Cake },
    { label: "Anniversaries This Week", value: stats?.anniversariesSoon ?? "—", icon: Heart },
    { label: "Wishes Sent", value: wishStats?.totalSent ?? "—", icon: Send },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">
            {greetingFor()}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">Here's what's happening with your celebrations.</p>
        </div>
      </div>

      {/* AUTO-PILOT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-brand-gradient bg-size-200 animate-gradientShift p-5 sm:p-6 mb-6 sm:mb-8 text-white shadow-brand-lg"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <p className="font-display font-bold flex items-center gap-2">
                Auto-Pilot
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${autoPilot ? "bg-emerald-400 text-emerald-950" : "bg-white/20"}`}>
                  {autoPilot ? "ACTIVE" : "PAUSED"}
                </span>
              </p>
              <p className="text-white/85 text-sm mt-0.5 max-w-md">
                Your birthday and anniversary wishes are being handled automatically.
              </p>
            </div>
          </div>
          <button
            onClick={toggleAutoPilot}
            disabled={autoPilotSaving}
            className="shrink-0 self-start sm:self-auto bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {autoPilotSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {autoPilot ? "Pause automation" : "Resume automation"}
          </button>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* UPCOMING OCCASIONS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-brand-500 dark:text-brand-300" /> Upcoming Occasions
            </h2>
            <Link to="/upcoming" className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-200 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 dark:text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <PartyPopper className="w-9 h-9 text-brand-300 dark:text-brand-400/60 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-slate-400">Nothing coming up in the next 30 days.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {upcoming.map((item, i) => (
                <motion.div
                  key={`${item.contactId}-${item.occasionType}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-slate-800 last:border-0"
                >
                  <span className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                    {item.occasionType === "birthday" ? <Cake className="w-[18px] h-[18px]" /> : <Heart className="w-[18px] h-[18px]" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">{item.occasionType}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      item.daysAway <= 1 ? "bg-brand-gradient text-white" : "bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400"
                    }`}
                  >
                    {relativeLabel(item.date)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500 dark:text-brand-300" /> Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: "Add Contact", icon: Plus, to: "/contacts" },
              { label: "Create Template", icon: FileText, to: "/templates" },
              { label: "View Upcoming", icon: CalendarClock, to: "/schedule" },
            ].map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-500/40 hover:bg-brand-50/50 dark:hover:bg-brand-500/10 transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex-1">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-brand-500 dark:group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

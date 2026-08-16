import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Send, Cake, Heart, Mail, MessageCircle, Smartphone,
  CheckCircle2, XCircle, Gauge, Loader2, BarChart3, PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import api from "../services/api";

const CHANNEL_COLORS = { email: "#7c2fe0", whatsapp: "#22c55e", sms: "#f59e0b" };
const OCCASION_COLORS = ["#7c2fe0", "#c92c9e"];

const StatCard = ({ label, value, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-brand-100 transition-all"
  >
    <span className="w-8 h-8 rounded-lg bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mb-2">
      <Icon className="w-4 h-4 text-brand-600 dark:text-brand-300" />
    </span>
    <p className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">{value}</p>
    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{label}</p>
  </motion.div>
);

const ChartCard = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 ${className}`}>
    <h2 className="font-display font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-brand-500 dark:text-brand-300" /> {title}
    </h2>
    {children}
  </div>
);

const EmptyChart = ({ text }) => (
  <div className="h-[240px] flex flex-col items-center justify-center text-center">
    <PieChartIcon className="w-8 h-8 text-gray-300 dark:text-slate-600 mb-2" />
    <p className="text-sm text-gray-400 dark:text-slate-500">{text}</p>
  </div>
);

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [wishData, setWishData] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [overviewRes, wishesRes, channelsRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/wishes"),
          api.get("/analytics/channels"),
        ]);
        setOverview(overviewRes.data.data);
        setWishData(wishesRes.data.data);
        setChannels(channelsRes.data.data);
      } catch {
        // Non-fatal — page just shows empty states below.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: "Total Contacts", value: overview?.totalContacts ?? "—", icon: Users },
    { label: "Total Wishes", value: overview?.totalWishes ?? "—", icon: Send },
    { label: "Birthday Wishes", value: overview?.birthdayWishes ?? "—", icon: Cake },
    { label: "Anniversary Wishes", value: overview?.anniversaryWishes ?? "—", icon: Heart },
    { label: "Email Wishes", value: overview?.emailWishes ?? "—", icon: Mail },
    { label: "WhatsApp Wishes", value: overview?.whatsappWishes ?? "—", icon: MessageCircle },
    { label: "SMS Wishes", value: overview?.smsWishes ?? "—", icon: Smartphone },
    { label: "Delivery Rate", value: overview ? `${overview.deliveryRate}%` : "—", icon: Gauge },
  ];

  const hasTimeline = wishData?.wishesOverTime?.some((m) => m.sent > 0);
  const hasOccasionData =
    wishData?.occasionBreakdown?.some((o) => o.value > 0) ?? false;
  const hasChannelData = channels.some((c) => c.total > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 dark:text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-300" /> Analytics
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">See your celebration activity at a glance.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* DELIVERY SUCCESS RATE */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-500 dark:text-brand-300" /> Delivery success rate
          </h2>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{overview?.deliveryRate ?? 0}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overview?.deliveryRate ?? 0}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full bg-brand-gradient rounded-full"
          />
        </div>
        <div className="flex items-center gap-5 mt-3 text-xs text-gray-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {overview?.successfulDeliveries ?? 0} delivered
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            {overview?.failedDeliveries ?? 0} failed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* WISHES OVER TIME */}
        <ChartCard title="Wishes over time" icon={Send} className="lg:col-span-2">
          {hasTimeline ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={wishData.wishesOverTime}>
                <defs>
                  <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c2fe0" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7c2fe0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0f7" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #f1f0f7", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="sent" name="Sent" stroke="#7c2fe0" strokeWidth={2.5} fill="url(#sentGradient)" />
                <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#22c55e" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="No wishes sent yet — activity will show up here." />
          )}
        </ChartCard>

        {/* BIRTHDAY VS ANNIVERSARY */}
        <ChartCard title="Birthday vs Anniversary" icon={Cake}>
          {hasOccasionData ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={wishData.occasionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {wishData.occasionBreakdown.map((entry, i) => (
                    <Cell key={entry.name} fill={OCCASION_COLORS[i % OCCASION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f1f0f7", fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="No occasion data yet." />
          )}
        </ChartCard>
      </div>

      {/* CHANNEL DISTRIBUTION */}
      <ChartCard title="Channel distribution" icon={Mail}>
        {hasChannelData ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={channels} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f0f7" />
              <XAxis dataKey="channel" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => v[0].toUpperCase() + v.slice(1)} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f1f0f7", fontSize: 13 }} />
              <Bar dataKey="total" name="Total" radius={[8, 8, 0, 0]}>
                {channels.map((c) => (
                  <Cell key={c.channel} fill={CHANNEL_COLORS[c.channel]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart text="No channel activity yet — send a wish to see the breakdown." />
        )}
      </ChartCard>
    </div>
  );
};

export default Analytics;

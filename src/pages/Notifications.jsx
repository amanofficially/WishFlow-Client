import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Bell, CheckCheck, X } from "lucide-react";
import api from "../services/api";
import Pagination from "../components/Pagination";
import { resolveNotificationIcon, TONE_CLASSES } from "../utils/notificationIcons";
import { CHANNEL_META } from "../utils/occasion";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-4 sm:px-5 py-4 animate-pulse">
    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/2 bg-gray-100 dark:bg-slate-800 rounded" />
      <div className="h-2.5 w-1/3 bg-gray-100 dark:bg-slate-800 rounded" />
    </div>
  </div>
);

// Shows which channels an occasion went out on and how each one landed —
// one notification, all channels, instead of a separate notification per
// channel (e.g. "Email delivered · WhatsApp failed" on a single row).
const ChannelChips = ({ channels }) => {
  if (!channels?.length) return null;
  return (
    <div className="flex items-center gap-1.5 mt-2">
      {channels.map(({ channel, status }) => {
        const ChannelIcon = CHANNEL_META[channel]?.icon;
        if (!ChannelIcon) return null;
        const ok = status === "delivered" || status === "sent";
        return (
          <span
            key={channel}
            title={`${CHANNEL_META[channel]?.label}: ${status}`}
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full ${
              ok
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            <ChannelIcon className="w-3 h-3" />
            {CHANNEL_META[channel]?.label}
          </span>
        );
      })}
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, unreadCount: 0 });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications", { params: { page, limit: 20 } });
      setNotifications(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("Couldn't load notifications");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch {
      toast.error("Couldn't update this notification");
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put("/notifications/read-all");
      toast.success("All caught up");
    } catch {
      toast.error("Couldn't mark everything as read");
    }
  };

  const remove = async (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      toast.error("Couldn't delete this notification");
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Notifications</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {meta.unreadCount > 0 ? `${meta.unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:border-brand-500/50 dark:hover:text-brand-300 transition-colors shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-14 px-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            </div>
            <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">No notifications yet</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              WishFlow will let you know here when a wish goes out, fails, or a celebration is coming up.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            <AnimatePresence initial={false}>
              {notifications.map((n) => {
                const { icon: Icon, tone } = resolveNotificationIcon(n.icon);
                return (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => !n.read && markRead(n._id)}
                    className={`flex items-start gap-3 px-4 sm:px-5 py-4 group cursor-pointer transition-colors ${
                      n.read ? "" : "bg-brand-50/40 dark:bg-brand-500/[0.06]"
                    } hover:bg-brand-50 dark:hover:bg-brand-500/10/60 dark:hover:bg-brand-500/10`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                      <ChannelChips channels={n.channels} />
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5">{formatDateTime(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-gradient shrink-0 mt-1.5" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(n._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
    </div>
  );
};

export default Notifications;

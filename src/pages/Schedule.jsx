import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Ban, PlayCircle, CalendarClock, Cake, Heart } from "lucide-react";
import api from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { relativeLabel, CHANNEL_META } from "../utils/occasion";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Scheduled" },
  { key: "sent", label: "Sent" },
  { key: "failed", label: "Failed" },
  { key: "cancelled", label: "Cancelled" },
];

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-4 sm:px-5 py-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-slate-800 rounded" />
      <div className="h-2.5 w-1/4 bg-gray-100 dark:bg-slate-800 rounded" />
    </div>
    <div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-full" />
  </div>
);

const Schedule = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/schedule");
      setItems(res.data.data);
    } catch {
      toast.error("Couldn't load your schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const visible = items.filter((item) => filter === "all" || item.status === filter);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setBusyId(cancelTarget.id);
    try {
      await api.delete(`/schedule/${cancelTarget.contactId}/${cancelTarget.occasionType}`);
      toast.success(`Automation paused for ${cancelTarget.recipient}`);
      setCancelTarget(null);
      fetchSchedule();
    } catch {
      toast.error("Couldn't cancel this automation");
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (item) => {
    setBusyId(item.id);
    try {
      await api.patch(`/schedule/${item.contactId}/${item.occasionType}/reactivate`);
      toast.success(`Automation resumed for ${item.recipient}`);
      fetchSchedule();
    } catch {
      toast.error("Couldn't resume this automation");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Schedule</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Every wish WishFlow has lined up for the next 60 days.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 mb-6 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors ${
              filter === f.key
                ? "bg-brand-gradient text-white border-transparent shadow-brand"
                : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-14 px-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            </div>
            <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">Nothing scheduled here</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Add birthdays and anniversaries to your contacts and enable automation — they'll show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                    {item.occasionType === "birthday" ? <Cake className="w-[18px] h-[18px]" /> : <Heart className="w-[18px] h-[18px]" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{item.recipient}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">
                      {item.occasionType} • {relativeLabel(item.date)} at {item.sendTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.channels?.map((ch) => {
                    const ChannelIcon = CHANNEL_META[ch]?.icon;
                    if (!ChannelIcon) return null;
                    return (
                      <span
                        key={ch}
                        title={CHANNEL_META[ch]?.label}
                        className="w-6 h-6 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 flex items-center justify-center"
                      >
                        <ChannelIcon className="w-3.5 h-3.5" />
                      </span>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 dark:text-slate-500 shrink-0 hidden md:block w-36 truncate">{item.template}</p>

                <div className="shrink-0">
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex items-center gap-1 shrink-0 justify-end">
                  {busyId === item.id ? (
                    <Loader2 className="w-4 h-4 text-gray-300 dark:text-slate-600 animate-spin" />
                  ) : item.automationEnabled ? (
                    <button
                      onClick={() => setCancelTarget(item)}
                      title="Cancel automation"
                      className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(item)}
                      title="Resume automation"
                      className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title={`Cancel automation for ${cancelTarget?.recipient}?`}
        message="WishFlow will stop sending this automatic wish. You can turn it back on anytime from here or from Contacts."
        confirmLabel="Cancel automation"
        loading={busyId === cancelTarget?.id}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default Schedule;

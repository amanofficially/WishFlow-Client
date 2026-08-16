// Upcoming Occasions (spec section 6 sidebar item). Distinct from the
// Schedule page: Schedule shows queued/sent wish DELIVERY jobs, this page
// shows every contact's upcoming birthday/anniversary DATE, regardless of
// whether a wish has been scheduled yet — a simple "who's coming up".

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CalendarClock, Sparkles, PauseCircle } from "lucide-react";
import api from "../services/api";
import FilterChips from "../components/FilterChips";
import { CHANNEL_META } from "../utils/occasion";
import { OCCASION_META } from "../utils/templates";

const RANGE_OPTIONS = [
  { key: "7", label: "Next 7 days" },
  { key: "30", label: "Next 30 days" },
  { key: "90", label: "Next 90 days" },
];

const dayLabel = (daysAway) => {
  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `In ${daysAway} days`;
};

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-4 sm:px-5 py-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-slate-800 rounded" />
      <div className="h-2.5 w-1/4 bg-gray-100 dark:bg-slate-800 rounded" />
    </div>
    <div className="h-6 w-16 bg-gray-100 dark:bg-slate-800 rounded-full" />
  </div>
);

const Upcoming = () => {
  const [range, setRange] = useState("30");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcoming = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/contacts/upcoming", { params: { days: range, limit: 100 } });
      setItems(res.data.data);
    } catch {
      toast.error("Couldn't load upcoming occasions");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">
            Upcoming Occasions
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Every birthday and anniversary coming up, at a glance.
          </p>
        </div>
      </div>

      <FilterChips options={RANGE_OPTIONS} active={range} onChange={setRange} />

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-14 px-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            </div>
            <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">
              Nothing coming up
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              No birthdays or anniversaries in the selected range. Try a wider window, or add a contact.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {items.map((item, i) => {
              const OccasionIcon = OCCASION_META[item.occasionType]?.icon;
              const isSoon = item.daysAway <= 1;
              return (
                <motion.div
                  key={`${item.contactId}-${item.occasionType}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                      {OccasionIcon && <OccasionIcon className="w-[18px] h-[18px]" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">
                        {item.occasionType} · {item.relationship}
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

                  <div className="flex items-center gap-2 shrink-0">
                    {item.enabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3" /> Automated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                        <PauseCircle className="w-3 h-3" /> Manual
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isSoon
                          ? "bg-brand-gradient text-white"
                          : "bg-gray-50 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400"
                      }`}
                    >
                      {dayLabel(item.daysAway)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;

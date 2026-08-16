import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Search, RotateCcw, Loader2, History } from "lucide-react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import FilterChips from "../components/FilterChips";
import Pagination from "../components/Pagination";
import { CHANNEL_META } from "../utils/occasion";
import { OCCASION_META } from "../utils/templates";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "delivered", label: "Delivered" },
  { key: "failed", label: "Failed" },
  { key: "processing", label: "Processing" },
];

const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-4 sm:px-5 py-4 animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-100 dark:bg-slate-800 rounded" />
      <div className="h-2.5 w-1/4 bg-gray-100 dark:bg-slate-800 rounded" />
    </div>
    <div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-full" />
  </div>
);

// One channel's outcome inside a grouped wish row — icon colored by
// delivered/failed, with an inline retry button when it failed.
const ChannelPill = ({ entry, onRetry, retrying }) => {
  const ChannelIcon = CHANNEL_META[entry.channel]?.icon;
  const ok = entry.status === "delivered" || entry.status === "sent";
  const failed = entry.status === "failed";

  return (
    <span
      title={`${CHANNEL_META[entry.channel]?.label}: ${entry.status}${entry.errorMessage ? ` — ${entry.errorMessage}` : ""}`}
      className={`inline-flex items-center gap-1.5 text-xs font-medium pl-2 pr-1 py-1 rounded-full ${
        ok
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : failed
          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      {ChannelIcon && <ChannelIcon className="w-3.5 h-3.5" />}
      {CHANNEL_META[entry.channel]?.label}
      {failed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRetry(entry);
          }}
          disabled={retrying}
          title="Retry this channel"
          className="ml-0.5 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {retrying ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
};

const SentWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 });
  const [retryingId, setRetryingId] = useState(null);

  const fetchWishes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/wishes", { params: { search, status, page, limit: 15 } });
      setWishes(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("Couldn't load your sent wishes");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(fetchWishes, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  useEffect(() => setPage(1), [search, status]);

  const handleRetry = async (wishGroup, channelEntry) => {
    setRetryingId(channelEntry._id);
    try {
      const res = await api.post(`/wishes/${channelEntry._id}/retry`);
      if (res.data.data.status === "delivered") {
        toast.success(`Resent to ${wishGroup.contactName} via ${CHANNEL_META[channelEntry.channel]?.label}`);
      } else {
        toast.error(`Retry failed for ${wishGroup.contactName}`);
      }
      fetchWishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't retry this wish");
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Sent Wishes</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{meta.total} wishes in your history</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 input-focus-ring outline-none text-sm transition-all"
          />
        </div>
      </div>

      <FilterChips options={STATUS_FILTERS} active={status} onChange={setStatus} />

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-14 px-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            </div>
            <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">No wishes sent yet</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Once WishFlow sends a wish — automatically or on retry — it'll show up here with full delivery details.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800">
            {wishes.map((wish, i) => {
              const OccasionIcon = OCCASION_META[wish.occasionType]?.icon;
              const groupKey = `${wish.contactId}-${wish.occasionType}-${wish.occasionYear}`;
              return (
                <motion.div
                  key={groupKey}
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
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{wish.contactName}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {formatDateTime(wish.latestActivity)} · {wish.occasionYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {wish.channels.map((entry) => (
                      <ChannelPill
                        key={entry._id}
                        entry={entry}
                        onRetry={(e) => handleRetry(wish, e)}
                        retrying={retryingId === entry._id}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 dark:text-slate-500 shrink-0 hidden md:block w-36 truncate">{wish.templateName}</p>

                  <div className="shrink-0">
                    <StatusBadge status={wish.overallStatus} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
    </div>
  );
};

export default SentWishes;

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Mail, MessageCircle, Smartphone } from "lucide-react";
import api from "../../services/api";
import Pagination from "../../components/Pagination";

const CHANNEL_ICON = { email: Mail, whatsapp: MessageCircle, sms: Smartphone };
const STATUSES = ["", "pending", "processing", "sent", "delivered", "failed", "cancelled"];
const CHANNELS = ["", "email", "whatsapp", "sms"];

// A small local badge instead of the shared StatusBadge component: that
// one relies on Tailwind's `dark:` variant, which only activates when the
// app-wide theme toggle (Settings > Appearance) is set to dark. The admin
// panel is unconditionally dark-styled regardless of that per-user
// preference, so it needs its own colors rather than ones that would
// silently turn pale/unreadable for an admin using light mode elsewhere.
const STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-400",
  processing: "bg-amber-500/10 text-amber-400",
  sent: "bg-emerald-500/10 text-emerald-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  failed: "bg-red-500/10 text-red-400",
  cancelled: "bg-slate-800 text-slate-400",
};
const AdminStatusBadge = ({ status }) => (
  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] || "bg-slate-800 text-slate-400"}`}>
    {status}
  </span>
);


const AdminWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchWishes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/wishes", { params: { status, channel, page, limit: 20 } });
      setWishes(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Couldn't load wish logs");
    } finally {
      setLoading(false);
    }
  }, [status, channel, page]);

  useEffect(() => { fetchWishes(); }, [fetchWishes]);
  useEffect(() => setPage(1), [status, channel]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100">Wish Logs</h1>
        <p className="text-slate-500 text-sm">{pagination.total} wishes across every account</p>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}</option>)}
        </select>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          {CHANNELS.map((c) => <option key={c} value={c}>{c ? c[0].toUpperCase() + c.slice(1) : "All channels"}</option>)}
        </select>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Sender</th>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Occasion</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center"><Loader2 className="w-5 h-5 text-brand-400 animate-spin mx-auto" /></td></tr>
              ) : wishes.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No wishes match these filters.</td></tr>
              ) : (
                wishes.map((w) => {
                  const ChannelIcon = CHANNEL_ICON[w.channel] || Mail;
                  return (
                    <tr key={w._id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/60">
                      <td className="px-4 py-3">
                        <p className="text-slate-200 truncate max-w-[160px]">{w.userId?.name || "Deleted user"}</p>
                        <p className="text-slate-500 text-xs truncate max-w-[160px]">{w.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{w.contactName}</td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{w.occasionType.replace("_", " ")}</td>
                      <td className="px-4 py-3 text-slate-400">
                        <span className="flex items-center gap-1.5 capitalize"><ChannelIcon className="w-3.5 h-3.5" /> {w.channel}</span>
                      </td>
                      <td className="px-4 py-3"><AdminStatusBadge status={w.status} /></td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{new Date(w.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
    </div>
  );
};

export default AdminWishes;

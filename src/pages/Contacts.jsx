import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, Users2, Cake, Heart, CalendarDays, CalendarClock, Calendar, Sparkles, PauseCircle } from "lucide-react";
import api from "../services/api";
import ContactCard from "../components/ContactCard";
import ContactFormModal from "../components/ContactFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import FilterChips from "../components/FilterChips";
import Pagination from "../components/Pagination";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "birthdays", label: "Birthdays", icon: Cake },
  { key: "anniversaries", label: "Anniversaries", icon: Heart },
  { key: "today", label: "Today", icon: CalendarDays },
  { key: "week", label: "This Week", icon: CalendarClock },
  { key: "month", label: "This Month", icon: Calendar },
  { key: "automationOn", label: "Automation On", icon: Sparkles },
  { key: "automationOff", label: "Automation Off", icon: PauseCircle },
];

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 bg-gray-100 dark:bg-slate-800 rounded" />
        <div className="h-2.5 w-1/3 bg-gray-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
    <div className="h-6 w-24 bg-gray-100 dark:bg-slate-800 rounded-full mb-3" />
    <div className="h-2.5 w-3/4 bg-gray-100 dark:bg-slate-800 rounded" />
  </div>
);

const Contacts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // If someone arrives here with ?search=... (e.g. from the header search
  // bar) after the page is already mounted, pick that up too.
  useEffect(() => {
    const fromUrl = searchParams.get("search") || "";
    if (fromUrl !== search) setSearch(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/contacts", {
        params: { search, filter, page, limit: 12 },
      });
      setContacts(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("Couldn't load your contacts");
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    const t = setTimeout(fetchContacts, search ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter, page]);

  useEffect(() => setPage(1), [search, filter]);

  const handleSearchChange = (value) => {
    setSearch(value);
    // Keep the URL in sync so the search is shareable/bookmarkable and
    // survives a refresh, without adding a history entry per keystroke.
    setSearchParams(value ? { search: value } : {}, { replace: true });
  };

  const openAdd = () => {
    setEditingContact(null);
    setModalOpen(true);
  };
  const openEdit = (contact) => {
    setEditingContact(contact);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/contacts/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name} was removed`);
      setDeleteTarget(null);
      fetchContacts();
    } catch {
      toast.error("Couldn't delete this contact");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Contacts</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {meta.total} {meta.total === 1 ? "person" : "people"} WishFlow is remembering for you
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-gradient flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 input-focus-ring outline-none text-sm transition-all"
          />
        </div>
      </div>

      <FilterChips options={FILTERS} active={filter} onChange={setFilter} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-10 sm:p-14 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
            {search || filter !== "all" ? (
              <Users2 className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            ) : (
              <Cake className="w-7 h-7 text-brand-500 dark:text-brand-300" />
            )}
          </div>
          <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">
            {search || filter !== "all" ? "No contacts match" : "Your birthday list is waiting"}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-5 max-w-sm mx-auto">
            {search || filter !== "all"
              ? "Try a different search term or filter."
              : "Add your first contact and let WishFlow remember their special day."}
          </p>
          {!search && filter === "all" && (
            <button onClick={openAdd} className="btn-gradient px-5 py-2.5 rounded-xl font-medium inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Contact
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((c, i) => (
              <ContactCard key={c._id} contact={c} index={i} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>

          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
        </>
      )}

      <ContactFormModal
        open={modalOpen}
        contact={editingContact}
        onClose={() => setModalOpen(false)}
        onSaved={fetchContacts}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${deleteTarget?.name}?`}
        message="This removes them from WishFlow permanently. Any scheduled automatic wishes for this person will stop."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Contacts;

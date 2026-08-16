import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, FileText, Search, LayoutGrid } from "lucide-react";
import api from "../services/api";
import TemplateCard from "../components/TemplateCard";
import TemplateFormModal from "../components/TemplateFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { OCCASION_META } from "../utils/templates";

const OCCASION_TABS = ["all", "birthday", "anniversary", "festival", "work_anniversary", "custom"];

const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 animate-pulse">
    <div className="h-4 w-1/2 bg-gray-100 dark:bg-slate-800 rounded mb-3" />
    <div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl mb-3" />
    <div className="h-8 bg-gray-100 dark:bg-slate-800 rounded-lg" />
  </div>
);

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/templates", {
        params: tab === "all" ? {} : { occasionType: tab },
      });
      setTemplates(res.data.data);
    } catch {
      toast.error("Couldn't load templates");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filtered = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [templates, search]);

  const openCreate = () => {
    setEditingTemplate(null);
    setModalOpen(true);
  };
  const openEdit = (t) => {
    setEditingTemplate(t);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/templates/${deleteTarget._id}`);
      toast.success(`"${deleteTarget.name}" was deleted`);
      setDeleteTarget(null);
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't delete this template");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Templates</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Create a message that sounds like you.</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-gradient flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 input-focus-ring outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 mb-6 -mx-1 px-1">
        {OCCASION_TABS.map((key) => {
          const meta = key === "all" ? { label: "All", icon: LayoutGrid } : OCCASION_META[key];
          const Icon = meta.icon;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors flex items-center gap-1.5 ${
                tab === key
                  ? "bg-brand-gradient text-white border-transparent shadow-brand"
                  : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {meta.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-10 sm:p-14 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient-soft dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-brand-500 dark:text-brand-300" />
          </div>
          <h3 className="font-display font-semibold text-gray-800 dark:text-slate-100 mb-1.5">
            {search ? "No templates match" : "Create a message that sounds like you."}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-5 max-w-sm mx-auto">
            {search ? "Try a different search term." : "Design a custom template with your own words and tone."}
          </p>
          {!search && (
            <button onClick={openCreate} className="btn-gradient px-5 py-2.5 rounded-xl font-medium inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Template
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <TemplateCard key={t._id} template={t} index={i} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <TemplateFormModal
        open={modalOpen}
        template={editingTemplate}
        onClose={() => setModalOpen(false)}
        onSaved={fetchTemplates}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name}"?`}
        message="Contacts that already use this template keep a saved snapshot, so their scheduled wishes won't break."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Templates;

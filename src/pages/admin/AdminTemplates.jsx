import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Globe, User as UserIcon, X } from "lucide-react";
import api from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog";

const OCCASIONS = ["birthday", "anniversary", "festival", "work_anniversary", "custom"];

const emptyForm = { name: "", occasionType: "birthday", category: "", message: "", description: "" };

const TemplateModal = ({ open, initial, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
  }, [open, initial]);

  if (!open) return null;

  const save = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.message.trim()) {
      toast.error("Name, category, and message are required.");
      return;
    }
    setSaving(true);
    try {
      if (initial?._id) {
        await api.put(`/admin/templates/${initial._id}`, form);
        toast.success("Template updated.");
      } else {
        await api.post("/admin/templates", form);
        toast.success("Global template created.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-slate-100 text-lg">
            {initial?._id ? "Edit template" : "New global template"}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Occasion type</label>
              <select
                value={form.occasionType}
                onChange={(e) => setForm((f) => ({ ...f, occasionType: e.target.value }))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                {OCCASIONS.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Classic"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={5}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <p className="text-[11px] text-slate-600 mt-1">Variables: {"{name} {sender_name} {relationship} {occasion}"}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description (optional)</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-brand-gradient text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save template
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/templates");
      setTemplates(res.data.data);
    } catch {
      toast.error("Couldn't load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/templates/${deleteTarget._id}`);
      toast.success("Template deleted.");
      setDeleteTarget(null);
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete template");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100">Templates</h1>
          <p className="text-slate-500 text-sm">Global defaults every user sees, plus every user-created template</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-brand-gradient text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-brand hover:opacity-95 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" /> New global template
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-400 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-slate-200 font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.occasionType.replace("_", " ")} · {t.category}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 shrink-0 ${t.isDefault ? "bg-brand-500/10 text-brand-300" : "bg-slate-800 text-slate-400"}`}>
                  {t.isDefault ? <><Globe className="w-3 h-3" /> Global</> : <><UserIcon className="w-3 h-3" /> {t.userId?.name || "User"}</>}
                </span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-3 whitespace-pre-line mb-3">{t.message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(t); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={fetchTemplates}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="If this is a global template, it disappears for every user who hasn't already used it on a contact."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminTemplates;

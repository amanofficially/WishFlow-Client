import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search, Loader2, ShieldCheck, ShieldOff, Trash2, MoreVertical,
  CheckCircle2, XCircle,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";

const ROLE_FILTERS = [
  { key: "", label: "All roles" },
  { key: "user", label: "User" },
  { key: "admin", label: "Admin" },
];
const STATUS_FILTERS = [
  { key: "", label: "All statuses" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "unverified", label: "Unverified" },
];

// Small inline reason prompt used before suspending someone — kept as a
// lightweight dialog rather than a full modal since it's a single field.
const SuspendDialog = ({ open, name, onCancel, onConfirm, loading }) => {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (open) setReason("");
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onCancel} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <h3 className="font-display font-bold text-slate-100 text-lg mb-1.5">Suspend {name}?</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          They'll be signed out everywhere and blocked from logging back in until reinstated.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional, shown to the user)"
          rows={3}
          className="w-full mb-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
};

const RowMenu = ({ u, currentUserId, onPromote, onDemote, onSuspend, onReinstate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const isSelf = String(u._id) === String(currentUserId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-20 py-1 text-sm">
            {u.role === "admin" ? (
              <button
                disabled={isSelf}
                onClick={() => { setOpen(false); onDemote(u); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShieldOff className="w-4 h-4" /> Remove admin access
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); onPromote(u); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:bg-slate-800"
              >
                <ShieldCheck className="w-4 h-4" /> Make admin
              </button>
            )}
            {u.isActive ? (
              <button
                disabled={isSelf}
                onClick={() => { setOpen(false); onSuspend(u); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-amber-400 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4" /> Suspend account
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); onReinstate(u); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-emerald-400 hover:bg-slate-800"
              >
                <CheckCircle2 className="w-4 h-4" /> Reinstate account
              </button>
            )}
            <div className="my-1 border-t border-slate-800" />
            <button
              disabled={isSelf}
              onClick={() => { setOpen(false); onDelete(u); }}
              className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" /> Delete account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", { params: { search, role, status, page, limit: 15 } });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Couldn't load users");
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers, search]);

  useEffect(() => setPage(1), [search, role, status]);

  const setRoleFor = async (u, newRole) => {
    setBusyId(u._id);
    try {
      const res = await api.patch(`/admin/users/${u._id}/role`, { role: newRole });
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update role");
    } finally {
      setBusyId(null);
    }
  };

  const reinstate = async (u) => {
    setBusyId(u._id);
    try {
      const res = await api.patch(`/admin/users/${u._id}/status`, { isActive: true });
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't update account");
    } finally {
      setBusyId(null);
    }
  };

  const confirmSuspend = async (reason) => {
    if (!suspendTarget) return;
    setBusyId(suspendTarget._id);
    try {
      const res = await api.patch(`/admin/users/${suspendTarget._id}/status`, { isActive: false, reason });
      toast.success(res.data.message);
      setSuspendTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't suspend account");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget._id);
    try {
      const res = await api.delete(`/admin/users/${deleteTarget._id}`);
      toast.success(res.data.message);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete account");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100">Users</h1>
        <p className="text-slate-500 text-sm">{pagination.total} account{pagination.total === 1 ? "" : "s"} registered</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          {ROLE_FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          {STATUS_FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center"><Loader2 className="w-5 h-5 text-brand-400 animate-spin mx-auto" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No users match these filters.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.profileImage ? <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" /> : u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-200 font-medium truncate">{u.name}</p>
                          <p className="text-slate-500 text-xs truncate">{u.email}</p>
                        </div>
                        {!u.emailVerified && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 shrink-0">Unverified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === "admin" ? "bg-brand-500/10 text-brand-300" : "bg-slate-800 text-slate-400"}`}>
                        {u.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {busyId === u._id ? (
                        <Loader2 className="w-4 h-4 text-brand-400 animate-spin ml-auto" />
                      ) : (
                        <RowMenu
                          u={u}
                          currentUserId={currentUser?.id}
                          onPromote={(u) => setRoleFor(u, "admin")}
                          onDemote={(u) => setRoleFor(u, "user")}
                          onSuspend={setSuspendTarget}
                          onReinstate={reinstate}
                          onDelete={setDeleteTarget}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />

      <SuspendDialog
        open={!!suspendTarget}
        name={suspendTarget?.name}
        loading={busyId === suspendTarget?._id}
        onCancel={() => setSuspendTarget(null)}
        onConfirm={confirmSuspend}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name}?`}
        message="This permanently removes their account, contacts, templates, and wish history. This can't be undone."
        confirmLabel="Delete permanently"
        loading={busyId === deleteTarget?._id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminUsers;

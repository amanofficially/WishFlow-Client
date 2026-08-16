// Settings page (spec section 26) — five sections: Account, Automation,
// Notifications, Security, Appearance. Each section saves independently so
// a change in one area doesn't require re-submitting the whole page.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User as UserIcon, Lock, Sparkles, Bell, ShieldCheck, Palette, Loader2, Save,
  Monitor, Sun, Moon, LogOut, Smartphone as DeviceIcon, KeyRound, ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import FormField from "../components/FormField";
import Toggle from "../components/Toggle";
import { COMMON_TIMEZONES } from "../utils/timezones";

const SectionCard = ({ icon: Icon, title, description, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6"
  >
    <div className="flex items-center gap-2.5 mb-1">
      <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-300" />
      </span>
      <h2 className="font-display font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
    </div>
    {description && <p className="text-xs text-gray-400 dark:text-slate-500 mb-4 ml-[42px]">{description}</p>}
    <div className={description ? "" : "mt-4"}>{children}</div>
  </motion.section>
);

const selectClass =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-[15px] input-focus-ring outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const theme = useTheme();

  // --- Account ---
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingAccount, setSavingAccount] = useState(false);

  // --- Automation ---
  const [automation, setAutomation] = useState({
    automationEnabled: true,
    birthdayAutomation: true,
    anniversaryAutomation: true,
    defaultSendTime: "09:00",
    defaultTimezone: "Asia/Kolkata",
    sendOnSameDay: true,
    sendOneDayBefore: false,
  });
  const [savingAutomation, setSavingAutomation] = useState(false);

  // --- Notifications ---
  const [notifications, setNotifications] = useState({
    birthdayReminders: true,
    anniversaryReminders: true,
    deliveryNotifications: true,
    failedDeliveryAlerts: true,
    weeklySummary: false,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  // --- Security ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    if (user.settings) {
      setAutomation((prev) => ({ ...prev, ...user.settings }));
      setNotifications((prev) => ({ ...prev, ...user.settings.notifications }));
      setTwoFactorEnabled(Boolean(user.settings.security?.twoFactorEnabled));
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/auth/sessions")
      .then((res) => setSessions(res.data.data))
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, []);

  const saveAccount = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const res = await api.put("/auth/profile", { name, phone });
      updateUser(res.data.data);
      toast.success("Account details saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save account details");
    } finally {
      setSavingAccount(false);
    }
  };

  const saveSettings = async (patch) => {
    try {
      const res = await api.patch("/auth/settings", { settings: patch });
      updateUser(res.data.data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save that setting");
      return false;
    }
  };

  const saveAutomation = async (e) => {
    e.preventDefault();
    setSavingAutomation(true);
    const ok = await saveSettings(automation);
    if (ok) toast.success("Automation settings saved");
    setSavingAutomation(false);
  };

  const toggleNotification = async (key, value) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    const ok = await saveSettings({ notifications: next });
    if (!ok) setNotifications(notifications); // revert on failure
  };

  const saveNotifications = async (e) => {
    e.preventDefault();
    setSavingNotifications(true);
    const ok = await saveSettings({ notifications });
    if (ok) toast.success("Notification preferences saved");
    setSavingNotifications(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't change your password");
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleTwoFactor = async (value) => {
    setTwoFactorEnabled(value);
    try {
      await api.patch("/auth/settings", { settings: { security: { twoFactorEnabled: value } } });
      toast.success(value ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch {
      setTwoFactorEnabled(!value);
      toast.error("Couldn't update two-factor authentication");
    }
  };

  const revokeSession = async (id) => {
    try {
      await api.delete(`/auth/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Device signed out");
    } catch {
      toast.error("Couldn't sign out that device");
    }
  };

  const logoutAllDevices = async () => {
    setLoggingOutAll(true);
    try {
      await api.post("/auth/logout-all");
      toast.success("Signed out of all devices");
      window.location.href = "/login";
    } catch {
      toast.error("Couldn't log out of all devices");
      setLoggingOutAll(false);
    }
  };

  const appearanceOptions = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ];

  const selectAppearance = async (key) => {
    theme?.setMode(key);
    await saveSettings({ appearance: { theme: key } });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Settings</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Control how WishFlow works for your account.</p>
      </div>

      {/* ACCOUNT */}
      <SectionCard icon={UserIcon} title="Account">
        <form onSubmit={saveAccount} className="space-y-3.5">
          <FormField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <FormField label="Email" value={user?.email || ""} disabled className="disabled:opacity-70" />
          <FormField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button
            type="submit"
            disabled={savingAccount}
            className="btn-gradient px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            {savingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save account
          </button>
        </form>
      </SectionCard>

      {/* AUTOMATION */}
      <SectionCard icon={Sparkles} title="Automation" description="Defaults applied to new contacts and occasions.">
        <form onSubmit={saveAutomation} className="space-y-1">
          <Toggle
            label="Auto-Pilot"
            description="Master switch — pauses every automatic wish for your account."
            checked={automation.automationEnabled}
            onChange={(v) => setAutomation((p) => ({ ...p, automationEnabled: v }))}
          />
          <Toggle
            label="Birthday automation"
            checked={automation.birthdayAutomation}
            onChange={(v) => setAutomation((p) => ({ ...p, birthdayAutomation: v }))}
          />
          <Toggle
            label="Anniversary automation"
            checked={automation.anniversaryAutomation}
            onChange={(v) => setAutomation((p) => ({ ...p, anniversaryAutomation: v }))}
          />
          <Toggle
            label="Send one day before"
            description="Get a reminder the day before, in addition to same-day sending."
            checked={automation.sendOneDayBefore}
            onChange={(v) => setAutomation((p) => ({ ...p, sendOneDayBefore: v }))}
          />
          <Toggle
            label="Send on the same day"
            checked={automation.sendOnSameDay}
            onChange={(v) => setAutomation((p) => ({ ...p, sendOnSameDay: v }))}
          />

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Default send time</label>
              <input
                type="time"
                value={automation.defaultSendTime}
                onChange={(e) => setAutomation((p) => ({ ...p, defaultSendTime: e.target.value }))}
                className={selectClass}
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Default timezone</label>
              <select
                value={automation.defaultTimezone}
                onChange={(e) => setAutomation((p) => ({ ...p, defaultTimezone: e.target.value }))}
                className={selectClass}
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingAutomation}
            className="btn-gradient mt-4 px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            {savingAutomation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save automation
          </button>
        </form>
      </SectionCard>

      {/* NOTIFICATIONS */}
      <SectionCard icon={Bell} title="Notifications" description="What shows up in your in-app notification center.">
        <form onSubmit={saveNotifications} className="space-y-1">
          <Toggle
            label="Birthday reminders"
            checked={notifications.birthdayReminders}
            onChange={(v) => toggleNotification("birthdayReminders", v)}
          />
          <Toggle
            label="Anniversary reminders"
            checked={notifications.anniversaryReminders}
            onChange={(v) => toggleNotification("anniversaryReminders", v)}
          />
          <Toggle
            label="Delivery notifications"
            checked={notifications.deliveryNotifications}
            onChange={(v) => toggleNotification("deliveryNotifications", v)}
          />
          <Toggle
            label="Failed delivery alerts"
            checked={notifications.failedDeliveryAlerts}
            onChange={(v) => toggleNotification("failedDeliveryAlerts", v)}
          />
          <Toggle
            label="Weekly summary"
            checked={notifications.weeklySummary}
            onChange={(v) => toggleNotification("weeklySummary", v)}
          />
          <p className="text-[11px] text-gray-400 dark:text-slate-500 pt-2">Each toggle saves instantly.</p>
        </form>
      </SectionCard>

      {/* SECURITY */}
      <SectionCard icon={ShieldCheck} title="Security">
        <div className="space-y-6">
          <form onSubmit={changePassword} className="space-y-3.5">
            <p className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Change password
            </p>
            <FormField
              type="password"
              placeholder="Current password"
              icon={Lock}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <FormField
              type="password"
              placeholder="New password"
              icon={Lock}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormField
              type="password"
              placeholder="Confirm new password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={changingPassword}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:border-brand-300 dark:hover:border-brand-500/50 inline-flex items-center gap-2 disabled:opacity-60 transition-colors"
            >
              {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <Toggle
              label="Two-factor authentication"
              description="Adds an extra verification step at login."
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
            />
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <p className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <DeviceIcon className="w-3.5 h-3.5" /> Active sessions
            </p>
            {sessionsLoading ? (
              <div className="py-4 flex justify-center text-gray-300 dark:text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-slate-500">No other active sessions.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">
                        {s.userAgent || "Unknown device"} {s.current && <span className="text-brand-600 dark:text-brand-300">(this device)</span>}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">
                        Last active {new Date(s.lastActiveAt).toLocaleString()}
                      </p>
                    </div>
                    {!s.current && (
                      <button
                        onClick={() => revokeSession(s.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 shrink-0"
                      >
                        Sign out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={logoutAllDevices}
              disabled={loggingOutAll}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-60"
            >
              {loggingOutAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Log out from all devices
            </button>
          </div>

          {!user?.emailVerified && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              Your email isn't verified yet — some features may be limited.
            </div>
          )}
        </div>
      </SectionCard>

      {/* APPEARANCE */}
      <SectionCard icon={Palette} title="Appearance">
        <div className="grid grid-cols-3 gap-3">
          {appearanceOptions.map((opt) => {
            const active = theme?.mode === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => selectAppearance(opt.key)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors ${
                  active
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-500/40"
                }`}
              >
                <opt.icon className={`w-5 h-5 ${active ? "text-brand-600 dark:text-brand-300" : "text-gray-400 dark:text-slate-500"}`} />
                <span className={`text-xs font-semibold ${active ? "text-brand-700 dark:text-brand-300" : "text-gray-500 dark:text-slate-400"}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

export default Settings;

// A labeled on/off switch row — used throughout Settings (automation
// toggles, notification preferences, 2FA architecture toggle). Keeping it
// as one component means every toggle in the app looks and behaves the
// same way, in both light and dark mode.

const Toggle = ({ label, description, checked, onChange, disabled = false }) => (
  <label
    className={`flex items-start justify-between gap-4 py-3 ${
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{label}</p>
      {description && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>}
    </div>
    <span className="relative inline-flex h-6 w-11 items-center shrink-0 mt-0.5">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-brand-gradient dark:bg-slate-700 transition-colors" />
      <span className="absolute left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform" />
    </span>
  </label>
);

export default Toggle;

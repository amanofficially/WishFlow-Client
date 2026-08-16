// Horizontal scrollable row of filter pills, in the same brand style used
// across the app. `options` is [{ key, label, icon? }]; `active` is the
// currently selected key.
const FilterChips = ({ options, active, onChange }) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 mb-6 -mx-1 px-1">
    {options.map((f) => (
      <button
        key={f.key}
        onClick={() => onChange(f.key)}
        className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors flex items-center gap-1.5 ${
          active === f.key
            ? "bg-brand-gradient text-white border-transparent shadow-brand"
            : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-300"
        }`}
      >
        {f.icon && <f.icon className="w-3.5 h-3.5" />}
        {f.label}
      </button>
    ))}
  </div>
);

export default FilterChips;

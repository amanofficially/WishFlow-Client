// Light / dark toggle. Used in both the dashboard Header and the public
// landing page navbar so the whole app — including marketing pages —
// respects the same appearance setting.

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const theme = useTheme();
  if (!theme) return null;
  const { resolvedTheme, toggle } = theme;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-brand-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 ${className}`}
    >
      <Sun
        className={`w-[18px] h-[18px] absolute transition-all duration-300 ${
          isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`w-[18px] h-[18px] absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;

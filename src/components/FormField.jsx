// Shared input wrapper used across every form in the app (auth, contacts,
// templates, profile, settings). Handles: optional label, left icon,
// optional right-side action (e.g. show/hide password), animated error
// message, hint text, and full light/dark styling — so every form in
// WishFlow looks and behaves the same way.

import { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

const FormField = forwardRef(function FormField(
  { icon: Icon, label, hint, error, rightSlot, as = "input", className = "", id, ...props },
  ref
) {
  const Component = as;
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div>
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-[13px] font-semibold text-gray-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
        )}
        <Component
          id={fieldId}
          ref={ref}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} ${
            rightSlot ? "pr-11" : "pr-4"
          } py-[11px] border rounded-xl outline-none transition-all duration-200 text-[15px] ${
            error
              ? "border-red-300 bg-red-50/40 focus:ring-4 focus:ring-red-100 focus:border-red-400 dark:border-red-500/50 dark:bg-red-500/5 dark:focus:ring-red-500/10"
              : "border-gray-200 bg-white/90 input-focus-ring hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-600"
          } text-gray-900 placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
          {...props}
        />
        {rightSlot && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-red-500 dark:text-red-400 text-xs font-medium flex items-center gap-1 overflow-hidden"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FormField;

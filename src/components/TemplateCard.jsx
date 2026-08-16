import { motion } from "framer-motion";
import { Pencil, Trash2, Star, Copy } from "lucide-react";
import { toast } from "sonner";
import { personalizeMessage, OCCASION_META, CATEGORY_COLORS } from "../utils/templates";

const TemplateCard = ({ template, index = 0, onEdit, onDelete, onUse }) => {
  const preview = personalizeMessage(template.message);
  const occasion = OCCASION_META[template.occasionType] || OCCASION_META.custom;
  const badgeColor = CATEGORY_COLORS[template.category] || "bg-gray-50 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400";

  const copyMessage = () => {
    navigator.clipboard.writeText(template.message);
    toast.success("Template copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 sm:p-5 hover:shadow-lg hover:border-brand-100 dark:hover:border-brand-500/30 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
            <occasion.icon className="w-[18px] h-[18px]" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate flex items-center gap-1.5">
              {template.name}
              {template.isDefault && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            </h3>
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${badgeColor}`}>
              {template.category}
            </span>
          </div>
        </div>

        {!template.isDefault && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(template)}
              className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(template)}
              className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-brand-gradient-soft dark:bg-slate-800/60 rounded-xl p-3.5 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed flex-1 mb-3 line-clamp-6">
        {preview}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={copyMessage}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
        {onUse && (
          <button
            onClick={() => onUse(template)}
            className="flex-1 text-xs font-semibold py-2 rounded-lg bg-brand-gradient text-white shadow-brand hover:shadow-brand-lg transition-shadow"
          >
            Use template
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateCard;

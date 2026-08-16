import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { X, Sparkles, Loader2, Save, Wand2, Eye, Cake, Heart, PartyPopper, Trophy } from "lucide-react";
import api from "../services/api";
import FormField from "./FormField";
import { AVAILABLE_VARIABLES, personalizeMessage } from "../utils/templates";

const OCCASION_OPTIONS = [
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "anniversary", label: "Anniversary", icon: Heart },
  { value: "festival", label: "Festival", icon: PartyPopper },
  { value: "work_anniversary", label: "Work Anniversary", icon: Trophy },
  { value: "custom", label: "Custom", icon: Sparkles },
];

const CATEGORY_OPTIONS = [
  "Classic", "Friendly", "Professional", "Heartfelt", "Short & Sweet",
  "Elegant", "Warm", "Short",
];

const buildDefaults = (t) => ({
  name: t?.name || "",
  occasionType: t?.occasionType || "birthday",
  category: t?.category || "Classic",
  message: t?.message || "",
  description: t?.description || "",
});

const selectClass =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-[15px] input-focus-ring outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all";

const TemplateFormModal = ({ open, onClose, onSaved, template }) => {
  const isEdit = Boolean(template?._id);
  const textareaRef = useRef(null);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: buildDefaults(template) });

  useEffect(() => {
    if (open) reset(buildDefaults(template));
  }, [open, template, reset]);

  const message = watch("message");
  const occasionType = watch("occasionType");
  const ActiveOccasionIcon = OCCASION_OPTIONS.find((o) => o.value === occasionType)?.icon || Sparkles;

  const insertVariable = (token) => {
    const el = textareaRef.current;
    if (!el) {
      setValue("message", `${message || ""}${token}`);
      return;
    }
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    const next = `${message.slice(0, start)}${token}${message.slice(end)}`;
    setValue("message", next, { shouldDirty: true });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await api.put(`/templates/${template._id}`, data);
        toast.success(`"${data.name}" was updated`);
      } else {
        await api.post("/templates", data);
        toast.success(`"${data.name}" is ready to use`);
      }
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save this template");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white dark:bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                </span>
                {isEdit ? "Edit template" : "Create template"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto scrollbar-thin px-5 sm:px-6 py-5 space-y-4">
              <FormField
                label="Template name"
                icon={Sparkles}
                placeholder="Warm Birthday Wish"
                error={errors.name?.message}
                {...register("name", { required: "Template name is required", minLength: { value: 2, message: "Too short" } })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <ActiveOccasionIcon className="w-3.5 h-3.5 text-brand-500 dark:text-brand-300" /> Occasion
                  </label>
                  <select {...register("occasionType")} className={selectClass}>
                    {OCCASION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Category</label>
                  <select {...register("category")} className={selectClass}>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <FormField
                label="Description (optional)"
                placeholder="A short, upbeat birthday message"
                {...register("description")}
              />

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">Message</label>
                <textarea
                  ref={(el) => {
                    textareaRef.current = el;
                    register("message", { required: "Message is required", minLength: { value: 5, message: "Too short" } }).ref(el);
                  }}
                  rows={6}
                  placeholder={"Happy Birthday, {name}!\n\nWishing you a wonderful day..."}
                  {...register("message", { required: "Message is required", minLength: { value: 5, message: "Too short" } })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-[15px] outline-none resize-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 ${
                    errors.message
                      ? "border-red-300 focus:ring-4 focus:ring-red-100 dark:border-red-500/50 dark:focus:ring-red-500/10"
                      : "border-gray-200 dark:border-slate-700 input-focus-ring"
                  }`}
                />
                {errors.message && <p className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5">{errors.message.message}</p>}

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIVE PREVIEW — spec section 16 */}
              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Live preview
                </label>
                <div className="bg-brand-gradient-soft dark:bg-slate-800/60 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-line leading-relaxed min-h-[64px]">
                  {message ? personalizeMessage(message) : (
                    <span className="text-gray-400 dark:text-slate-500">Start typing to see how it will look...</span>
                  )}
                </div>
              </div>
            </form>

            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Save className="w-[18px] h-[18px]" />}
                {isEdit ? "Save changes" : "Create template"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TemplateFormModal;

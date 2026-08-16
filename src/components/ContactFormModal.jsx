import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  User,
  Mail,
  Phone,
  Cake,
  Heart,
  Sparkles,
  Loader2,
  Save,
  StickyNote,
} from "lucide-react";
import api from "../services/api";
import FormField from "./FormField";
import {
  toMonthDayFromISO,
  RELATIONSHIP_META,
  CHANNEL_META,
} from "../utils/occasion";

const RELATIONSHIPS = Object.keys(RELATIONSHIP_META);
const CHANNELS = Object.keys(CHANNEL_META);

const emptyOccasion = {
  date: null,
  year: null,
  enabled: false,
  templateId: "",
  sendTime: "09:00",
  channels: ["email"],
};

const selectClass =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-[15px] input-focus-ring outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 transition-all";

const buildDefaults = (contact) => ({
  name: contact?.name || "",
  email: contact?.email || "",
  phone: contact?.phone || "",
  relationship: contact?.relationship || "Friend",
  notes: contact?.notes || "",
  birthday: {
    ...emptyOccasion,
    ...contact?.birthday,
    templateId:
      contact?.birthday?.templateId?._id || contact?.birthday?.templateId || "",
  },
  anniversary: {
    ...emptyOccasion,
    ...contact?.anniversary,
    templateId:
      contact?.anniversary?.templateId?._id ||
      contact?.anniversary?.templateId ||
      "",
  },
});

const OccasionSection = ({
  title,
  icon: Icon,
  accent,
  fieldKey,
  register,
  watch,
  setValue,
  templates,
}) => {
  const enabled = watch(`${fieldKey}.enabled`);
  const dateValue = watch(`${fieldKey}.date`);
  const yearValue = watch(`${fieldKey}.year`);
  const channels = watch(`${fieldKey}.channels`) || [];

  const toggleChannel = (ch) => {
    if (CHANNEL_META[ch].comingSoon) return;

    const next = channels.includes(ch)
      ? channels.filter((c) => c !== ch)
      : [...channels, ch];

    setValue(`${fieldKey}.channels`, next, {
      shouldDirty: true,
    });
  };

  const dateInputValue =
    dateValue && /^\d{2}-\d{2}$/.test(dateValue)
      ? `${yearValue || new Date().getFullYear()}-${dateValue}`
      : "";

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 ${accent}`}>
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Icon className="w-4 h-4" />
          {title}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-[11px] font-medium text-white/90">
            {enabled ? "Automation ON" : "Automation OFF"}
          </span>

          <span className="relative inline-flex h-5 w-9 items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register(`${fieldKey}.enabled`)}
            />

            <span className="absolute inset-0 rounded-full bg-white/30 peer-checked:bg-white/40 transition-colors" />

            <span className="absolute left-0.5 w-4 h-4 rounded-full bg-white shadow peer-checked:bg-brand-50 peer-checked:translate-x-4 transition-transform" />
          </span>
        </label>
      </div>

      <div className="p-4 space-y-3.5 bg-white dark:bg-slate-900">
        <div>
          <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">
            Date
          </label>

          <input
            type="date"
            value={dateInputValue}
            onChange={(e) => {
              const value = e.target.value;

              if (!value) {
                setValue(`${fieldKey}.date`, null, {
                  shouldDirty: true,
                });

                setValue(`${fieldKey}.year`, null, {
                  shouldDirty: true,
                });

                return;
              }

              const [year, month, day] = value.split("-");

              setValue(`${fieldKey}.date`, `${month}-${day}`, {
                shouldDirty: true,
              });

              setValue(`${fieldKey}.year`, Number(year), { shouldDirty: true });
            }}
            className={selectClass}
          />

          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
            Select day, month and year.
          </p>
        </div>

        <AnimatePresence>
          {enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3.5 overflow-hidden"
            >
              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Template
                </label>

                <select
                  {...register(`${fieldKey}.templateId`)}
                  className={selectClass}
                >
                  <option value="">Choose a template</option>

                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                      {t.isDefault ? " (default)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">
                    Send time
                  </label>

                  <input
                    type="time"
                    {...register(`${fieldKey}.sendTime`)}
                    className={selectClass}
                  />
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 block">
                    Channels
                  </label>

                  <div className="flex gap-1.5">
                    {CHANNELS.map((ch) => {
                      const ChannelIcon = CHANNEL_META[ch].icon;
                      const active = channels.includes(ch);
                      const comingSoon = CHANNEL_META[ch].comingSoon;

                      return (
                        <button
                          type="button"
                          key={ch}
                          title={
                            comingSoon
                              ? `${CHANNEL_META[ch].label} — coming soon`
                              : CHANNEL_META[ch].label
                          }
                          onClick={() => toggleChannel(ch)}
                          disabled={comingSoon}
                          className={`relative flex-1 flex items-center justify-center py-2.5 rounded-lg border transition-colors ${
                            comingSoon
                              ? "border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed"
                              : active
                                ? "bg-brand-600 border-brand-600 text-white"
                                : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-500/50"
                          }`}
                        >
                          <ChannelIcon className="w-4 h-4" />

                          {comingSoon && (
                            <span className="absolute -top-1.5 -right-1.5 px-1 py-[1px] rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-[8px] font-bold leading-none tracking-wide">
                              SOON
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ContactFormModal = ({ open, onClose, onSaved, contact }) => {
  const isEdit = Boolean(contact?._id);
  const [templates, setTemplates] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: buildDefaults(contact),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(contact));
  }, [open, contact, reset]);

  useEffect(() => {
    if (!open) return;

    api
      .get("/templates")
      .then((res) => setTemplates(res.data.data))
      .catch(() => {});
  }, [open]);

  const birthdayTemplates = useMemo(
    () => templates.filter((t) => t.occasionType === "birthday"),
    [templates],
  );

  const anniversaryTemplates = useMemo(
    () => templates.filter((t) => t.occasionType === "anniversary"),
    [templates],
  );

  const relationship = watch("relationship");
  const RelationshipIcon = RELATIONSHIP_META[relationship]?.icon || Sparkles;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      email: data.email || "",
      birthday: {
        ...data.birthday,
        year: data.birthday.year ? Number(data.birthday.year) : null,
        templateId: data.birthday.templateId || null,
      },
      anniversary: {
        ...data.anniversary,
        year: data.anniversary.year ? Number(data.anniversary.year) : null,
        templateId: data.anniversary.templateId || null,
      },
    };

    try {
      if (isEdit) {
        await api.put(`/contacts/${contact._id}`, payload);
        toast.success(`${data.name} was updated`);
      } else {
        await api.post("/contacts", payload);
        toast.success(`${data.name} was added to WishFlow`);
      }

      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Couldn't save this contact",
      );
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
            className="relative bg-white dark:bg-slate-900 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                </span>
                {isEdit ? "Edit contact" : "Add contact"}
              </h3>

              <button
                onClick={onClose}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="overflow-y-auto scrollbar-thin px-5 sm:px-6 py-5 space-y-5"
            >
              <div className="space-y-3.5">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  Personal
                </p>

                <FormField
                  label="Full name"
                  icon={User}
                  placeholder="Rahul Sharma"
                  error={errors.name?.message}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Too short",
                    },
                  })}
                />

                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <RelationshipIcon className="w-3.5 h-3.5 text-brand-500 dark:text-brand-300" />
                    Relationship
                  </label>

                  <select {...register("relationship")} className={selectClass}>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3.5">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  Contact
                </p>

                <FormField
                  label="Email"
                  icon={Mail}
                  type="email"
                  placeholder="rahul@example.com"
                  error={errors.email?.message}
                  {...register("email", {
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />

                <FormField
                  label="Mobile number"
                  icon={Phone}
                  placeholder="9876543210"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  Birthday
                </p>

                <OccasionSection
                  title="Birthday automation"
                  icon={Cake}
                  accent="bg-gradient-to-r from-brand-600 to-brand-400"
                  fieldKey="birthday"
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  templates={birthdayTemplates}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  Anniversary
                </p>

                <OccasionSection
                  title="Anniversary automation"
                  icon={Heart}
                  accent="bg-gradient-to-r from-amber-500 to-orange-500"
                  fieldKey="anniversary"
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  templates={anniversaryTemplates}
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5" />
                  Notes (optional)
                </label>

                <textarea
                  rows={2}
                  placeholder="Anything you want to remember about them..."
                  {...register("notes")}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-[15px] input-focus-ring outline-none resize-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>
            </form>

            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <Save className="w-[18px] h-[18px]" />
                )}

                {isEdit ? "Save changes" : "Save contact"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;

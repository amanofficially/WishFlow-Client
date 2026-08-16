import { motion } from "framer-motion";
import { Cake, Heart, Pencil, Trash2, Mail, Phone, Sparkles } from "lucide-react";
import { relativeLabel, CHANNEL_META, RELATIONSHIP_META } from "../utils/occasion";

const OccasionBadge = ({ type, occasion }) => {
  if (!occasion?.date) return null;
  const Icon = type === "birthday" ? Cake : Heart;
  const label = relativeLabel(occasion.date);
  const isSoon = label === "Today" || label === "Tomorrow";

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        isSoon ? "bg-brand-gradient text-white" : "bg-gray-50 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400"
      }`}
    >
      <Icon className="w-3 h-3" />
      {label}
      {occasion.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Automation on" />}
    </div>
  );
};

const ContactCard = ({ contact, onEdit, onDelete, index = 0 }) => {
  const channels = [
    ...new Set([...(contact.birthday?.channels || []), ...(contact.anniversary?.channels || [])]),
  ];
  const RelationshipIcon = RELATIONSHIP_META[contact.relationship]?.icon || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 sm:p-5 hover:shadow-lg hover:border-brand-100 dark:hover:border-brand-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0">
            {contact.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{contact.name}</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <RelationshipIcon className="w-3 h-3" /> {contact.relationship}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(contact)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <OccasionBadge type="birthday" occasion={contact.birthday} />
        <OccasionBadge type="anniversary" occasion={contact.anniversary} />
      </div>

      {(contact.email || contact.phone) && (
        <div className="space-y-1 mb-3">
          {contact.email && (
            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 shrink-0" /> {contact.email}
            </p>
          )}
          {contact.phone && (
            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" /> {contact.phone}
            </p>
          )}
        </div>
      )}

      {channels.length > 0 && (
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50 dark:border-slate-800">
          {channels.map((ch) => {
            const ChannelIcon = CHANNEL_META[ch]?.icon;
            if (!ChannelIcon) return null;
            return (
              <span
                key={ch}
                title={CHANNEL_META[ch]?.label}
                className="w-6 h-6 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 flex items-center justify-center"
              >
                <ChannelIcon className="w-3.5 h-3.5" />
              </span>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ContactCard;

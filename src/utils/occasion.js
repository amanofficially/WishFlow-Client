// Shared helpers for turning our "MM-DD" storage format into friendly labels,
// and for computing "how many days away" so cards can say "Today" / "Tomorrow".

import {
  Mail,
  MessageCircle,
  Smartphone,
  Users,
  Heart,
  UserRound,
  Briefcase,
  HandHeart,
  Handshake,
  Sparkles,
} from "lucide-react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const formatMonthDay = (monthDay) => {
  if (!monthDay) return null;
  const [m, d] = monthDay.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
};

// Converts an <input type="date"> value ("YYYY-MM-DD") to our stored "MM-DD",
// and the reverse for pre-filling the input when editing.
export const toMonthDayFromISO = (iso) => (iso ? iso.slice(5) : null);
export const isoFromMonthDay = (monthDay) => (monthDay ? `2000-${monthDay}` : "");

export const daysUntil = (monthDay) => {
  if (!monthDay) return null;
  const [m, d] = monthDay.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = new Date(today.getFullYear(), m - 1, d);
  if (target < today) target = new Date(today.getFullYear() + 1, m - 1, d);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

export const relativeLabel = (monthDay) => {
  const days = daysUntil(monthDay);
  if (days === null) return "";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return formatMonthDay(monthDay);
};

export const CHANNEL_META = {
  email: { label: "Email", icon: Mail },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, comingSoon: true },
  sms: { label: "SMS", icon: Smartphone, comingSoon: true },
};

export const RELATIONSHIP_META = {
  Family: { icon: Users },
  Friend: { icon: Handshake },
  Spouse: { icon: Heart },
  Partner: { icon: HandHeart },
  Colleague: { icon: Briefcase },
  Client: { icon: UserRound },
  Relative: { icon: Users },
  Other: { icon: Sparkles },
};

// The backend stores a semantic key on each notification (e.g. "birthday",
// "warning") instead of an emoji. This maps that key to an actual icon
// component + a color treatment, so the Notification Center renders proper
// icons instead of emoji characters.

import { Cake, Heart, PartyPopper, Trophy, Sparkles, CheckCircle2, AlertTriangle, Bell, Calendar } from "lucide-react";

export const NOTIFICATION_ICON_MAP = {
  birthday: { icon: Cake, tone: "brand" },
  anniversary: { icon: Heart, tone: "brand" },
  festival: { icon: PartyPopper, tone: "brand" },
  trophy: { icon: Trophy, tone: "amber" },
  sparkles: { icon: Sparkles, tone: "brand" },
  success: { icon: CheckCircle2, tone: "emerald" },
  warning: { icon: AlertTriangle, tone: "red" },
  reminder: { icon: Calendar, tone: "amber" },
  bell: { icon: Bell, tone: "brand" },
};

export const TONE_CLASSES = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export const resolveNotificationIcon = (key) => NOTIFICATION_ICON_MAP[key] || NOTIFICATION_ICON_MAP.bell;

// Turns a raw template body like "Happy Birthday, {name}!" into the final
// personalized message by swapping {variable} tokens for real values.
// Used both for the live preview in the template editor and (later) by the
// actual sending pipeline, so the substitution logic only lives in one place.

import { Cake, Heart, PartyPopper, Trophy, Sparkles } from "lucide-react";

export const AVAILABLE_VARIABLES = ["{name}", "{sender_name}", "{relationship}", "{occasion}"];

export const SAMPLE_DATA = {
  "{name}": "Rahul",
  "{sender_name}": "You",
  "{relationship}": "Friend",
  "{occasion}": "Birthday",
};

export const personalizeMessage = (message = "", data = SAMPLE_DATA) =>
  Object.entries(data).reduce(
    (text, [token, value]) => text.split(token).join(value),
    message
  );

export const OCCASION_META = {
  birthday: { label: "Birthday", icon: Cake },
  anniversary: { label: "Anniversary", icon: Heart },
  festival: { label: "Festival", icon: PartyPopper },
  work_anniversary: { label: "Work Anniversary", icon: Trophy },
  custom: { label: "Custom", icon: Sparkles },
};

export const CATEGORY_COLORS = {
  Classic: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
  Friendly: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Professional: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Heartfelt: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  "Short & Sweet": "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Elegant: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  Warm: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  Short: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
};

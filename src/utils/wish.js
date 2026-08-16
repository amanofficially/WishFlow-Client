// Delivery status labels + pill colors, shared by the Schedule and Sent
// Wishes pages (spec section 21's status list). Centralized here so both
// pages render the exact same pill for the exact same status.

export const STATUS_META = {
  scheduled: { label: "Scheduled", className: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300" },
  processing: { label: "Processing", className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  sent: { label: "Sent", className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  failed: { label: "Failed", className: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400" },
};

export const statusMeta = (status) => STATUS_META[status] || STATUS_META.scheduled;

import { ChevronLeft, ChevronRight } from "lucide-react";

// One pagination bar, used by every paginated list in the app (Contacts,
// Schedule, Sent Wishes, Notifications) so the look and behavior never
// drifts between pages.
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-500 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

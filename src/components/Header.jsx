import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Search, Bell, Loader2, Cake, Heart, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

// Live search-as-you-type dropdown, backed by the same /contacts endpoint
// the Contacts page uses. Pressing Enter, or clicking "See all results",
// takes the full query over to the Contacts page (?search=...) where it's
// picked up automatically.
const Header = ({ onOpenMobileSidebar, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/notifications", {
          params: { page: 1, limit: 1 },
        });
        if (!cancelled) setUnreadCount(res.data.meta?.unreadCount || 0);
      } catch {
        // Non-fatal — the bell just won't show a count.
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Debounced live search — waits for a short pause in typing before
  // hitting the API, so we're not firing a request on every keystroke.
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.get("/contacts", {
          params: { search: term, limit: 6 },
        });
        setResults(res.data.data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToContacts = useCallback(
    (term) => {
      const trimmed = term.trim();
      navigate(
        trimmed
          ? `/contacts?search=${encodeURIComponent(trimmed)}`
          : "/contacts",
      );
      setOpen(false);
    },
    [navigate],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToContacts(query);
    } else if (e.key === "Escape") {
      setOpen(false);
      e.target.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center gap-3 px-4 sm:px-6 dark:bg-slate-950/85 dark:border-slate-800">
      <button
        onClick={onOpenMobileSidebar}
        className="lg:hidden text-gray-500 hover:text-brand-600 -ml-1 p-1.5 rounded-lg hover:bg-brand-50 transition-colors dark:text-slate-400 dark:hover:text-brand-300 dark:hover:bg-brand-500/10"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="lg:hidden">
        <Logo variant="icon" className="h-7 w-7" />
      </div>

      {title && (
        <h2 className="hidden sm:block font-display font-semibold text-gray-800 dark:text-slate-100">
          {title}
        </h2>
      )}

      <div className="flex-1" />

      <div ref={boxRef} className="hidden sm:block relative w-full max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search contacts..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50 outline-none transition-all dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:border-brand-500/40 dark:focus:ring-brand-500/10"
          />
          {searching ? (
            <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 animate-spin" />
          ) : (
            query && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        {open && query.trim() && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
            {results.length === 0 && !searching ? (
              <p className="px-4 py-3 text-sm text-gray-400 dark:text-slate-500">
                No contacts found
              </p>
            ) : (
              <>
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  {results.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => goToContacts(c.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors text-left"
                    >
                      <span className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name?.[0]?.toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-gray-800 dark:text-slate-100 truncate">
                          {c.name}
                        </span>
                        <span className="block text-xs text-gray-400 dark:text-slate-500 truncate">
                          {c.relationship}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        {c.birthday?.date && (
                          <Cake className="w-3.5 h-3.5 text-brand-400 dark:text-brand-300" />
                        )}
                        {c.anniversary?.date && (
                          <Heart className="w-3.5 h-3.5 text-brand-400 dark:text-brand-300" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToContacts(query)}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 border-t border-gray-100 dark:border-slate-800 transition-colors text-center"
                >
                  See all results for "{query}"
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <ThemeToggle />

      <button
        onClick={() => navigate("/notifications")}
        className="relative p-2 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors dark:text-slate-400 dark:hover:text-brand-300 dark:hover:bg-brand-500/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <Link
        to="/profile"
        className="w-9 h-9 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-transparent hover:ring-brand-200 dark:hover:ring-brand-500/40 transition-all"
        title="Profile"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          user?.name?.[0]?.toUpperCase() || "U"
        )}
      </Link>
    </header>
  );
};

export default Header;

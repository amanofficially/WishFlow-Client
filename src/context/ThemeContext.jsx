// Controls light / dark / system appearance across the whole app,
// including the public landing page (see App.jsx — ThemeProvider wraps
// everything, not just the dashboard).

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "wishflow-theme"; // "light" | "dark" | "system"

const getSystemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolveTheme = (mode) => (mode === "system" ? (getSystemPrefersDark() ? "dark" : "light") : mode);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || "system");
  const [resolved, setResolved] = useState(() => resolveTheme(mode));

  const applyClass = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const theme = resolveTheme(mode);
    setResolved(theme);
    applyClass(theme);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, applyClass]);

  // Live-update when mode === "system" and the OS theme changes.
  useEffect(() => {
    if (mode !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const theme = resolveTheme("system");
      setResolved(theme);
      applyClass(theme);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, applyClass]);

  const toggle = () => setMode((prev) => (resolveTheme(prev) === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme: resolved, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

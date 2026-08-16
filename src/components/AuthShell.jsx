import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";
import FloatingIcons from "./FloatingIcons";
import ThemeToggle from "./ThemeToggle";

const AuthShell = ({ title, subtitle, children, footer, className = "" }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-6 transition-colors duration-200 dark:bg-slate-950 sm:py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-brand-gradient-soft dark:bg-slate-950" />

      <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-brand-200/40 blur-[110px] dark:bg-brand-700/10" />

      <div
        className="absolute -bottom-40 -right-24 h-[26rem] w-[26rem] animate-blob rounded-full bg-accent-200/40 blur-[110px] dark:bg-accent-700/10"
        style={{ animationDelay: "3s" }}
      />

      <FloatingIcons />

      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Auth Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`relative w-full max-w-[420px] ${className}`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="mb-4 flex flex-col items-center gap-1.5 sm:mb-5"
        >
          <Logo variant="icon" className="h-10 w-10 sm:h-11 sm:w-11" />

          <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            WishFlow
          </span>
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-[0_10px_40px_-8px_rgba(124,47,224,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]">
          {/* Gradient Accent */}
          <div className="h-1.5 bg-brand-gradient" />

          <div className="p-5 sm:p-7">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-1.5 text-center font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[26px]"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-5 text-center text-sm leading-relaxed text-gray-500 dark:text-slate-400 sm:mb-6"
              >
                {subtitle}
              </motion.p>
            )}

            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 text-center sm:mt-5"
          >
            {footer}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthShell;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Mail,
  MessageCircle,
  Smartphone,
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  LayoutTemplate,
  Bell,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  UserPlus,
  Cake,
  Send,
  Heart,
  Clock,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import Reveal from "../components/Reveal";
import Logo from "../components/Logo";
import FloatingIcons from "../components/FloatingIcons";
import ThemeToggle from "../components/ThemeToggle";

// Small reusable "photo" stand-in: a gradient circle with initials.
// Used everywhere the landing page needs to represent a person, so we
// never depend on an external image host loading correctly.
const InitialsAvatar = ({ name, className = "w-9 h-9 text-sm" }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={`rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0 ${className}`}
    >
      {initials}
    </span>
  );
};

// ---------- Data used to build the Features grid ----------
// Keeping this as a plain array means adding a new feature card later
// is just adding one object here — no need to touch the JSX layout.
const features = [
  {
    icon: Gift,
    badge: "Automatic",
    title: "Automatic Birthday Wishes",
    desc: "Add a birthday once. WishFlow remembers it every single year.",
  },
  {
    icon: Sparkles,
    badge: "Milestones",
    title: "Automatic Anniversary Wishes",
    desc: "Never let a celebration slip by — anniversaries handled automatically.",
  },
  {
    icon: Mail,
    badge: "Email",
    title: "Email Messaging",
    desc: "Beautifully formatted emails sent right on time, every time.",
  },
  {
    icon: MessageCircle,
    badge: "WhatsApp",
    title: "WhatsApp Messaging",
    desc: "Reach people where they actually check messages.",
  },
  {
    icon: Smartphone,
    badge: "SMS",
    title: "SMS Messaging",
    desc: "A simple, reliable text when it matters most.",
  },
  {
    icon: LayoutTemplate,
    badge: "Personalized",
    title: "Custom Templates",
    desc: "Write it your way once — reuse it for everyone.",
  },
  {
    icon: Calendar,
    badge: "Timezone",
    title: "Smart Scheduling",
    desc: "Respects timezones and your preferred send time.",
  },
  {
    icon: CheckCircle2,
    badge: "Live Status",
    title: "Delivery Tracking",
    desc: "Know exactly what was sent, and what wasn't.",
  },
  {
    icon: Users,
    badge: "Organized",
    title: "Contact Management",
    desc: "Keep every important person organized in one place.",
  },
  {
    icon: BarChart3,
    badge: "Insights",
    title: "Analytics",
    desc: "See your celebration activity at a glance.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Add your contacts",
    desc: "Save the people who matter, once.",
  },
  {
    icon: Cake,
    title: "Add birthdays & anniversaries",
    desc: "Just the date — no fuss.",
  },
  {
    icon: Mail,
    title: "Choose templates & channels",
    desc: "Email, WhatsApp, SMS — your pick.",
  },
  {
    icon: Send,
    title: "WishFlow sends automatically",
    desc: "Every year, right on time.",
  },
];

// Rows for the dashboard-preview mockup's "celebration queue" — every
// avatar here is generated locally from the name (see InitialsAvatar),
// never fetched from an external image host.
const previewRows = [
  {
    name: "Rahul Sharma",
    badge: "Birthday",
    when: "Today",
    channel: "WhatsApp Sent",
    statusColor:
      "text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  },
  {
    name: "Amit & Priya",
    badge: "3rd Anniversary",
    when: "Tomorrow",
    channel: "Scheduled 9:00 AM",
    statusColor:
      "text-brand-700 bg-brand-50 border-brand-200/60 dark:text-brand-300 dark:bg-brand-500/10 dark:border-brand-500/20",
  },
  {
    name: "Neha Patel",
    badge: "Birthday",
    when: "Aug 20",
    channel: "Queued (Email)",
    statusColor:
      "text-accent-700 bg-accent-50 border-accent-200/60 dark:text-accent-300 dark:bg-accent-500/10 dark:border-accent-500/20",
  },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden transition-colors duration-200">
      {/* ============ NAVBAR ============ */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex items-center shrink-0">
            <Logo variant="mark" className="h-8 sm:h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-slate-300">
            <a
              href="#features"
              className="hover:text-brand-600 dark:hover:text-brand-300 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-brand-600 dark:hover:text-brand-300 transition"
            >
              How It Works
            </a>
            <a
              href="#preview"
              className="hover:text-brand-600 dark:hover:text-brand-300 transition"
            >
              Live Preview
            </a>
            <a
              href="#pricing"
              className="hover:text-brand-600 dark:hover:text-brand-300 transition"
            >
              Pricing
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-brand-700 dark:text-brand-300 font-medium text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-gradient px-4 py-2 rounded-lg font-medium text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger — only shown below the sm breakpoint */}
          <div className="flex items-center gap-1 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 -mr-2 text-gray-700 dark:text-slate-200"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 animate-fadeInUp">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 transition"
            >
              How It Works
            </a>
            <a
              href="#preview"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 transition"
            >
              Live Preview
            </a>
            <a
              href="#pricing"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300 transition"
            >
              Pricing
            </a>
            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-brand-700 dark:text-brand-300 font-medium border border-brand-200 dark:border-brand-500/40 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 bg-brand-600 text-white rounded-lg font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative pt-14 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-brand-gradient-soft dark:bg-none dark:bg-slate-950" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-brand-200/30 dark:bg-brand-700/10 rounded-full blur-[120px] -z-10" />
        <FloatingIcons />

        {/* Floating side badges — desktop only, purely decorative and built with CSS */}
        <div className="hidden lg:flex items-center gap-3 absolute top-24 left-8 xl:left-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md shadow-brand-100/60 dark:shadow-black/30 animate-bounce duration-1000">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 dark:text-brand-300">
            <Gift className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-gray-800 dark:text-slate-100">
              Aman's Birthday
            </p>
            <p className="text-gray-400 dark:text-slate-500 text-[11px]">
              Auto sent on WhatsApp
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3 absolute top-40 right-8 xl:right-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md shadow-accent-100/60 dark:shadow-black/30 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center text-accent-500 dark:text-accent-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-gray-800 dark:text-slate-100">
              100% On-Time 💌
            </p>
            <p className="text-brand-600 dark:text-brand-300 font-medium text-[11px]">
              Smart time-zone sync
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" /> Add once. Wish automatically.
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
              Never miss a
              <span className="text-brand-600 dark:text-brand-400">
                {" "}
                special moment.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              WishFlow remembers birthdays and anniversaries and automatically
              sends beautiful wishes through Email, WhatsApp and SMS.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Link
                to="/register"
                className="btn-gradient group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-medium text-lg hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-500/50 dark:hover:text-brand-300 transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* "Delivers to" pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-200/70 dark:border-slate-800 shadow-sm mb-5">
              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Delivers to:
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  WhatsApp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-accent-500" /> Email
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-brand-500" /> SMS
                </span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free tier
                available
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500" /> 1-Minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-500" /> 100% Data
                privacy
              </span>
            </div>
          </Reveal>
        </div>

        {/* ---- Dashboard preview mockup (built with CSS, not a screenshot) ---- */}
        <Reveal delay={400}>
          <div
            id="preview"
            className="max-w-4xl mx-auto mt-16 relative scroll-mt-24"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-brand-100 dark:shadow-black/40 border border-gray-100 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-accent-300" />
                  <div className="w-3 h-3 rounded-full bg-brand-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                  <span className="text-xs font-mono text-gray-400 dark:text-slate-500 ml-2 hidden xs:inline">
                    wishflow.app/overview
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Pilot: ACTIVE
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm text-gray-400 dark:text-slate-500">
                    Good morning, Aarav 👋
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm sm:text-base">
                    Here's your automated celebration queue for this week.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-500/20 shrink-0">
                  Next Delivery:{" "}
                  <strong className="text-accent-600 dark:text-accent-300">
                    Today at 9:00 AM
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                  {
                    label: "Contacts",
                    value: "48",
                    change: "+4 this month",
                    icon: Users,
                  },
                  {
                    label: "Upcoming (7d)",
                    value: "5",
                    change: "2 today",
                    icon: Gift,
                  },
                  {
                    label: "Wishes Sent",
                    value: "312",
                    change: "100% on time",
                    icon: Send,
                  },
                  {
                    label: "Delivery Rate",
                    value: "98%",
                    change: "Verified live",
                    icon: CheckCircle2,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-brand-50/60 dark:bg-slate-800/60 rounded-xl p-3.5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        {s.label}
                      </span>
                      <s.icon className="w-3.5 h-3.5 text-brand-500 dark:text-brand-300" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-brand-700 dark:text-brand-300">
                      {s.value}
                    </p>
                    <p className="text-[11px] font-medium text-accent-600 dark:text-accent-300 mt-0.5">
                      {s.change}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
                  Scheduled Celebration Queue
                </h3>
                <div className="space-y-2.5">
                  {previewRows.map((r) => (
                    <div
                      key={r.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30 rounded-xl transition-all gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <InitialsAvatar
                          name={r.name}
                          className="w-9 h-9 text-xs ring-2 ring-white dark:ring-slate-900"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm flex items-center gap-2 flex-wrap">
                            {r.name}
                            <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-slate-300 rounded-md">
                              {r.badge}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 dark:text-slate-500">
                            {r.when}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`self-start sm:self-auto text-xs font-medium px-2.5 py-1 rounded-full border ${r.statusColor}`}
                      >
                        {r.channel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      >
        <Reveal className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300 bg-accent-50 dark:bg-accent-500/10 border border-accent-200/50 dark:border-accent-500/20 px-3.5 py-1 rounded-full">
            Powerful & Simple
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-3">
            Everything you need to never forget
          </h2>
          <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
            One platform that remembers, personalizes, and sends —
            automatically.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-brand-100 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-gradient transition-colors">
                    <f.icon className="w-5 h-5 text-brand-600 dark:text-brand-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/70 px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how-it-works"
        className="bg-brand-50/50 dark:bg-slate-900/60 py-20 sm:py-24 px-4 sm:px-6"
      >
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-800">
              Simple Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-3">
              How WishFlow works
            </h2>
            <p className="text-gray-500 dark:text-slate-400">
              Four simple steps. Then it just runs itself.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connecting line behind the steps, desktop only */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-brand-100 dark:bg-slate-800" />

            {steps.map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 120}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-slate-900 border-2 border-brand-200 dark:border-brand-500/30 flex items-center justify-center shadow-md relative z-10">
                  <s.icon className="w-6 h-6 text-brand-600 dark:text-brand-300" />
                </div>
                <p className="text-xs font-bold text-brand-500 dark:text-brand-400 mt-4 mb-1">
                  STEP {i + 1}
                </p>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="px-4 sm:px-6 py-20 sm:py-24">
        <Reveal>
          <div className="relative max-w-4xl mx-auto rounded-3xl bg-brand-gradient px-6 sm:px-8 py-14 sm:py-16 text-center overflow-hidden">
            <FloatingIcons
              className="opacity-80"
              items={[
                {
                  icon: Cake,
                  top: "14%",
                  left: "10%",
                  size: 26,
                  duration: 6.5,
                  delay: 0,
                },
                {
                  icon: Sparkles,
                  top: "70%",
                  left: "8%",
                  size: 24,
                  duration: 7,
                  delay: 0.6,
                },
                {
                  icon: Heart,
                  top: "20%",
                  left: "88%",
                  size: 24,
                  duration: 6,
                  delay: 0.3,
                },
                {
                  icon: Sparkles,
                  top: "72%",
                  left: "90%",
                  size: 22,
                  duration: 7.5,
                  delay: 1,
                },
              ]}
            />
            <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-md mb-4">
              <Rocket className="w-3.5 h-3.5" /> Never forget another
              celebration
            </span>
            <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-4">
              Let WishFlow remember the moments you shouldn't forget.
            </h2>
            <Link
              to="/register"
              className="relative inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-700 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Wishing for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-gray-100 dark:border-slate-800 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <Logo variant="mark" className="h-7 w-auto" />
          <p className="text-sm text-gray-400 dark:text-slate-500 order-3 md:order-2">
            We Remember. You Celebrate. © {new Date().getFullYear()} WishFlow
          </p>
          <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 order-2 md:order-3">
            <Bell className="w-4 h-4" />
            <span className="text-sm">Never miss a moment again.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

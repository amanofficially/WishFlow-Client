import { Cake, Gift, BellRing, CheckCircle2 } from "lucide-react";
import Logo from "./Logo";

const COPY = {
  login: {
    title: "Welcome back.",
    subtitle: "Your celebrations have been running on autopilot — let's see what's coming up.",
  },
  register: {
    title: "Add once. Wish automatically.",
    subtitle: "Join WishFlow and never let another birthday or anniversary slip by.",
  },
};

const FEATURES = [
  { icon: Cake, text: "Automatic birthday & anniversary wishes" },
  { icon: Gift, text: "Email, WhatsApp and SMS delivery" },
  { icon: BellRing, text: "Delivery tracking and reminders" },
];

const AuthPanel = ({ variant = "login" }) => {
  const { title, subtitle } = COPY[variant];

  return (
    <div className="hidden lg:flex w-[42%] bg-brand-700 flex-col justify-between px-12 py-14">
      <Logo variant="mark" className="h-8 w-auto brightness-0 invert" />

      <div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-brand-100 leading-relaxed mb-10 max-w-sm">{subtitle}</p>

        <ul className="space-y-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </span>
              <span className="text-brand-50 text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-brand-100 text-sm border-t border-brand-600 pt-6">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>Trusted to remember what matters most</span>
      </div>
    </div>
  );
};

export default AuthPanel;

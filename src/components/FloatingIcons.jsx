// A soft layer of celebration icons that drift slowly in the background.
// Kept low-opacity and slow-moving on purpose — this is meant to add
// warmth behind a hero or auth card, not compete with it. `items` lets
// each usage pick its own icon set and layout.

import { motion } from "framer-motion";
import { Gift, PartyPopper, Sparkles, Mail, Heart, Bell, Cake } from "lucide-react";

const DEFAULT_ITEMS = [
  { icon: Cake, top: "12%", left: "8%", size: 30, duration: 7, delay: 0 },
  { icon: Gift, top: "72%", left: "6%", size: 26, duration: 6.5, delay: 1.1 },
  { icon: PartyPopper, top: "16%", left: "90%", size: 28, duration: 7.5, delay: 0.5 },
  { icon: Sparkles, top: "82%", left: "92%", size: 24, duration: 6, delay: 1.8 },
  { icon: Mail, top: "46%", left: "3%", size: 24, duration: 8, delay: 0.8 },
  { icon: Heart, top: "58%", left: "95%", size: 24, duration: 7, delay: 0.3 },
  { icon: Bell, top: "6%", left: "48%", size: 22, duration: 6.5, delay: 1.4 },
];

const FloatingIcons = ({ items = DEFAULT_ITEMS, className = "" }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    {items.map(({ icon: Icon, top, left, size, duration, delay }, i) => (
      <motion.span
        key={i}
        className="absolute select-none opacity-[0.16] text-brand-600 dark:text-brand-300"
        style={{ top, left }}
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={size} strokeWidth={1.75} />
      </motion.span>
    ))}
  </div>
);

export default FloatingIcons;

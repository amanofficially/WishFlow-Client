// This component makes any section "fade in" when the user scrolls to it.
// It's a simple reusable animation wrapper — wrap anything in <Reveal> and
// it will animate in once, the first time it becomes visible on screen.

import { useEffect, useRef, useState } from "react";

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // IntersectionObserver tells us when an element enters the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only animate once, then stop watching
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${visible ? "animate-fadeInUp" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;

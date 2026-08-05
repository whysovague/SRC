import { useEffect, useRef, useState, type ReactNode } from "react";

// ─── RevealOnScroll ───────────────────────────────────────────────────────────
// Fades + slides an element up into place the first time it scrolls into view.
// The .src-reveal / .is-in transition is defined in src/styles/theme.css.
export function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;

    // Wait one frame so the hidden state actually paints before we
    // start watching — otherwise elements already in the viewport
    // (short pages, fast mounts) skip the transition entirely.
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIn(true);
            io?.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`src-reveal ${isIn ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

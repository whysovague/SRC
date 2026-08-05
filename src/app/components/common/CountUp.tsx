import { useEffect, useRef, useState } from "react";

// ─── Count-up number (fast → slow ease-out, triggers when visible) ────────────
export function CountUp({ to, suffix = "", duration = 6000 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setValue(to); return; }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out exponential — fast at the start, asymptotes into the target for a smooth halt
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(to * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

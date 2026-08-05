import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

import { TEAL } from "@/app/theme";

// ─── InteractiveCard ──────────────────────────────────────────────────────────
// Wrapper that adds a mouse-tracked 3D tilt and a radial glow that follows
// the cursor. Pass `accent` to color the glow, `tiltMax` to tune the angle,
// and `glowSize` to tune the highlight radius. Wraps any card-shaped child.
// The .src-icard* rules are defined in src/styles/theme.css.
export function InteractiveCard({
  accent = TEAL,
  tiltMax = 7,
  glowSize = 360,
  className = "",
  style,
  children,
  onClick,
}: {
  accent?: string;
  tiltMax?: number;
  glowSize?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--rx", `${(-py * tiltMax).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(px * tiltMax).toFixed(2)}deg`);
      el.style.setProperty("--active", "1");
    });
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--active", "1");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--active", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`src-icard ${className}`}
      style={{
        ...(style ?? {}),
        ["--accent" as never]: accent,
        ["--glow-size" as never]: `${glowSize}px`,
      }}
    >
      <span className="src-icard-glow" aria-hidden="true" />
      <span className="src-icard-border" aria-hidden="true" />
      {children}
    </div>
  );
}

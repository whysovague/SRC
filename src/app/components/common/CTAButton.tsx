import type { ReactNode } from "react";

import { TEAL } from "@/app/theme";

// Visual styling lives in src/styles/theme.css (.src-cta, .src-cta-primary,
// .src-cta-secondary, .src-cta-shine, .src-cta-fill) — a global stylesheet, so
// these buttons look the same on every page.
export function CTAButton({ children, primary, ghost, onClick, className = "" }: {
  children: ReactNode; primary?: boolean; ghost?: boolean; onClick?: () => void; className?: string;
}) {
  if (ghost) {
    return (
      <button
        onClick={onClick}
        className={`src-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm tracking-wide text-muted-foreground hover:text-white ${className}`}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  }

  const variantClass = primary ? "src-cta-primary text-[#07111E]" : "src-cta-secondary border text-foreground";
  const variantStyle = primary
    ? { background: `linear-gradient(135deg, ${TEAL}, #08A8B8)` }
    : { borderColor: `${TEAL}50` };

  return (
    <button
      onClick={onClick}
      className={`src-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm tracking-wide ${variantClass} ${className}`}
      style={variantStyle}
    >
      {!primary && <span className="src-cta-fill" aria-hidden />}
      <span className="src-cta-shine" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

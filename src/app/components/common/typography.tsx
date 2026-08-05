import type { ReactNode } from "react";
import { Clock } from "lucide-react";

import { TEAL, ORANGE, PALETTE_BLUE, PALETTE_ORANGE } from "@/app/theme";

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-mono tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-sm border"
      style={{ color: TEAL, borderColor: `${TEAL}40`, background: `${TEAL}10` }}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4 ${light ? "text-white" : "text-foreground"}`}>
      {children}
    </h2>
  );
}

export function Divider() {
  return <div className="w-16 h-1 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${TEAL}, ${ORANGE})` }} />;
}

// Section-header eyebrow with a gradient-bordered pill (blue → orange).
// Used at the top of each page section. Styled inline so it renders
// identically on every page — not just where a scoped <style> tag lives.
export function GradientEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        padding: "1.5px",
        borderRadius: 9999,
        background: `linear-gradient(135deg, ${PALETTE_BLUE} 0%, ${PALETTE_ORANGE} 100%)`,
        boxShadow: `0 0 18px -8px ${PALETTE_BLUE}66, 0 0 18px -8px ${PALETTE_ORANGE}66`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: "inherit",
          background: "#07111E",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {children}
      </span>
    </span>
  );
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: ORANGE, background: `${ORANGE}15`, border: `1px solid ${ORANGE}40` }}>
      <Clock className="w-3 h-3" /> Coming Soon
    </span>
  );
}

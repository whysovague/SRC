import type { ReactNode } from "react";

import { ORANGE } from "@/app/theme";

// ─── Glassy card ─────────────────────
// NOTE: the `faq-pop` entrance animation is defined in the scoped <style> block
// of the pages that use this card (Agenda, Logistics). Without it the card
// simply renders without the pop-in — no layout impact.
export function GlassCard({ children, className = "", delay = 0 }: {
  children: ReactNode; className?: string; delay?: number;
}) {
  return (
    <div
      className={`faq-pop relative rounded-xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: "rgba(13,30,48,0.55)",
        border: `1px solid ${ORANGE}22`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Diagonal reflection cut */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(115deg, transparent 6%, rgba(255,255,255,0.0) 9%, rgba(255,255,255,0.08) 13%, rgba(255,255,255,0.13) 16%, rgba(255,255,255,0.0) 21%, transparent 26%)",
      }} />
      {/* Internal ambient orange glow */}
      <div className="absolute right-0 top-0 w-80 h-full pointer-events-none" style={{
        background: `radial-gradient(circle at 80% 30%, ${ORANGE}1E 0%, ${ORANGE}08 50%, transparent 100%)`,
      }} />
      {/* Top-edge flash */}
      <div className="absolute inset-x-0 -top-16 h-48 pointer-events-none" style={{
        background: `radial-gradient(60% 80% at 50% 0%, ${ORANGE}5C 0%, ${ORANGE}26 38%, transparent 72%)`,
        filter: "blur(10px)", opacity: 0.7, zIndex: 0,
      }} />
      {/* Orange status bar (top-right) */}
      <div className="absolute top-0 right-14 w-12 h-1 rounded-b-md pointer-events-none" style={{ background: `${ORANGE}25` }} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

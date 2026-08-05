import { HelpCircle } from "lucide-react";

import { TEAL } from "@/app/theme";
import type { Section } from "@/app/types";

// Fixed bottom-right helper that jumps to the FAQ page. Collapsed to a glass
// circle; expands to reveal its label on hover (label always shown on touch).
export function HelpButton({ active, onClick }: { active: Section; onClick: () => void }) {
  // Redundant on the pages it points at — hide there.
  if (active === "faq") return null;

  return (
    <>
      <style>{`
        @keyframes srcHelpIn {
          from { opacity: 0; transform: translateY(20px) scale(.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes srcHelpPulse {
          0%   { box-shadow: 0 0 0 0 ${TEAL}55; }
          70%  { box-shadow: 0 0 0 14px ${TEAL}00; }
          100% { box-shadow: 0 0 0 0 ${TEAL}00; }
        }
        .src-help { animation: srcHelpIn .5s cubic-bezier(.16,.84,.44,1) both; }
        .src-help-core { animation: srcHelpPulse 2.6s ease-out infinite; }
        .src-help .src-help-label {
          max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap;
          transition: max-width .4s cubic-bezier(.16,.84,.44,1), opacity .3s ease, margin-left .35s ease;
        }
        .src-help:hover .src-help-label,
        .src-help:focus-visible .src-help-label { max-width: 220px; opacity: 1; margin-left: 8px; }
        @media (hover: none) {
          .src-help .src-help-label { max-width: 220px; opacity: 1; margin-left: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .src-help, .src-help-core { animation: none; }
          .src-help .src-help-label { transition: none; }
        }
      `}</style>

      <button
        onClick={onClick}
        aria-label="Do you need help?"
        className="src-help fixed bottom-6 right-6 z-[120] flex items-center rounded-full pointer-events-auto"
        style={{
          padding: "8px",
          background: "rgba(7,17,30,0.72)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          border: `1px solid ${TEAL}45`,
          boxShadow: `0 12px 36px -10px rgba(0,0,0,0.6), 0 0 22px -6px ${TEAL}66`,
        }}
      >
        <span
          className="src-help-core flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }}
        >
          <HelpCircle className="w-5 h-5" />
        </span>
        <span className="src-help-label text-sm font-semibold" style={{ color: "#fff" }}>
          Do you need help?
        </span>
      </button>
    </>
  );
}

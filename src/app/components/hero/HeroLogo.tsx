import { TEAL } from "@/app/theme";
import srcTealSvg from "@/assets/src_teal.svg";

import { MolecularOrbit } from "./MolecularOrbit";

// ─── Hero Logo (original SRC mark with a gentle float animation) ─────────────
export function HeroLogo() {
  return (
    <div className="relative w-full max-w-[480px] aspect-square src-hero-logo">
      {/* Soft ambient glow behind the mark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${TEAL}33 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />

      <img
        src={srcTealSvg}
        alt="SRC 2026 — Saudi Research Conference"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      <MolecularOrbit />
    </div>
  );
}

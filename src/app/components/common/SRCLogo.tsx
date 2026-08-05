import srcTealSvg from "@/assets/src_teal.svg";

// ─── SRC SVG Logo (inline recreation of brand mark) ───────────────────────────
export function SRCLogo({ size = 64, yOffset = 1 }: { size?: number; yOffset?: number }) {
  return (
    <div
      style={{ width: size * 1.16, height: size, transform: `translateY(${yOffset}px)` }}
      className="relative flex-shrink-0"
    >
      <img
        src={srcTealSvg}
        alt="SRC 2026 Logo"
        className="w-full h-full object-contain drop-shadow-[0_0_14px_rgba(12,191,206,0.55)]"
      />
    </div>
  );
}

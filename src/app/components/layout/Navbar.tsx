import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { TEAL } from "@/app/theme";
import type { Section } from "@/app/types";
import type { AppUser } from "@/app/lib/users";
import { CTAButton, SRCLogo } from "@/app/components/common";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navItems: { label: string; section: Section }[] = [
  { label: "Home", section: "home" },
  { label: "Competitions & Activities", section: "competitions" },
  { label: "Agenda", section: "agenda" },
  { label: "Partnership", section: "partnership" },
  { label: "Contact", section: "contact" },
  { label: "FAQ", section: "faq" },
];

export function Navbar({ active, setSection, onRegisterClick, user, onLogout }: {
  active: Section;
  setSection: (s: Section) => void;
  onRegisterClick: () => void;
  user: AppUser | null;
  onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hoverRect, setHoverRect] = useState<{ left: number; width: number; height: number; top: number } | null>(null);

  const mainNav = navItems;
  
  const updateHover = (key: string) => {
    const el = itemRefs.current[key];
    const parent = navRef.current;
    if (!el || !parent) return;
    const elR = el.getBoundingClientRect();
    const pR = parent.getBoundingClientRect();
    setHoverRect({
      left: elR.left - pR.left,
      top: elR.top - pR.top,
      width: elR.width,
      height: elR.height,
    });
  };

  // Pixelated noise SVG used as overlay for the "pixelated-blur glass" feel
  const pixelNoise =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 pt-4 pointer-events-auto">
        <div className="relative w-full overflow-visible">
          <div
            aria-hidden
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "rgba(7,17,30,0.55)",
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              border: `1px solid ${TEAL}30`,
              boxShadow: `0 10px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: pixelNoise, backgroundSize: "120px 120px", imageRendering: "pixelated" }}
            />
          </div>

          <div className="relative z-10 flex h-14 w-full items-center gap-2 rounded-full px-2">
            <button
              onClick={() => setSection("home")}
              className="relative z-10 flex h-full items-center px-2 rounded-full transition-transform hover:scale-[1.02] overflow-visible"
              style={{ background: "transparent" }}
            >
              <SRCLogo size={72} yOffset={4} />
            </button>

            <div
              ref={navRef}
              onMouseLeave={() => setHoverRect(null)}
              className="relative z-10 hidden lg:flex items-center gap-1"
            >
            {/* Animated hover ring */}
            <span
              aria-hidden
              className="absolute pointer-events-none rounded-full"
              style={{
                left: hoverRect?.left ?? 0,
                top: hoverRect?.top ?? 0,
                width: hoverRect?.width ?? 0,
                height: hoverRect?.height ?? 0,
                border: `1px solid ${TEAL}`,
                boxShadow: `0 0 0 3px ${TEAL}1A, 0 0 18px ${TEAL}55, inset 0 0 12px ${TEAL}22`,
                background: `${TEAL}10`,
                opacity: hoverRect ? 1 : 0,
                transition: "left 280ms cubic-bezier(.22,1,.36,1), top 280ms cubic-bezier(.22,1,.36,1), width 280ms cubic-bezier(.22,1,.36,1), height 280ms cubic-bezier(.22,1,.36,1), opacity 180ms ease",
              }}
            />

            {mainNav.map((item) => (
              <button
                key={item.section}
                ref={(el) => { itemRefs.current[item.section] = el; }}
                onMouseEnter={() => updateHover(item.section)}
                onFocus={() => updateHover(item.section)}
                onClick={() => setSection(item.section)}
                className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  active === item.section ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
                style={active === item.section ? { color: TEAL } : {}}
              >
                {item.label}
              </button>
            ))}

            
            </div>

            <div className="hidden lg:flex relative z-10 items-center gap-2 ml-auto mr-2">
              {user ? (
                <>
                  <span
                    className="text-sm font-semibold text-white whitespace-nowrap px-4 py-2 rounded-full"
                    style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35` }}
                  >
                    Welcome, {user.fullName || user.email} 👋
                  </span>
                  <CTAButton onClick={onLogout}>Logout</CTAButton>
                </>
              ) : (
                <CTAButton primary onClick={onRegisterClick}>Register or Login Now</CTAButton>
              )}
            </div>

            <button
              className="lg:hidden relative z-10 text-foreground h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ml-auto"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "transparent" }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden mx-4 mt-3 rounded-3xl overflow-hidden pointer-events-auto relative"
          style={{
            background: "rgba(7,17,30,0.85)",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            border: `1px solid ${TEAL}25`,
            boxShadow: `0 10px 40px -10px rgba(0,0,0,0.6)`,
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: pixelNoise, backgroundSize: "120px 120px", imageRendering: "pixelated" }}
          />
          <div className="relative z-10">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => { setSection(item.section); setMobileOpen(false); }}
                className="w-full text-left px-6 py-3 text-sm text-muted-foreground hover:text-white border-b border-white/5 transition-colors"
                style={active === item.section ? { color: TEAL } : {}}
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-4 flex flex-col gap-3">
              {user ? (
                <>
                  <span
                    className="text-sm font-semibold text-white text-center px-4 py-2 rounded-full"
                    style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35` }}
                  >
                    Welcome, {user.fullName || user.email} 👋
                  </span>
                  <CTAButton onClick={() => { onLogout(); setMobileOpen(false); }}>Logout</CTAButton>
                </>
              ) : (
                <CTAButton primary onClick={() => { onRegisterClick(); setMobileOpen(false); }}>Register or Login Now</CTAButton>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

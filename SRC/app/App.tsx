import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, ArrowRight, MapPin, Calendar,
  Users, Trophy, Mic2, Building2, Mail, Phone, ExternalLink, Download,
  Star, Award, Zap, Globe, BookOpen, Layers, Heart, Target, Eye,
  CheckCircle, Clock, Instagram, Twitter, Linkedin, Youtube,
  FlaskConical, Presentation, FileText, Lightbulb, Network, Wrench,
  MessageSquare, HelpCircle, ChevronUp
} from "lucide-react";
import srcTealSvg from "@/assets/src_teal.svg";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section =
  | "home" | "about" | "competitions" | "registration" | "program"
  | "teams" | "logistics" | "partnership" | "sponsors" | "speakers"
  | "organizing" | "media" | "faq" | "contact";

// ─── Brand constants ──────────────────────────────────────────────────────────
const TEAL = "#0CBFCE";
const ORANGE = "#E87C2A";
// Palette accents for section-header gradient (light blue → orange)
const PALETTE_BLUE = "#4c90c1";
const PALETTE_ORANGE = "#e47d1b";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-mono tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-sm border"
      style={{ color: TEAL, borderColor: `${TEAL}40`, background: `${TEAL}10` }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4 ${light ? "text-white" : "text-foreground"}`}>
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="w-16 h-1 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${TEAL}, ${ORANGE})` }} />;
}

function CTAButton({ children, primary, ghost, onClick, className = "" }: {
  children: React.ReactNode; primary?: boolean; ghost?: boolean; onClick?: () => void; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200 ${
        primary
          ? "text-[#07111E] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          : ghost
            ? "text-muted-foreground hover:text-white active:scale-[0.98]"
            : "border text-foreground hover:bg-white/5 active:scale-[0.98]"
      } ${className}`}
      style={
        primary
          ? { background: `linear-gradient(135deg, ${TEAL}, #08A8B8)` }
          : ghost
            ? undefined
            : { borderColor: `${TEAL}50` }
      }
    >
      {children}
    </button>
  );
}

// Section-header eyebrow with a gradient-bordered pill (blue → orange).
// Used at the top of each home-page section in place of the bare label.
function GradientEyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`src-eyebrow ${className}`}>
      <span className="src-eyebrow-inner">{children}</span>
    </span>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: ORANGE, background: `${ORANGE}15`, border: `1px solid ${ORANGE}40` }}>
      <Clock className="w-3 h-3" /> Coming Soon
    </span>
  );
}
// ─── RevealOnScroll ───────────────────────────────────────────────────────────
// Fades + slides an element up into place the first time it scrolls into view.
function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
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
// ─── InteractiveCard ──────────────────────────────────────────────────────────
// Wrapper that adds a mouse-tracked 3D tilt and a radial glow that follows
// the cursor. Pass `accent` to color the glow, `tiltMax` to tune the angle,
// and `glowSize` to tune the highlight radius. Wraps any card-shaped child.
function InteractiveCard({
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
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
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

// ─── Glassy card ─────────────────────
function GlassCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
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

function MoleculeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
 
    const reduce = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 
    let width = 0, height = 0, raf = 0;
    const parent = canvas.parentElement!;
 
    type P = { x: number; y: number; vx: number; vy: number; r: number; warm: boolean };
    let nodes: P[] = [];
 
    const build = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
      const count = Math.max(26, Math.min(46, Math.round((width * height) / 28000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 1.2,
        warm: Math.random() < 0.22, // ~1 in 5 nodes is orange
      }));
    };
 
    const LINK = 150;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
 
      // connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.5;
            ctx.strokeStyle = `rgba(12,191,206,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
 
      // nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
 
        const color = n.warm ? "232,124,42" : "12,191,206";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.10)`; 
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.9)`;
        ctx.fill();
      }
 
      raf = requestAnimationFrame(draw);
    };
 
    build();
    if (reduce) { draw(); cancelAnimationFrame(raf); } 
    else draw();
 
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.55,
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 35%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 35%, transparent 85%)",
      }}
      aria-hidden="true"
    />
  );
}

function Marquee({ children, reverse = false, speed = 55 }: { children: React.ReactNode; reverse?: boolean; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false); // hover-pause for auto-scroll

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let offset = 0;      // scroll position in px
    let dragging = false;
    let lastX = 0;

    const halfWidth = () => track.scrollWidth / 2;

    // wrap offset into one copy's width (keeps the loop seamless), then paint
    const render = () => {
      const half = halfWidth();
      if (half <= 0) return;
      offset = ((offset % half) + half) % half;
      const x = reverse ? offset - half : -offset;
      track.style.transform = `translateX(${x}px)`;
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current && !dragging) {
        offset += speed * dt;
        render();
      }
      raf = requestAnimationFrame(step);
    };

    // ── Drag / swipe to scroll manually ──────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      container.setPointerCapture?.(e.pointerId);
      container.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      // drag right → content moves right, in both directions
      offset += reverse ? dx : -dx;
      render();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      container.releasePointerCapture?.(e.pointerId);
      container.style.cursor = "grab";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    if (reduceMotion) render();          // static, but drag still works
    else raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reverse, speed]);

  return (
    <div
      ref={containerRef}
      className="src-edge-fade overflow-hidden select-none"
      style={{ cursor: "grab", touchAction: "pan-y" }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div ref={trackRef} className="flex" style={{ width: "max-content", willChange: "transform" }}>
        <div className="flex gap-5 pr-5">{children}</div>
        <div className="flex gap-5 pr-5" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

// ─── SRC SVG Logo (inline recreation of brand mark) ───────────────────────────
function SRCLogo({ size = 64, yOffset = 1 }: { size?: number; yOffset?: number }) {
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

// ─── Navigation ───────────────────────────────────────────────────────────────
const mainNavItems: { label: string; section: Section }[] = [
  { label: "Home",         section: "home" },
  { label: "Competitions", section: "competitions" },
  { label: "Program",      section: "program" },
  { label: "Logistics",    section: "logistics" },
  { label: "Partnership",  section: "partnership" },
  { label: "Contact",      section: "contact" },
];

const moreNavItems: { label: string; section: Section }[] = [
  { label: "About",           section: "about" },
  { label: "Teams",           section: "teams" },
  { label: "Sponsors",        section: "sponsors" },
  { label: "Speakers",        section: "speakers" },
  { label: "Organizing Team", section: "organizing" },
  { label: "Media",           section: "media" },
  { label: "FAQ",             section: "faq" },
];

function Navbar({ active, setSection, onRegisterOpen }: { active: Section; setSection: (s: Section) => void; onRegisterOpen: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hoverRect, setHoverRect] = useState<{ left: number; width: number; height: number; top: number } | null>(null);

  const updateHover = (key: string) => {
    const el = itemRefs.current[key];
    const parent = navRef.current;
    if (!el || !parent) return;
    const elR = el.getBoundingClientRect();
    const pR = parent.getBoundingClientRect();
    setHoverRect({ left: elR.left - pR.left, top: elR.top - pR.top, width: elR.width, height: elR.height });
  };

  // Close More dropdown when clicking outside
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const pixelNoise =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  const isMoreActive = moreNavItems.some(i => i.section === active);

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
            {/* Logo */}
            <button
              onClick={() => setSection("home")}
              className="relative z-10 flex h-full items-center px-2 rounded-full transition-transform hover:scale-[1.02] overflow-visible"
              style={{ background: "transparent" }}
            >
              <SRCLogo size={72} yOffset={4} />
            </button>

            {/* Desktop nav */}
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
                  left: hoverRect?.left ?? 0, top: hoverRect?.top ?? 0,
                  width: hoverRect?.width ?? 0, height: hoverRect?.height ?? 0,
                  border: `1px solid ${TEAL}`,
                  boxShadow: `0 0 0 3px ${TEAL}1A, 0 0 18px ${TEAL}55, inset 0 0 12px ${TEAL}22`,
                  background: `${TEAL}10`,
                  opacity: hoverRect ? 1 : 0,
                  transition: "left 280ms cubic-bezier(.22,1,.36,1), top 280ms cubic-bezier(.22,1,.36,1), width 280ms cubic-bezier(.22,1,.36,1), height 280ms cubic-bezier(.22,1,.36,1), opacity 180ms ease",
                }}
              />

              {mainNavItems.map((item) => (
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

              {/* More dropdown */}
              <div ref={moreRef} className="relative z-10">
                <button
                  ref={(el) => { itemRefs.current["__more"] = el; }}
                  onMouseEnter={() => updateHover("__more")}
                  onFocus={() => updateHover("__more")}
                  onClick={() => setMoreOpen(v => !v)}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5"
                  style={{ color: isMoreActive ? TEAL : undefined }}
                  aria-expanded={moreOpen}
                >
                  <span className={isMoreActive ? "text-[color:var(--teal)]" : "text-muted-foreground hover:text-white"}>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                    style={{ color: isMoreActive ? TEAL : "rgba(160,185,210,0.60)" }} />
                </button>
                {moreOpen && (
                  <div
                    className="absolute top-full left-0 mt-3 w-52 rounded-2xl overflow-hidden shadow-2xl z-20 py-1.5"
                    style={{
                      background: "rgba(10,22,40,0.92)",
                      backdropFilter: "blur(20px) saturate(160%)",
                      WebkitBackdropFilter: "blur(20px) saturate(160%)",
                      border: `1px solid ${TEAL}22`,
                      boxShadow: `0 24px 60px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(12,191,206,0.08)`,
                    }}
                  >
                    {moreNavItems.map((item) => (
                      <button
                        key={item.section}
                        onClick={() => { setSection(item.section); setMoreOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center gap-2"
                        style={{
                          color: active === item.section ? TEAL : "rgba(160,185,210,0.80)",
                          background: active === item.section ? `${TEAL}10` : "transparent",
                        }}
                        onMouseEnter={e => { if (active !== item.section) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={e => { if (active !== item.section) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        {active === item.section && <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: TEAL }} />}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Register Now CTA */}
            <div className="hidden lg:flex relative z-10 items-center gap-2 ml-auto">
              <CTAButton ghost onClick={onRegisterOpen}>Register Now</CTAButton>
            </div>

            {/* Mobile hamburger */}
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
            background: "rgba(7,17,30,0.92)",
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
            {[...mainNavItems, ...moreNavItems].map((item, i, arr) => (
              <button
                key={item.section}
                onClick={() => { setSection(item.section); setMobileOpen(false); }}
                className="w-full text-left px-6 py-3 text-sm transition-colors"
                style={{
                  color: active === item.section ? TEAL : "rgba(160,185,210,0.75)",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-4">
              <CTAButton primary onClick={() => { onRegisterOpen(); setMobileOpen(false); }}>Register Now</CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Molecular Orbit (press-and-hold to spin) ────────────────────────────────
function MolecularOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, cx = 0, cy = 0, raf = 0, drive = 0;
    let held = false; // true while the pointer is pressed down on the logo

    type Electron = { angle: number; speed: number; warm: boolean; trail: { x: number; y: number }[] };
    type Orbit = { rxF: number; ryF: number; tilt: number; warm: boolean; electrons: Electron[] };

    const orbits: Orbit[] = [
      { rxF: 0.45, ryF: 0.18, tilt: -0.32, warm: false, electrons: [] },
      { rxF: 0.41, ryF: 0.41, tilt: 0.60,  warm: false, electrons: [] },
      { rxF: 0.44, ryF: 0.23, tilt: 1.25,  warm: true,  electrons: [] },
    ];
    const benzene = { angle: 0, speed: 0.0017, spin: 0, rxF: 0.45, ryF: 0.30, tilt: 0.2 };

    const seed = () => {
      orbits.forEach((o, i) => {
        const count = o.rxF === o.ryF ? 2 : 1;
        o.electrons = Array.from({ length: count }, (_, k) => ({
          angle: (Math.PI * 2 * k) / count + i,
          speed: (0.003 + Math.random() * 0.002) * (i % 2 ? -1 : 1),
          warm: o.warm, trail: [],
        }));
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height; cx = W / 2; cy = H / 2;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onEllipse = (rx: number, ry: number, tilt: number, a: number) => {
      const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
      return {
        x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt),
        y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt),
        depth: Math.sin(a),
      };
    };

    const drawPath = (o: Orbit) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.tilt);
      ctx.beginPath(); ctx.ellipse(0, 0, o.rxF * W, o.ryF * H, 0, 0, Math.PI * 2);
      const c = o.warm ? "232,124,42" : "12,191,206";
      ctx.strokeStyle = `rgba(${c},0.10)`; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    };

    const drawBenzene = (x: number, y: number, size: number, spin: number, alpha: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = Math.cos(a) * size, py = Math.sin(a) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(232,124,42,${0.7 * alpha})`; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232,124,42,${0.4 * alpha})`; ctx.lineWidth = 1; ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        ctx.beginPath(); ctx.arc(Math.cos(a) * size, Math.sin(a) * size, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,170,${0.9 * alpha})`; ctx.fill();
      }
      ctx.restore();
    };

    const frame = () => {
      drive += ((held ? 1 : 0) - drive) * 0.07;
      ctx.clearRect(0, 0, W, H);

      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 900);
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.22);
      ng.addColorStop(0, `rgba(12,191,206,${0.16 + pulse * 0.10 + drive * 0.10})`);
      ng.addColorStop(1, "rgba(12,191,206,0)");
      ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);

      orbits.forEach(drawPath);

      orbits.forEach((o) => {
        const rx = o.rxF * W, ry = o.ryF * H;
        o.electrons.forEach((e) => {
          e.angle += e.speed * drive;
          const p = onEllipse(rx, ry, o.tilt, e.angle);
          const x = p.x, y = p.y;
          const depth = (p.depth + 1) / 2;
          const size = 1.6 + depth * 2.2;
          const alpha = 0.45 + depth * 0.55;
          const c = e.warm ? "232,124,42" : "12,191,206";

          e.trail.push({ x, y }); if (e.trail.length > 14) e.trail.shift();
          for (let i = 0; i < e.trail.length; i++) {
            const t = i / e.trail.length;
            ctx.beginPath(); ctx.arc(e.trail[i].x, e.trail[i].y, size * t * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c},${alpha * t * 0.35})`; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${alpha * 0.12})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(${c},${alpha * 0.06})`; ctx.lineWidth = 1; ctx.stroke();
        });
      });

      benzene.angle += benzene.speed * drive;
      benzene.spin  += 0.01 * drive;
      const bp = onEllipse(benzene.rxF * W, benzene.ryF * H, benzene.tilt, benzene.angle);
      const bD = (bp.depth + 1) / 2;
      drawBenzene(bp.x, bp.y, 9 + bD * 5, benzene.spin, 0.4 + bD * 0.6);

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const press   = () => { held = true;  canvas.style.cursor = "grabbing"; };
    const release = () => { held = false; canvas.style.cursor = "grab"; };

    canvas.addEventListener("pointerdown", press);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", release);
    window.addEventListener("resize", resize);

    resize(); seed(); frame();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      canvas.removeEventListener("pointerleave", release);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{ top: "-12%", left: "-12%", width: "124%", height: "124%", cursor: "grab", touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
}

// ─── Hero Logo (original SRC mark with a gentle float animation) ─────────────
function HeroLogo() {
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

// ─── Count-up number (fast → slow ease-out, triggers when visible) ────────────
function CountUp({ to, suffix = "", duration = 6000 }: { to: number; suffix?: string; duration?: number }) {
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

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setSection, onRegisterOpen }: { setSection: (s: Section) => void; onRegisterOpen: () => void }) {
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const stats: { to: number; suffix: string; label: string }[] = [
    { to: 1000, suffix: "+", label: "Expected Participants" },
    { to: 10,   suffix: "+", label: "Universities" },
    { to: 5,    suffix: "+", label: "GCC Countries" },
    { to: 20,   suffix: "+", label: "Activities & Events" },
  ];

  const scrollToAbout = () => {
    const aboutSection = aboutSectionRef.current;
    if (!aboutSection) return;

    const navbarOffset = 88;
    const top = aboutSection.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Styles for the About section */}
      <style>{`
        @keyframes srcFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(0, -28px) scale(1.04); }
        }
        @keyframes srcDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(22px, 18px) scale(1.08); }
        }
        @keyframes srcGlowPulse {
          0%, 100% { opacity: .45; }
          50%      { opacity: .85; }
        }
        @keyframes srcRise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .src-rise   { animation: srcRise .9s cubic-bezier(.16,.84,.44,1) both; }
        .src-rise-2 { animation: srcRise .9s .12s cubic-bezier(.16,.84,.44,1) both; }
        .src-rise-3 { animation: srcRise .9s .24s cubic-bezier(.16,.84,.44,1) both; }
        .val-card .val-desc {
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height .45s cubic-bezier(.16,.84,.44,1), opacity .35s ease, margin-top .4s ease;
        }
        .val-card:hover .val-desc,
        .val-card:focus-within .val-desc { max-height: 120px; opacity: 1; margin-top: 10px; }
        /* Touch devices have no hover — show value descriptions by default */
        @media (hover: none) {
          .val-card .val-desc { max-height: 200px; opacity: 1; margin-top: 10px; }
        }
          @keyframes srcMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes srcMarqueeRev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .src-track { display: flex; width: max-content; animation: srcMarquee 38s linear infinite; will-change: transform; }
        .src-track.rev { animation-name: srcMarqueeRev; }
        .src-marquee:hover .src-track { animation-play-state: paused; }
        .src-edge-fade {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        @keyframes srcHeroFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .src-hero-logo {
          animation: srcHeroFloat 7s ease-in-out infinite;
        }
        /* Timeline card slide-in from the viewport edges */
        .src-tl-card {
          opacity: 0;
          /* Mobile: cards live to the right of the line — always come from the right edge */
          transform: translate3d(60vw, 0, 0);
          transition:
            opacity 1.1s cubic-bezier(.16,.84,.44,1),
            transform 1.1s cubic-bezier(.16,.84,.44,1);
          will-change: opacity, transform;
        }
        @media (min-width: 768px) {
          .src-tl-card {
            transform: translate3d(var(--src-tl-from, 60vw), 0, 0);
          }
        }
        .src-tl-card.is-in {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          .src-rise, .src-rise-2, .src-rise-3 { animation: none; }
          .val-card .val-desc { transition: none; }
          .src-track { animation: none; }
          .src-hero-logo { animation: none; }
          .src-tl-card { opacity: 1; transform: none; transition: none; }
        }

        /* InteractiveCard — mouse-tracked 3D tilt + radial glow */
        .src-icard {
          position: relative;
          isolation: isolate;
          transform-style: preserve-3d;
          transform:
            perspective(1100px)
            rotateX(var(--rx, 0deg))
            rotateY(var(--ry, 0deg))
            translateZ(0);
          transition: transform .45s cubic-bezier(.22,.61,.36,1),
                      border-color .3s ease,
                      box-shadow .3s ease;
          will-change: transform;
        }
        .src-icard:hover {
          box-shadow:
            0 18px 50px -22px color-mix(in srgb, var(--accent, #0CBFCE) 55%, transparent),
            0 4px 14px -6px rgba(0,0,0,0.5);
        }
        .src-icard-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: calc(var(--active, 0) * 1);
          transition: opacity .35s ease;
          background: radial-gradient(
            var(--glow-size, 360px) circle
            at var(--mx, 50%) var(--my, 50%),
            color-mix(in srgb, var(--accent, #0CBFCE) 28%, transparent) 0%,
            color-mix(in srgb, var(--accent, #0CBFCE) 10%, transparent) 28%,
            transparent 60%
          );
          mix-blend-mode: screen;
          z-index: -1;
        }
        /* Subtle highlight ring that intensifies on hover */
        .src-icard-border {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: calc(var(--active, 0) * 1);
          transition: opacity .35s ease;
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent, #0CBFCE) 35%, transparent);
          z-index: 0;
        }
        @media (hover: none), (prefers-reduced-motion: reduce) {
          .src-icard {
            transform: none !important;
            transition: border-color .3s ease;
          }
          .src-icard-glow, .src-icard-border { display: none; }
        }

        /* Section eyebrow — gradient-bordered pill */
        .src-eyebrow {
          display: inline-block;
          padding: 1.5px;
          border-radius: 9999px;
          background: linear-gradient(135deg, ${PALETTE_BLUE} 0%, ${PALETTE_ORANGE} 100%);
          box-shadow: 0 0 18px -8px ${PALETTE_BLUE}66, 0 0 18px -8px ${PALETTE_ORANGE}66;
        }
        .src-eyebrow-inner {
          display: inline-block;
          padding: 6px 14px;
          border-radius: inherit;
          background: #07111E;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }
      `}</style>

      {/* Shared homepage background — molecule network + glow orbs + faint grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0, background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
      >
        <MoleculeNetwork />
        <div className="absolute -left-32 top-10 w-[460px] h-[460px] rounded-full"
          style={{ background: `radial-gradient(circle, ${TEAL}33 0%, transparent 65%)`, filter: "blur(60px)", animation: "srcFloat 14s ease-in-out infinite, srcGlowPulse 9s ease-in-out infinite" }} />
        <div className="absolute right-[-10rem] bottom-0 w-[520px] h-[520px] rounded-full"
          style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "srcDrift 18s ease-in-out infinite, srcGlowPulse 11s ease-in-out infinite" }} />
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 80%)",
        }} />
      </div>

      {/* Content sits above the fixed background */}
      <div className="relative" style={{ zIndex: 1 }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero-only radial accent on top of the shared background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(12,191,206,0.08) 0%, transparent 70%)"
        }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Conference info */}
            <div className="max-w-2xl order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
              </div>

             

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-xl">
                The inaugural AIChE Student Regional Conference in the Gulf — bringing together the brightest minds in chemical engineering from across the GCC and beyond.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: ORANGE }} />
                  <span className="font-semibold text-foreground">2026 · TBA</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: ORANGE }} />
                  <span className="font-semibold text-foreground">KFUPM, Dhahran, Saudi Arabia</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-12">
                <CTAButton primary onClick={onRegisterOpen}>
                  Register Now <ArrowRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton onClick={scrollToAbout}>
                  Learn More <ChevronRight className="w-4 h-4" />
                </CTAButton>
              </div>
            </div>

            {/* RIGHT — Animated SRC logo with glowing outline */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <HeroLogo />
            </div>
          </div>

          {/* Stats — centered along the bottom of the landing section */}
          <div className="mt-5 md:mt-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center justify-items-center max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="p-4 w-full">
                <div className="font-display text-2xl md:text-3xl font-black mb-1" style={{ color: TEAL }}>
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

 {/* About */}
      <section
        ref={aboutSectionRef}
        id="about"
        className="relative overflow-hidden py-28 md:py-36 border-t"
        style={{ borderColor: `${TEAL}15`, scrollMarginTop: "88px" }}
      >
 
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Eyebrow */}
          <div className="mb-7 src-rise">
            <GradientEyebrow>About the Conference</GradientEyebrow>
          </div>
 
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 src-rise">
              <h2 className="font-display font-black leading-[1.02] tracking-tight mb-8 text-4xl md:text-6xl">
                <span className="text-white">What is </span>
                <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>SRC?</span>
              </h2>
 
              <div className="relative pl-6 mb-8">
                <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full" style={{ background: `linear-gradient(${TEAL}, ${ORANGE})`, boxShadow: `0 0 18px ${TEAL}88` }} />
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                  The <span className="font-semibold text-white">Student Regional Conference (SRC)</span> is an AIChE flagship event that gathers undergraduate chemical engineering students from universities across a geographic region for competitions, technical presentations, workshops, and professional development.
                </p>
              </div>
 
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                SRC 2026 at KFUPM marks a historic milestone — it is the{" "}
                <span style={{ color: TEAL }} className="font-semibold">first time this conference is held in the Gulf Cooperation Council (GCC)</span>, bringing the AIChE tradition of academic excellence to the heart of the Arab world's energy and engineering hub.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Hosted by King Fahd University of Petroleum &amp; Minerals (KFUPM) in Dhahran, Saudi Arabia, this conference will attract students, faculty advisors, and industry professionals from across the GCC and the broader Middle East region.
              </p>
            </div>
 
            <div className="lg:col-span-5 space-y-5 src-rise-2">
              {[
                { title: "Why SRC Matters", icon: <Zap className="w-5 h-5" />, accent: TEAL, text: "SRC creates a platform where students sharpen technical skills, compete at a high level, and build professional networks that last a career. It bridges academic learning with real-world engineering challenges." },
                { title: "Why KFUPM?", icon: <Building2 className="w-5 h-5" />, accent: ORANGE, text: "KFUPM is the premier engineering and science university in the GCC, located at the epicenter of the global energy industry. Its world-class facilities, faculty, and industry connections make it the ideal host for a landmark event." },
              ].map((item) => (
                <InteractiveCard
                  key={item.title}
                  accent={item.accent}
                  className="group relative rounded-2xl p-6 overflow-hidden transition-colors duration-300"
                  style={{ background: "rgba(13,30,48,0.55)", border: `1px solid ${item.accent}28`, backdropFilter: "blur(6px)" }}
                >
                  <div className="relative flex items-center gap-3 mb-3">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.accent}18`, color: item.accent, boxShadow: `inset 0 0 0 1px ${item.accent}40` }}>
                      {item.icon}
                    </span>
                    <h4 className="font-display font-bold text-white text-lg">{item.title}</h4>
                  </div>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </InteractiveCard>
              ))}
            </div>
          </div>
 
          {/* Mission / Vision */}
          <div className="grid md:grid-cols-2 gap-6 mt-20 src-rise-3">
            {[
              { label: "Mission", icon: <Target className="w-5 h-5" />, color: TEAL, text: "To provide an exceptional platform that empowers chemical engineering students across the GCC to showcase their talents, engage with industry, and develop as global engineering leaders — while establishing a sustainable regional AIChE tradition." },
              { label: "Vision", icon: <Eye className="w-5 h-5" />, color: ORANGE, text: "To be the premier student engineering conference in the Middle East, recognized for its academic rigor, cultural richness, and its role in shaping the next generation of engineers who will drive the region's industrial transformation." },
            ].map((mv) => (
              <InteractiveCard
                key={mv.label}
                accent={mv.color}
                className="group relative rounded-2xl p-8 overflow-hidden transition-colors duration-300"
                style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${mv.color}30` }}
              >
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${mv.color}40 0%, transparent 70%)`, filter: "blur(28px)" }} />
                <div className="relative flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${mv.color}18`, color: mv.color }}>
                    {mv.icon}
                  </div>
                  <span className="font-display text-2xl font-extrabold text-white">{mv.label}</span>
                </div>
                <p className="relative text-muted-foreground leading-relaxed">{mv.text}</p>
              </InteractiveCard>
            ))}
          </div>
 
          {/* Values */}
          <div className="mt-20">
            <div className="mb-6">
              <GradientEyebrow>What We Stand For</GradientEyebrow>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Star className="w-5 h-5" />, title: "Excellence", desc: "Upholding the highest standards in engineering education and competition." },
                { icon: <Globe className="w-5 h-5" />, title: "Collaboration", desc: "Bridging students, faculty, and industry across borders." },
                { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", desc: "Driving creative solutions to the challenges of our time." },
                { icon: <Heart className="w-5 h-5" />, title: "Community", desc: "Building a lasting AIChE network in the GCC region." },
                { icon: <Award className="w-5 h-5" />, title: "Leadership", desc: "Developing the next generation of chemical engineering leaders." },
                { icon: <Target className="w-5 h-5" />, title: "Impact", desc: "Creating tangible outcomes for students, industry, and society." },
              ].map((v) => (
                <div key={v.title} tabIndex={0}
                  className="val-card group relative rounded-xl p-5 cursor-default outline-none transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(13,30,48,0.45)", border: `1px solid ${TEAL}22` }}>

                  <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 0 0 1px ${TEAL}55, 0 16px 40px -14px ${TEAL}66` }} />
                  <div className="relative flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${TEAL}15`, color: TEAL }}>
                      {v.icon}
                    </span>
                    <h4 className="font-display font-bold text-white">{v.title}</h4>
                  </div>
                  <p className="val-desc relative text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TimelineSection />

{/* SPONSORS & SPEAKERS */}
      <section className="relative overflow-hidden py-24 border-t" style={{ borderColor: `${TEAL}15` }}>
        <MoleculeNetwork />
        {/* Ambient background — faint grid + stage glows */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(12,191,206,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.03) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 85%)",
        }} />
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${TEAL}22 0%, transparent 70%)`, filter: "blur(55px)", animation: "srcGlowPulse 9s ease-in-out infinite" }} />
        <div className="absolute left-1/2 bottom-[22%] -translate-x-1/2 w-[70%] h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${ORANGE}1C 0%, transparent 70%)`, filter: "blur(60px)", animation: "srcGlowPulse 11s ease-in-out infinite" }} />
        <div className="relative max-w-7xl mx-auto">
          {/* Sponsors */}
          <div className="px-6 flex items-end justify-between mb-8">
            <div>
              <div className="mb-3"><GradientEyebrow>Our Supporters</GradientEyebrow></div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Sponsors &amp; Partners</h2>
            </div>
            <button onClick={() => setSection("sponsors")} className="inline-flex items-center gap-1 hover:gap-2 text-sm font-semibold transition-all" style={{ color: TEAL }}>
              See More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Marquee>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-44 h-24 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(13,30,48,0.5)", border: `1px solid ${TEAL}22` }}>
                <span className="text-xs font-mono tracking-wide" style={{ color: `${TEAL}88` }}>Logo soon</span>
              </div>
            ))}
          </Marquee>

          {/* Speakers */}
          <div className="px-6 flex items-end justify-between mb-8 mt-16">
            <div>
              <div className="mb-3"><GradientEyebrow>Meet The Experts</GradientEyebrow></div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Speakers &amp; Judges</h2>
            </div>
            <button onClick={() => setSection("speakers")} className="inline-flex items-center gap-1 hover:gap-2 text-sm font-semibold transition-all" style={{ color: ORANGE }}>
              See More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Marquee reverse>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0 rounded-xl p-5 flex flex-col items-center text-center"
                style={{ background: "rgba(13,30,48,0.5)", border: `1px solid ${ORANGE}22` }}>
                <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                  style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}30`, color: `${ORANGE}99` }}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="h-2.5 w-20 rounded-full mb-2" style={{ background: `${TEAL}22` }} />
                <div className="h-2 w-14 rounded-full" style={{ background: `${TEAL}15` }} />
              </div>
            ))}
          </Marquee>
        </div>
      </section>
      
      {/* CTA band */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${TEAL}15 0%, ${ORANGE}10 100%)`, borderTop: `1px solid ${TEAL}25`, borderBottom: `1px solid ${TEAL}25` }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
            Be Part of History
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            SRC 2026 is the first-ever AIChE Student Regional Conference hosted in the GCC. Don't miss your chance to compete, learn, and connect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton primary onClick={onRegisterOpen}>Register Now <ArrowRight className="w-4 h-4" /></CTAButton>
            <CTAButton onClick={() => setSection("contact")}>Contact Us</CTAButton>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
// TODO DELETE ABOUT PAGE
// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
  const values = [
    { icon: <Star className="w-5 h-5" />, title: "Excellence", desc: "Upholding the highest standards in engineering education and competition." },
    { icon: <Globe className="w-5 h-5" />, title: "Collaboration", desc: "Bridging students, faculty, and industry across borders." },
    { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", desc: "Driving creative solutions to the challenges of our time." },
    { icon: <Heart className="w-5 h-5" />, title: "Community", desc: "Building a lasting AIChE network in the GCC region." },
    { icon: <Award className="w-5 h-5" />, title: "Leadership", desc: "Developing the next generation of chemical engineering leaders." },
    { icon: <Target className="w-5 h-5" />, title: "Impact", desc: "Creating tangible outcomes for students, industry, and society." },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <SectionTag>About SRC 2026</SectionTag>
          <SectionTitle>What is SRC?</SectionTitle>
          <Divider />
          <div className="grid md:grid-cols-2 gap-12 mt-8">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                The <span className="text-white font-semibold">Student Regional Conference (SRC)</span> is an AIChE flagship event that gathers undergraduate chemical engineering students from universities across a geographic region for competitions, technical presentations, workshops, and professional development.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                SRC 2026 at KFUPM marks a historic milestone — it is the <span style={{ color: TEAL }} className="font-semibold">first time this conference is held in the Gulf Cooperation Council (GCC)</span>, bringing the AIChE tradition of academic excellence to the heart of the Arab world's energy and engineering hub.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hosted by King Fahd University of Petroleum & Minerals (KFUPM) in Dhahran, Saudi Arabia, this conference will attract students, faculty advisors, and industry professionals from across the GCC and the broader Middle East region.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Why SRC Matters", icon: <Zap />, text: "SRC creates a platform where students sharpen technical skills, compete at a high level, and build professional networks that last a career. It bridges academic learning with real-world engineering challenges." },
                { title: "Why KFUPM?", icon: <Building2 />, text: "KFUPM is the premier engineering and science university in the GCC, located at the epicenter of the global energy industry. Its world-class facilities, faculty, and industry connections make it the ideal host for a landmark event." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: TEAL }}>{item.icon}</span>
                    <h4 className="font-display font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { label: "Mission", icon: <Target />, text: "To provide an exceptional platform that empowers chemical engineering students across the GCC to showcase their talents, engage with industry, and develop as global engineering leaders — while establishing a sustainable regional AIChE tradition.", color: TEAL },
            { label: "Vision", icon: <Eye />, text: "To be the premier student engineering conference in the Middle East, recognized for its academic rigor, cultural richness, and its role in shaping the next generation of engineers who will drive the region's industrial transformation.", color: ORANGE },
          ].map((mv) => (
            <div key={mv.label} className="rounded-xl p-8 border" style={{ background: "var(--card)", borderColor: `${mv.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${mv.color}15`, color: mv.color }}>
                  {mv.icon}
                </div>
                <span className="font-display text-2xl font-extrabold text-white">{mv.label}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{mv.text}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <SectionTag>Our Values</SectionTag>
          <SectionTitle>What We Stand For</SectionTitle>
          <Divider />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg p-5 border hover:border-[#0CBFCE]/30 transition-colors group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: TEAL }} className="group-hover:scale-110 transition-transform">{v.icon}</span>
                  <h4 className="font-semibold text-white">{v.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Competitions Page (redesigned) ───────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

type CompItem = {
  icon: React.ReactNode;
  title: string;
  category: "Competition" | "Activity";
  desc: string;
  details: string[];
  color: string;
};

function CompGlassCard({ item }: { item: CompItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const mx = (x * 100).toFixed(1) + "%";
    const my = (y * 100).toFixed(1) + "%";
    el.style.setProperty("--mx", mx);
    el.style.setProperty("--my", my);
    if (glowRef.current) {
      glowRef.current.style.setProperty("--mx", mx);
      glowRef.current.style.setProperty("--my", my);
    }
    if (!reduced) {
      el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-(y - 0.5) * 10).toFixed(2)}deg`);
    }
  };

  const handleEnter = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--active", "1");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--active", "0");
  };

  return (
    <div className="cmp-perspective h-full">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="cmp-card group"
        style={{"--accent": item.color, "--active": "0", "--rx": "0deg", "--ry": "0deg", "--mx": "50%", "--my": "50%"} as React.CSSProperties}
      >
        <div ref={glowRef} className="cmp-glow" style={{"--mx": "50%", "--my": "50%"} as React.CSSProperties} />
        <div className="cmp-sheen" />
        <div className="relative z-[2] flex h-full flex-col p-7">
          <div className="mb-5 flex items-start justify-between">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl border-2 backdrop-blur-sm"
              style={{ color: item.color, background: `${item.color}1A`, borderColor: `${item.color}66` }}
            >
              {item.icon}
            </div>
            <span
              className="rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wide"
              style={{ color: item.color, background: `${item.color}18`, borderColor: `${item.color}50` }}
            >
              {item.category}
            </span>
          </div>
          <h3 className="font-display mb-3 text-xl font-bold text-white leading-tight">{item.title}</h3>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(180,200,220,0.80)" }}>{item.desc}</p>
          <ul className="mb-7 space-y-2.5">
            {item.details.map((d) => (
              <li key={d} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(160,185,210,0.75)" }}>
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: item.color }} />
                {d}
              </li>
            ))}
          </ul>
          <button type="button" className="cmp-glass-btn mt-auto" style={{"--btn-color": item.color} as React.CSSProperties}>
            View details <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompetitionsPage() {
  const competitions: CompItem[] = [
    {
      icon: <FlaskConical className="w-7 h-7" />,
      title: "Chem-E-Car",
      category: "Competition",
      desc: "Design and build a car powered by a chemical reaction that travels a set distance and stops on cue.",
      details: ["Team-based", "Design, build & present", "Chemical power & braking"],
      color: TEAL,
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "ChemE Jeopardy",
      category: "Competition",
      desc: "A fast-paced, Jeopardy-style trivia battle across the full breadth of chemical engineering.",
      details: ["Team of 3–4", "Live Q&A format", "All ChE disciplines"],
      color: ORANGE,
    },
    {
      icon: <Presentation className="w-7 h-7" />,
      title: "Technical Presentation",
      category: "Competition",
      desc: "Students present original research to a panel of industry and academic judges.",
      details: ["Individual", "Industry judges", "Research focus"],
      color: TEAL,
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Poster Competition",
      category: "Competition",
      desc: "Present research in a poster format, engaging judges and attendees in an open gallery.",
      details: ["Research poster", "Judge engagement", "Open gallery"],
      color: ORANGE,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Youth Pulse",
      category: "Activity",
      desc: "Hands-on demos, mentoring, and career exposure for younger and prospective engineers.",
      details: ["Mentorship", "Hands-on demos", "Career guidance"],
      color: TEAL,
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: "Workshops",
      category: "Activity",
      desc: "Practical skills sessions led by industry experts — from process safety to AI in ChE.",
      details: ["Industry-led", "Hands-on learning", "Multiple tracks"],
      color: ORANGE,
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Panels & Sessions",
      category: "Activity",
      desc: "Moderated panels with leaders from industry, academia, and startups on the future of energy.",
      details: ["Expert panelists", "Q&A sessions", "Industry insight"],
      color: TEAL,
    },
    {
      icon: <Network className="w-7 h-7" />,
      title: "Networking",
      category: "Activity",
      desc: "Dedicated networking hours, a career fair, and structured engagement with employers.",
      details: ["Career fair", "Company booths", "Structured mixers"],
      color: ORANGE,
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: "Additional Programs",
      category: "Activity",
      desc: "Cultural tours, social events, an opening ceremony and a closing gala — the full experience.",
      details: ["Opening ceremony", "Closing gala", "Cultural tours"],
      color: TEAL,
    },
  ];

  const [filter, setFilter] = useState<"All" | "Competition" | "Activity">("All");
  const filtered = competitions.filter((c) => filter === "All" || c.category === filter);

  const highlights = [
    { icon: <Zap className="h-5 w-5" />, title: "Why Compete", color: TEAL, text: "Sharpen technical skills, compete at the highest level, and build professional networks that last a career." },
    { icon: <Network className="h-5 w-5" />, title: "Who Can Join", color: ORANGE, text: "Undergraduate chemical engineering students from universities across the GCC and the broader region." },
  ];

  return (
    <div className="relative overflow-hidden pb-32">
      <style>{`
        @keyframes srcFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(0,-28px) scale(1.04);} }
        @keyframes srcDrift { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(22px,18px) scale(1.08);} }
        @keyframes srcGlowPulse { 0%,100%{opacity:.45;} 50%{opacity:.85;} }

        .cmp-perspective { perspective: 1200px; }
        .cmp-card {
          position: relative; height: 100%; border-radius: 20px; overflow: hidden;
          background: linear-gradient(155deg, rgba(22,36,56,0.75) 0%, rgba(11,20,35,0.65) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          backdrop-filter: blur(20px) saturate(140%);
          box-shadow:
            0 2px 0 0 rgba(255,255,255,0.06) inset,
            0 -1px 0 0 rgba(0,0,0,0.4) inset,
            0 24px 48px -20px rgba(0,0,0,0.85);
          transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
          transform-style: preserve-3d; will-change: transform;
          transition:
            transform 0.25s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          cursor: pointer;
        }
        .cmp-card:hover {
          border-color: rgba(var(--accent-rgb, 232,124,42), 0.50);
          box-shadow:
            0 2px 0 0 rgba(255,255,255,0.10) inset,
            0 -1px 0 0 rgba(0,0,0,0.5) inset,
            0 32px 64px -24px rgba(0,0,0,0.90),
            0 0 80px -30px rgba(var(--accent-rgb, 232,124,42), 0.55);
        }
        .cmp-glow {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: inherit;
          background: radial-gradient(
            480px circle at var(--mx, 50%) var(--my, 50%),
            rgba(var(--accent-rgb, 232,124,42), 0.22) 0%,
            rgba(var(--accent-rgb, 232,124,42), 0.08) 35%,
            transparent 65%
          );
          opacity: calc(var(--active, 0) * 1);
          transition: opacity 0.2s ease;
        }
        .cmp-sheen {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.06) 40%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0.06) 60%,
            rgba(255,255,255,0.00) 100%
          );
          opacity: calc(var(--active, 0) * 0.8);
          transition: opacity 0.2s ease;
        }
        .cmp-glass-btn {
          display: inline-flex; width: 100%; align-items: center; justify-content: center; gap: .5rem;
          padding: .8rem 1.2rem; border-radius: 14px; font-weight: 700; font-size: .95rem;
          color: rgba(255, 235, 210, 0.95);
          background: linear-gradient(135deg, rgba(232,124,42,0.20), rgba(180,90,20,0.12));
          border: 1px solid rgba(232,124,42,0.50);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.20),
            inset 0 -1px 0 rgba(0,0,0,0.30),
            0 6px 20px -8px rgba(232,124,42,0.50);
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .cmp-glass-btn:hover {
          color: #fff;
          background: linear-gradient(135deg, rgba(232,124,42,0.38), rgba(200,105,30,0.24));
          border-color: rgba(232,124,42,0.80);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.28),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 10px 28px -8px rgba(232,124,42,0.80);
          transform: translateY(-1px);
        }
        .cmp-glass-btn:active { transform: scale(.97) translateY(0); }
        .cmp-chip {
          padding: .5rem 1.1rem; border-radius: 10px; border: 1px solid;
          font-size: .875rem; font-weight: 600; transition: all .2s ease; cursor: pointer;
        }
        .cmp-chip:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) {
          .cmp-card { transform: none !important; transition: border-color .3s ease, box-shadow .3s ease; }
          .cmp-glow, .cmp-sheen { display: none; }
        }
        @media (hover: none) {
          .cmp-card { transform: none !important; }
          .cmp-glow { opacity: 0.4 !important; }
        }
      
        .cmp-gradient {
          background: linear-gradient(100deg, #54cfe4 0%, #a6d2c1 26%, #ddd3bc 52%, #e9b277 76%, #E8842F 100%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent; -webkit-text-fill-color: transparent;
        }
        .cmp-info {
          position: relative; overflow: hidden; border-radius: 16px;
          background: linear-gradient(160deg, rgba(20,32,50,0.55), rgba(13,24,40,0.42));
          border: 1px solid rgba(232,124,42,0.16);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease;
        }
        .cmp-info:hover {
          border-color: rgba(232,124,42,0.40);
          box-shadow: 0 18px 40px -26px rgba(0,0,0,0.8), 0 0 50px -30px rgba(232,124,42,0.5), inset 0 1px 0 rgba(255,255,255,0.10);
          transform: translateY(-2px);
        }
        .cmp-info-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(300px circle at 85% 12%, rgba(232,124,42,0.20), transparent 60%);
        }
`}</style>

      {/* ── About-style molecule-network background (warmer, pointer-aware) ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse 90% 75% at 50% 28%, black 30%, transparent 88%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 28%, black 30%, transparent 88%)",
        }}
      >
        <MoleculeNetwork warmRatio={0.3} interactive opacity={0.5} />
        <div
          className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full"
          style={{ background: `radial-gradient(circle, ${TEAL}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "srcFloat 16s ease-in-out infinite, srcGlowPulse 10s ease-in-out infinite" }}
        />
        <div
          className="absolute right-0 top-40 h-[480px] w-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${ORANGE}22 0%, transparent 65%)`, filter: "blur(80px)", animation: "srcDrift 20s ease-in-out infinite, srcGlowPulse 12s ease-in-out infinite" }}
        />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-12">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-12" style={{ background: TEAL }} />
            <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: TEAL }}>
              What Awaits You
            </span>
          </div>

          <h1 className="font-display mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-white">Competitions &amp;</span>
            <span className="cmp-gradient block">Activities</span>
          </h1>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.25fr_0.85fr]">
            {/* intro */}
            <div className="relative pl-6">
              <span
                className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full"
                style={{ background: `linear-gradient(${TEAL}, ${ORANGE})` }}
              />
              <p className="text-xl leading-relaxed text-foreground sm:text-2xl">
                SRC 2026 delivers a rich program of technical competitions, professional development, and networking &mdash; engineered to challenge and inspire chemical engineering students across the GCC.
              </p>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                From Chem-E-Car and ChemE Jeopardy to presentations, workshops, and a full slate of activities &mdash; there&rsquo;s a place for every engineer to compete, learn, and connect.
              </p>
            </div>

            {/* highlight glass cards */}
            <div className="space-y-5">
              {highlights.map((h) => (
                <div key={h.title} className="cmp-info">
                  <div className="cmp-info-glow" />
                  <div className="relative z-[2] p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg border"
                        style={{ color: h.color, background: `${h.color}1A`, borderColor: `${h.color}55` }}
                      >
                        {h.icon}
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">{h.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters + grid ── */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mt-2">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: TEAL }}>
            Browse by type
          </p>
          <div className="flex flex-wrap gap-3">
            {(["All", "Competition", "Activity"] as const).map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="cmp-chip"
                  style={
                    active
                      ? { background: ORANGE, color: "#07111E", borderColor: ORANGE }
                      : { background: `${ORANGE}14`, color: "var(--muted-foreground)", borderColor: `${ORANGE}3A` }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <CompGlassCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Registration Modal ───────────────────────────────────────────────────────

type RegType = "participant" | "team" | "speaker" | "volunteer" | "partner" | null;
type CompetitionChoice = "chem-e-car" | "jeopardy" | "presentation" | "poster" | null;

interface RegFormData {
  // Participant
  p_name: string; p_email: string; p_org: string; p_position: string; p_country: string;
  // Team
  t_competition: CompetitionChoice;
  t_teamName: string; t_leaderName: string; t_leaderEmail: string;
  t_university: string; t_country: string; t_members: string;
  // Speaker
  s_name: string; s_email: string; s_org: string; s_position: string; s_country: string; s_role: string;
  // Volunteer
  v_name: string; v_email: string; v_university: string; v_major: string; v_country: string;
  // Partner
  pr_company: string; pr_contact: string; pr_email: string; pr_position: string; pr_country: string; pr_interest: string;
}

const emptyForm: RegFormData = {
  p_name: "", p_email: "", p_org: "", p_position: "", p_country: "",
  t_competition: null, t_teamName: "", t_leaderName: "", t_leaderEmail: "", t_university: "", t_country: "", t_members: "",
  s_name: "", s_email: "", s_org: "", s_position: "", s_country: "", s_role: "",
  v_name: "", v_email: "", v_university: "", v_major: "", v_country: "",
  pr_company: "", pr_contact: "", pr_email: "", pr_position: "", pr_country: "", pr_interest: "",
};

function RegInput({ label, value, onChange, type = "text", placeholder = "", required = true }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(160,185,210,0.70)" }}>
        {label}{required && <span style={{ color: ORANGE }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
        style={{
          background: "rgba(7,17,30,0.70)",
          border: `1px solid rgba(12,191,206,0.20)`,
          backdropFilter: "blur(8px)",
        }}
        onFocus={e => { e.target.style.borderColor = `${TEAL}80`; e.target.style.boxShadow = `0 0 0 3px ${TEAL}18`; }}
        onBlur={e => { e.target.style.borderColor = "rgba(12,191,206,0.20)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function RegSelect({ label, value, onChange, options, required = true }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(160,185,210,0.70)" }}>
        {label}{required && <span style={{ color: ORANGE }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none"
        style={{
          background: "rgba(7,17,30,0.70)",
          border: `1px solid rgba(12,191,206,0.20)`,
          backdropFilter: "blur(8px)",
        }}
        onFocus={e => { e.target.style.borderColor = `${TEAL}80`; e.target.style.boxShadow = `0 0 0 3px ${TEAL}18`; }}
        onBlur={e => { e.target.style.borderColor = "rgba(12,191,206,0.20)"; e.target.style.boxShadow = "none"; }}
      >
        <option value="" style={{ background: "#07111E" }}>Select…</option>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: "#07111E" }}>{o.label}</option>)}
      </select>
    </div>
  );
}

function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [regType, setRegType] = useState<RegType>(null);
  const [form, setForm] = useState<RegFormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof RegFormData) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  // Close on overlay click
  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Validation
  const isStep2Valid = (): boolean => {
    if (regType === "participant") return !!(form.p_name && form.p_email && form.p_org && form.p_position && form.p_country);
    if (regType === "team") return !!(form.t_competition && form.t_teamName && form.t_leaderName && form.t_leaderEmail && form.t_university && form.t_country && form.t_members);
    if (regType === "speaker") return !!(form.s_name && form.s_email && form.s_org && form.s_position && form.s_country && form.s_role);
    if (regType === "volunteer") return !!(form.v_name && form.v_email && form.v_university && form.v_major && form.v_country);
    if (regType === "partner") return !!(form.pr_company && form.pr_contact && form.pr_email && form.pr_position && form.pr_country && form.pr_interest);
    return false;
  };

  const regTypeLabels: Record<NonNullable<RegType>, string> = {
    participant: "Participant", team: "Competition Team",
    speaker: "Speaker / Judge / Mentor", volunteer: "Volunteer", partner: "Partner / Sponsor",
  };

  const competitionLabels: Record<NonNullable<CompetitionChoice>, string> = {
    "chem-e-car": "Chem-E-Car", jeopardy: "ChemE Jeopardy",
    presentation: "Technical Presentation", poster: "Poster Competition",
  };

  const summaryRows = (): { label: string; value: string }[] => {
    if (regType === "participant") return [
      { label: "Type", value: "Participant" },
      { label: "Full Name", value: form.p_name }, { label: "Email", value: form.p_email },
      { label: "Organization", value: form.p_org }, { label: "Position", value: form.p_position },
      { label: "Country", value: form.p_country },
    ];
    if (regType === "team") return [
      { label: "Type", value: "Competition Team" },
      { label: "Competition", value: competitionLabels[form.t_competition!] },
      { label: "Team Name", value: form.t_teamName }, { label: "Team Leader", value: form.t_leaderName },
      { label: "Leader Email", value: form.t_leaderEmail }, { label: "University", value: form.t_university },
      { label: "Country", value: form.t_country }, { label: "Team Members", value: form.t_members },
    ];
    if (regType === "speaker") return [
      { label: "Type", value: "Speaker / Judge / Mentor" },
      { label: "Full Name", value: form.s_name }, { label: "Email", value: form.s_email },
      { label: "Organization", value: form.s_org }, { label: "Position", value: form.s_position },
      { label: "Country", value: form.s_country }, { label: "Role", value: form.s_role },
    ];
    if (regType === "volunteer") return [
      { label: "Type", value: "Volunteer" },
      { label: "Full Name", value: form.v_name }, { label: "Email", value: form.v_email },
      { label: "University", value: form.v_university }, { label: "Major", value: form.v_major },
      { label: "Country", value: form.v_country },
    ];
    if (regType === "partner") return [
      { label: "Type", value: "Partner / Sponsor" },
      { label: "Company", value: form.pr_company }, { label: "Contact Person", value: form.pr_contact },
      { label: "Email", value: form.pr_email }, { label: "Position", value: form.pr_position },
      { label: "Country", value: form.pr_country }, { label: "Interest", value: form.pr_interest },
    ];
    return [];
  };

  const steps = ["Select Type", "Fill Information", "Review & Submit"];

  const competitions: { id: CompetitionChoice; icon: React.ReactNode; title: string; desc: string; color: string }[] = [
    { id: "chem-e-car", icon: <FlaskConical className="w-6 h-6" />, title: "Chem-E-Car", desc: "Design & build a chemically-powered car", color: TEAL },
    { id: "jeopardy", icon: <Trophy className="w-6 h-6" />, title: "ChemE Jeopardy", desc: "Fast-paced trivia battle", color: ORANGE },
    { id: "presentation", icon: <Presentation className="w-6 h-6" />, title: "Technical Presentation", desc: "Present original research to judges", color: TEAL },
    { id: "poster", icon: <FileText className="w-6 h-6" />, title: "Poster Competition", desc: "Present research in an open gallery", color: ORANGE },
  ];

  const typeCards: { id: RegType; icon: React.ReactNode; title: string; desc: string; color: string }[] = [
    { id: "participant", icon: <Users className="w-7 h-7" />, title: "Participant", desc: "Attend sessions, workshops, panels & networking events.", color: TEAL },
    { id: "team", icon: <Trophy className="w-7 h-7" />, title: "Competition Team", desc: "Register your team for Chem-E-Car, Jeopardy, and more.", color: ORANGE },
    { id: "speaker", icon: <Mic2 className="w-7 h-7" />, title: "Speaker / Judge / Mentor", desc: "Share expertise as a speaker, judge, or career mentor.", color: TEAL },
    { id: "volunteer", icon: <Heart className="w-7 h-7" />, title: "Volunteer", desc: "Help make SRC 2026 an unforgettable conference.", color: ORANGE },
    { id: "partner", icon: <Building2 className="w-7 h-7" />, title: "Partner / Sponsor", desc: "Connect your organization with future engineers.", color: TEAL },
  ];

  if (submitted) {
    return (
      <div ref={overlayRef} onClick={handleOverlay}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(4,10,20,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="relative w-full max-w-md rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(155deg,rgba(18,32,52,0.96),rgba(9,18,34,0.98))",
            border: `1px solid ${TEAL}35`,
            boxShadow: `0 40px 100px -20px rgba(0,0,0,0.9), 0 0 80px -40px ${TEAL}40`,
          }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${TEAL}20`, border: `2px solid ${TEAL}60` }}>
            <CheckCircle className="w-10 h-10" style={{ color: TEAL }} />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Registration Submitted!</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Thank you for registering for SRC 2026. We'll be in touch shortly with confirmation details.
          </p>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} onClick={handleOverlay}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(4,10,20,0.88)", backdropFilter: "blur(14px)" }}
    >
      <style>{`
        @keyframes regModalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .reg-modal { animation: regModalIn 0.35s cubic-bezier(.16,.84,.44,1) both; }
        .reg-step-fade { animation: regModalIn 0.25s cubic-bezier(.16,.84,.44,1) both; }
        .reg-type-card {
          cursor: pointer; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(155deg, rgba(20,34,54,0.80), rgba(10,20,38,0.70));
          backdrop-filter: blur(16px);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .reg-type-card:hover {
          transform: translateY(-3px);
          border-color: rgba(12,191,206,0.45);
          box-shadow: 0 16px 40px -16px rgba(0,0,0,0.7), 0 0 40px -20px rgba(12,191,206,0.35);
        }
        .reg-type-card.selected {
          border-color: rgba(12,191,206,0.70) !important;
          box-shadow: 0 0 0 2px rgba(12,191,206,0.25), 0 16px 40px -16px rgba(0,0,0,0.7) !important;
        }
        .reg-comp-card {
          cursor: pointer; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07);
          background: linear-gradient(155deg, rgba(18,30,50,0.80), rgba(9,18,34,0.70));
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .reg-comp-card:hover { transform: translateY(-2px); }
        .reg-comp-card.selected {
          border-color: rgba(232,124,42,0.65) !important;
          box-shadow: 0 0 0 2px rgba(232,124,42,0.20), 0 12px 32px -12px rgba(0,0,0,0.6) !important;
        }
        .reg-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .reg-submit-btn:not(:disabled):hover { opacity: 0.92; transform: translateY(-1px); }
      `}</style>

      <div className="reg-modal relative w-full max-w-2xl my-auto rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(155deg,rgba(14,26,44,0.97),rgba(7,15,28,0.99))",
          border: `1px solid rgba(12,191,206,0.18)`,
          boxShadow: "0 50px 120px -30px rgba(0,0,0,0.95), 0 0 100px -50px rgba(12,191,206,0.25)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h2 className="font-display text-xl font-bold text-white leading-tight">Register for SRC 2026</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(140,170,200,0.70)" }}>AIChE Student Regional Conference · KFUPM, Dhahran</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
            style={{ color: "rgba(160,185,210,0.70)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-8 pt-5 pb-4">
          <div className="flex items-center gap-0">
            {steps.map((label, i) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <div key={label} className="flex items-center" style={{ flex: i < steps.length - 1 ? "1" : "0" }}>
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                      style={{
                        background: done ? TEAL : active ? `${TEAL}22` : "rgba(255,255,255,0.07)",
                        border: done ? "none" : active ? `2px solid ${TEAL}` : "2px solid rgba(255,255,255,0.14)",
                        color: done ? "#07111E" : active ? TEAL : "rgba(160,185,210,0.50)",
                        boxShadow: active ? `0 0 14px ${TEAL}55` : "none",
                      }}>
                      {done ? <CheckCircle className="w-3.5 h-3.5" /> : idx}
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-center leading-tight whitespace-nowrap"
                      style={{ color: active ? TEAL : done ? "rgba(160,200,210,0.80)" : "rgba(120,150,175,0.50)" }}>
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px mx-3 mb-4 transition-all"
                      style={{ background: done ? `linear-gradient(90deg, ${TEAL}, ${TEAL}88)` : "rgba(255,255,255,0.10)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="reg-step-fade">
              <h3 className="font-display text-lg font-bold text-white mb-5">How would you like to register?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {typeCards.map(card => (
                  <div key={card.id!}
                    className={`reg-type-card p-5 flex items-start gap-4`}
                    onClick={() => { setRegType(card.id); setStep(2); }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.color}1A`, border: `1px solid ${card.color}45`, color: card.color }}>
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-white text-sm leading-tight mb-1">{card.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(140,170,200,0.70)" }}>{card.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "rgba(120,150,180,0.40)" }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && regType && (
            <div className="reg-step-fade">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${TEAL}1A`, border: `1px solid ${TEAL}45`, color: TEAL }}>
                  {typeCards.find(c => c.id === regType)?.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "rgba(120,160,180,0.60)" }}>Registering as</p>
                  <h3 className="font-display font-bold text-white text-base leading-tight">{regTypeLabels[regType]}</h3>
                </div>
              </div>

              {/* Participant */}
              {regType === "participant" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <RegInput label="Full Name" value={form.p_name} onChange={set("p_name")} placeholder="e.g. Ahmed Al-Rashidi" />
                  <RegInput label="Email Address" type="email" value={form.p_email} onChange={set("p_email")} placeholder="you@university.edu" />
                  <RegInput label="Organization / University" value={form.p_org} onChange={set("p_org")} placeholder="e.g. KFUPM" />
                  <RegInput label="Position / Job Title" value={form.p_position} onChange={set("p_position")} placeholder="e.g. Undergraduate Student" />
                  <div className="sm:col-span-2">
                    <RegInput label="Country" value={form.p_country} onChange={set("p_country")} placeholder="e.g. Saudi Arabia" />
                  </div>
                </div>
              )}

              {/* Competition Team */}
              {regType === "team" && (
                <div>
                  <p className="text-sm font-semibold text-white mb-4">Which competition would you like to register for?</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {competitions.map(c => (
                      <div key={c.id!}
                        className={`reg-comp-card p-4 flex items-center gap-3 ${form.t_competition === c.id ? "selected" : ""}`}
                        style={form.t_competition === c.id ? { borderColor: `${c.color}65`, boxShadow: `0 0 0 2px ${c.color}20` } : {}}
                        onClick={() => set("t_competition")(c.id!)}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${c.color}1A`, border: `1px solid ${c.color}45`, color: c.color }}>
                          {c.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{c.title}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(130,160,185,0.65)" }}>{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {form.t_competition && (
                    <div className="grid sm:grid-cols-2 gap-4 reg-step-fade">
                      <RegInput label="Team Name" value={form.t_teamName} onChange={set("t_teamName")} placeholder="e.g. Alpha Chem" />
                      <RegInput label="Team Leader Name" value={form.t_leaderName} onChange={set("t_leaderName")} placeholder="e.g. Sara Al-Otaibi" />
                      <RegInput label="Team Leader Email" type="email" value={form.t_leaderEmail} onChange={set("t_leaderEmail")} placeholder="leader@university.edu" />
                      <RegInput label="University" value={form.t_university} onChange={set("t_university")} placeholder="e.g. KFUPM" />
                      <RegInput label="Country" value={form.t_country} onChange={set("t_country")} placeholder="e.g. Saudi Arabia" />
                      <RegSelect label="Number of Team Members" value={form.t_members} onChange={set("t_members")}
                        options={["1","2","3","4","5","6","7","8","9","10"].map(n => ({ value: n, label: n }))} />
                    </div>
                  )}
                </div>
              )}

              {/* Speaker / Judge / Mentor */}
              {regType === "speaker" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <RegInput label="Full Name" value={form.s_name} onChange={set("s_name")} placeholder="e.g. Dr. Khalid Al-Mansour" />
                  <RegInput label="Email" type="email" value={form.s_email} onChange={set("s_email")} placeholder="you@organization.com" />
                  <RegInput label="Organization" value={form.s_org} onChange={set("s_org")} placeholder="e.g. Saudi Aramco" />
                  <RegInput label="Position" value={form.s_position} onChange={set("s_position")} placeholder="e.g. Senior Engineer" />
                  <RegInput label="Country" value={form.s_country} onChange={set("s_country")} placeholder="e.g. Saudi Arabia" />
                  <RegSelect label="Role" value={form.s_role} onChange={set("s_role")}
                    options={[{ value: "Speaker", label: "Speaker" }, { value: "Judge", label: "Judge" }, { value: "Mentor", label: "Mentor" }]} />
                </div>
              )}

              {/* Volunteer */}
              {regType === "volunteer" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <RegInput label="Full Name" value={form.v_name} onChange={set("v_name")} placeholder="e.g. Nora Al-Harbi" />
                  <RegInput label="Email" type="email" value={form.v_email} onChange={set("v_email")} placeholder="you@university.edu" />
                  <RegInput label="University" value={form.v_university} onChange={set("v_university")} placeholder="e.g. KFUPM" />
                  <RegInput label="Major" value={form.v_major} onChange={set("v_major")} placeholder="e.g. Chemical Engineering" />
                  <div className="sm:col-span-2">
                    <RegInput label="Country" value={form.v_country} onChange={set("v_country")} placeholder="e.g. Saudi Arabia" />
                  </div>
                </div>
              )}

              {/* Partner */}
              {regType === "partner" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <RegInput label="Company Name" value={form.pr_company} onChange={set("pr_company")} placeholder="e.g. Saudi Aramco" />
                  <RegInput label="Contact Person" value={form.pr_contact} onChange={set("pr_contact")} placeholder="e.g. Mohammed Al-Ghamdi" />
                  <RegInput label="Email" type="email" value={form.pr_email} onChange={set("pr_email")} placeholder="contact@company.com" />
                  <RegInput label="Position" value={form.pr_position} onChange={set("pr_position")} placeholder="e.g. CSR Manager" />
                  <RegInput label="Country" value={form.pr_country} onChange={set("pr_country")} placeholder="e.g. Saudi Arabia" />
                  <RegInput label="Partnership Interest" value={form.pr_interest} onChange={set("pr_interest")} placeholder="e.g. Gold Sponsor, Booth" />
                </div>
              )}

              {/* Step 2 actions */}
              <div className="flex items-center justify-between mt-8 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                  style={{ color: "rgba(140,170,200,0.80)", border: "1px solid rgba(255,255,255,0.10)" }}>
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </button>
                <button
                  onClick={() => { if (isStep2Valid()) setStep(3); }}
                  disabled={!isStep2Valid()}
                  className="reg-submit-btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }}>
                  Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="reg-step-fade">
              <h3 className="font-display text-lg font-bold text-white mb-5">Review your information</h3>
              <div className="rounded-2xl overflow-hidden mb-6"
                style={{ border: "1px solid rgba(12,191,206,0.18)", background: "rgba(7,17,30,0.60)" }}>
                {summaryRows().map((row, i) => (
                  <div key={row.label}
                    className="flex items-start justify-between px-5 py-3.5 gap-4"
                    style={{
                      borderBottom: i < summaryRows().length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: i === 0 ? `${TEAL}08` : "transparent",
                    }}>
                    <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0"
                      style={{ color: "rgba(120,160,185,0.65)", minWidth: "110px" }}>{row.label}</span>
                    <span className="text-sm text-right font-medium"
                      style={{ color: i === 0 ? TEAL : "rgba(210,225,235,0.90)" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4 mb-6"
                style={{ background: `${ORANGE}0C`, border: `1px solid ${ORANGE}28` }}>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(200,160,110,0.85)" }}>
                  By submitting, you confirm that all information is accurate. The SRC 2026 team will contact you at the provided email address.
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                  style={{ color: "rgba(140,170,200,0.80)", border: "1px solid rgba(255,255,255,0.10)" }}>
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </button>
                <button onClick={() => setSubmitted(true)}
                  className="reg-submit-btn flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }}>
                  Submit Registration <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Registration Page (kept for footer links) ────────────────────────────────
function RegistrationPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Join SRC 2026</SectionTag>
        <SectionTitle>Registration</SectionTitle>
        <Divider />
        <p className="text-muted-foreground max-w-2xl mb-12 text-lg leading-relaxed">
          Multiple pathways to participate in SRC 2026. Choose the track that fits your role.
        </p>
        <div className="rounded-xl p-10 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
          <h3 className="font-display text-2xl font-bold text-white mb-3">Register Now</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Click the "Register Now" button in the top navigation bar to open the registration form.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" style={{ color: TEAL }} />
            <span>src2026@kfupm.edu.sa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Timeline Section (Important Dates) ─────────────────────────────────────
function TimelineSection() {
  const milestones = [
    {
      date: "Q1 2026",
      event: "Registration Opens",
      desc: "Team and individual registration officially opens for all GCC universities.",
      status: "upcoming" as const,
    },
    {
      date: "Q1 2026",
      event: "Team Registration Deadline",
      desc: "Final deadline for teams to confirm their participation.",
      status: "upcoming" as const,
    },
    {
      date: "Q2 2026",
      event: "Abstract Submission Deadline",
      desc: "Technical presentation abstracts must be submitted for review.",
      status: "upcoming" as const,
    },
    {
      date: "Q2 2026",
      event: "Poster Submission Deadline",
      desc: "Research posters due for the Poster Competition.",
      status: "upcoming" as const,
    },
    {
      date: "TBA",
      event: "SRC 2026 Conference",
      desc: "The main event — three days of competitions, technical sessions, and networking.",
      status: "main" as const,
      schedule: [
        "Opening Ceremony",
        "Chem-E-Car Competition",
        "Technical Sessions",
        "Workshops",
        "Networking Events",
        "Closing Gala",
      ],
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(() => milestones.map(() => false));
  const [fillPct, setFillPct] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealed((prev) => {
                if (prev[i]) return prev;
                const next = prev.slice();
                next[i] = true;
                return next;
              });
              io.disconnect();
            }
          }
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;

        const pct = ((viewportCenter - rect.top) / rect.height) * 100;
        setFillPct(Math.min(100, Math.max(0, pct)));

        let closest = 0;
        let minDist = Infinity;
        nodeRefs.current.forEach((el, i) => {
          if (!el) return;
          const dist = Math.abs(el.getBoundingClientRect().top - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-24 border-t" style={{ borderColor: `${TEAL}15` }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(7,17,30,0.02) 0%, rgba(12,191,206,0.015) 50%, rgba(7,17,30,0.03) 100%)",
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="mb-7 src-rise">
            <GradientEyebrow>Roadmap</GradientEyebrow>
          </div>
        <SectionTitle>Important Dates</SectionTitle>
        <Divider />

        <div ref={trackRef} className="relative mt-16 pl-10 md:pl-0">
          {/* Track background */}
          <div
            className="absolute top-0 bottom-0 w-px left-[7px] md:left-1/2"
            style={{ background: `${TEAL}18` }}
          />
          {/* Track fill — the moving highlight */}
          <div
            className="absolute top-0 w-px left-[7px] md:left-1/2 transition-[height] duration-150 ease-out"
            style={{
              height: `${fillPct}%`,
              background: `linear-gradient(180deg, ${TEAL}, ${ORANGE})`,
              boxShadow: `0 0 12px ${TEAL}80`,
            }}
          />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((m, i) => {
              const isActive = i === activeIndex;
              const isLit = i <= activeIndex;
              const accent = m.status === "main" ? ORANGE : TEAL;
              const alignLeft = i % 2 === 0;
              const isIn = revealed[i];
              // Desktop: alternating sides — slide in from the matching viewport edge.
              const desktopFromX = alignLeft ? "-60vw" : "60vw";

              return (
                <div
                  key={m.event}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className={`relative md:flex md:items-center md:gap-12 ${
                    alignLeft ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Node */}
                  <div
                    ref={(el) => { nodeRefs.current[i] = el; }}
                    className="absolute left-0 md:left-1/2 -translate-x-1/2 top-1 z-10"
                  >
                    <div
                      className="rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        width: isActive ? 36 : 16,
                        height: isActive ? 36 : 16,
                        background: isLit ? accent : "var(--background)",
                        border: `2px solid ${accent}`,
                        boxShadow: isActive ? `0 0 0 8px ${accent}20` : "none",
                        color: "#0a0a0a",
                      }}
                    >
                      {isActive && (m.status === "main" ? <Star className="w-4 h-4" /> : <Calendar className="w-4 h-4" />)}
                    </div>
                  </div>

                  {/* Spacer (desktop alternating layout) */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content card */}
                  <div
                    className={`ml-10 md:ml-0 md:w-1/2 ${
                      alignLeft ? "md:text-right md:pr-14" : "md:pl-14"
                    }`}
                  >
                    <div
                      className={`src-tl-card ${isIn ? "is-in" : ""}`}
                      style={{ ["--src-tl-from" as never]: desktopFromX }}
                    >
                    <InteractiveCard
                      accent={accent}
                      className="rounded-xl p-5 border overflow-hidden transition-colors duration-500"
                      style={{
                        background: isActive ? `${accent}0d` : "var(--card)",
                        borderColor: isActive ? `${accent}40` : "var(--border)",
                        opacity: isActive ? 1 : 0.75,
                      }}
                    >
                      <div
                        className="text-xs font-mono font-bold mb-2 inline-block px-2 py-0.5 rounded"
                        style={{ background: `${accent}15`, color: accent }}
                      >
                        {m.date}
                      </div>
                      <h4 className="font-display font-bold text-white text-lg mb-1">{m.event}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>

                      {m.schedule && (
                        <div
                          className={`make-mt-4 pt-4 border-t space-y-2 ${alignLeft ? "md:text-right" : ""}`}
                          style={{ borderColor: "var(--border)" }}
                        >
                          {m.schedule.map((item) => (
                            <div
                              key={item}
                              className={`flex items-center gap-2 text-sm text-muted-foreground ${
                                alignLeft ? "md:flex-row-reverse" : ""
                              }`}
                            >
                              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: TEAL }} />
                              <span>{item}</span>
                              <ComingSoonBadge />
                            </div>
                          ))}
                        </div>
                      )}
                    </InteractiveCard>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
//TODO Delete PROGRAM PAGE!!!!!!
// ─── Program & Schedule ───────────────────────────────────────────────────────
function ProgramPage() {
  const importantDates = [
    { date: "Q1 2026", event: "Registration Opens", status: "upcoming" },
    { date: "Q1 2026", event: "Team Registration Deadline", status: "upcoming" },
    { date: "Q2 2026", event: "Abstract Submission Deadline", status: "upcoming" },
    { date: "Q2 2026", event: "Poster Submission Deadline", status: "upcoming" },
    { date: "TBA", event: "SRC 2026 Conference", status: "main" },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Agenda</SectionTag>
        <SectionTitle>Program & Schedule</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Important Dates */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: TEAL }} /> Important Dates
            </h3>
            <div className="space-y-3">
              {importantDates.map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: item.status === "main" ? `${ORANGE}40` : "var(--border)" }}>
                  <div className="text-xs font-mono font-bold px-3 py-1.5 rounded text-center min-w-[80px]" style={{ background: item.status === "main" ? `${ORANGE}15` : `${TEAL}12`, color: item.status === "main" ? ORANGE : TEAL }}>
                    {item.date}
                  </div>
                  <span className="text-sm text-foreground font-medium">{item.event}</span>
                  {item.status === "main" && <Star className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: ORANGE }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon schedule */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: TEAL }} /> Conference Schedule
            </h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${TEAL}15` }}>
                  <Calendar className="w-8 h-8" style={{ color: TEAL }} />
                </div>
                <ComingSoonBadge />
                <h4 className="font-display font-bold text-white text-xl mt-4 mb-2">Full Schedule Coming Soon</h4>
                <p className="text-muted-foreground text-sm">The detailed conference agenda including daily schedule, ceremony times, workshop slots, and competition rounds will be published here.</p>
              </div>
              <div className="border-t p-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                {["Opening Ceremony", "Chem-E-Car Competition", "Technical Sessions", "Workshops", "Networking Events", "Closing Gala"].map((item) => (
                  <div key={item} className="flex items-center justify-between text-sm py-1">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" style={{ color: TEAL }} /> {item}
                    </span>
                    <ComingSoonBadge />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Teams & Delegations ──────────────────────────────────────────────────────
function TeamsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Delegations</SectionTag>
        <SectionTitle>Teams & Universities</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              SRC 2026 welcomes competing teams and delegations from universities across Saudi Arabia, the GCC, and the broader region. International teams are warmly invited.
            </p>
            <div className="space-y-4">
              {[
                { title: "Eligibility", text: "Undergraduate chemical engineering (or related) students at accredited universities with an active AIChE student chapter." },
                { title: "Team Composition", text: "Team sizes vary by competition. Chem-E-Car: 2-10 members. ChemE Jeopardy: 3-4 members. Technical Presentation: individual. Poster: 1-3 authors." },
                { title: "International Teams", text: "Teams from outside Saudi Arabia are welcome. Travel support information will be provided upon registration. KFUPM has accommodation partnerships for visiting delegations." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Participating Teams</h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-8 text-center">
                <ComingSoonBadge />
                <p className="text-muted-foreground text-sm mt-4">Registered teams and universities will be listed here once registration opens.</p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8 mb-4">Team Coordinator Contact</h3>
            <div className="rounded-lg p-5 border" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
              <p className="text-sm text-muted-foreground mb-3">For team registration questions, guidelines, and coordination:</p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="w-4 h-4" style={{ color: TEAL }} />
                teams.src2026@kfupm.edu.sa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Logistics ────────────────────────────────────────────────────────────────
function LogisticsPage() {
  const faqs = [
    { q: "How do I get to KFUPM?", a: "KFUPM is located in Dhahran, Eastern Province, Saudi Arabia. The nearest airport is King Fahd International Airport (DMM) in Dammam, approximately 30 minutes away by road." },
    { q: "Are there on-campus accommodation options?", a: "Visiting delegations may be eligible for on-campus guest housing. Details will be confirmed closer to the conference date. Several hotels are available near the KFUPM campus." },
    { q: "Is parking available?", a: "Yes, ample free parking is available on the KFUPM campus for registered attendees and teams." },
    { q: "What transportation is available from the airport?", a: "Taxis, ride-hailing apps (Uber, Careem), and rental cars are available from DMM airport. A shuttle service for registered teams is under consideration." },
  ];

  const hotels = [
    { name: "On-Campus Guest Housing", note: "Available for registered teams — contact teams.src2026@kfupm.edu.sa" },
    { name: "Dhahran Palace Hotel", note: "~5 min from campus · dhahranpalacehotel.com" },
    { name: "JW Marriott Dammam", note: "~20 min from campus · marriott.com" },
    { name: "Le Méridien Al Khobar", note: "~15 min from campus · marriott.com" },
  ];

  const travel = [
    { icon: <Globe className="w-4 h-4" />, label: "Nearest Airport", value: "King Fahd International Airport (DMM), Dammam" },
    { icon: <Clock className="w-4 h-4" />, label: "Drive from Airport", value: "~30 minutes" },
    { icon: <MapPin className="w-4 h-4" />, label: "City", value: "Dhahran, Eastern Province, Saudi Arabia" },
    { icon: <CheckCircle className="w-4 h-4" />, label: "Visa", value: "eVisa available for most nationalities — visitsaudi.com" },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const logisticsMailto = `mailto:logistics.src2026@kfupm.edu.sa?subject=${encodeURIComponent("Accommodation & travel — SRC 2026")}`;

  return (
    <div className="relative overflow-hidden pt-24 pb-28" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}>
      {/* Scoped animations (same as FAQ) */}
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }
      `}</style>

      {/* Molecule network background */}
      <MoleculeNetwork />
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)", animation: "faqFloat 14s ease-in-out infinite, faqGlow 9s ease-in-out infinite" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "faqDrift 18s ease-in-out infinite, faqGlow 11s ease-in-out infinite" }} />
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
      }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title — screenshot style: line + eyebrow, white + gradient over two lines */}
        <div className="faq-pop">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL})` }} />
            <span className="text-xs font-mono tracking-[0.32em] uppercase" style={{ color: TEAL }}>Logistics</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Venue &amp;</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Travel</span>
          </h2>
          <Divider />
        </div>

        {/* Cards — each takes the full row */}
        <div className="space-y-6 mt-4">
          {/* Venue */}
          <GlassCard className="p-6" delay={120}>
            <h3 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: ORANGE }} /> Venue
            </h3>
            <h4 className="font-bold text-white mb-1">King Fahd University of Petroleum &amp; Minerals</h4>
            <p className="text-muted-foreground text-sm mb-5">KFUPM Main Campus, Dhahran 31261, Eastern Province, Saudi Arabia</p>
            <div className="rounded-lg overflow-hidden h-56 flex items-center justify-center" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: TEAL }} />
                <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
              </div>
            </div>
          </GlassCard>

          {/* Accommodation */}
          <GlassCard className="p-6" delay={190}>
            <h3 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: ORANGE }} /> Accommodation
            </h3>
            <div className="space-y-3">
              {hotels.map((hotel) => (
                <div key={hotel.name} className="rounded-lg p-4 text-sm" style={{ background: "rgba(7,17,30,0.5)", border: `1px solid ${ORANGE}18` }}>
                  <span className="font-medium text-white">{hotel.name}</span>
                  <p className="text-muted-foreground text-xs mt-0.5">{hotel.note}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Travel Information */}
          <GlassCard className="p-6" delay={260}>
            <h3 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5" style={{ color: ORANGE }} /> Travel Information
            </h3>
            <div className="space-y-3">
              {travel.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-lg p-4" style={{ background: "rgba(7,17,30,0.5)", border: `1px solid ${ORANGE}18` }}>
                  <span style={{ color: TEAL }} className="mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* FAQs for Visitors */}
          <GlassCard className="p-6" delay={330}>
            <h3 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" style={{ color: ORANGE }} /> FAQs for Visitors
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={faq.q} className="rounded-lg overflow-hidden" style={{ background: "rgba(7,17,30,0.5)", border: `1px solid ${isOpen ? `${ORANGE}55` : `${ORANGE}18`}` }}>
                    <button className="w-full flex items-center justify-between p-4 text-left focus:outline-none" onClick={() => setOpenFaq(isOpen ? null : i)}>
                      <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                      <span style={{ color: ORANGE }} className="flex-shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t" style={{ borderColor: `${ORANGE}20` }}>
                        <div className="pt-3">{faq.a}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Still have a question? — opens the logistics inbox (FAQ-style link) */}
        <div className="faq-pop mt-10 flex flex-col items-start text-left">
          <a href={logisticsMailto} className="inline-flex items-center gap-1 font-semibold text-sm transition-all hover:opacity-80 no-underline" style={{ color: ORANGE }}>
            Still have a question?
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Partnership Page ─────────────────────────────────────────────────────────
function PartnershipPage() {
  const tiers = [
    {
      name: "Standard",
      color: "#4A9BB5",
      perks: ["Logo on conference website", "Logo on event signage", "2 attendee passes", "Social media mention", "Certificate of partnership"],
    },
    {
      name: "Strategic",
      color: TEAL,
      featured: true,
      perks: ["All Standard benefits", "Branded workshop slot", "Booth at career fair", "10 attendee passes", "Featured in conference materials", "Speaking opportunity", "Student CV access"],
    },
    {
      name: "Premier",
      color: ORANGE,
      perks: ["All Strategic benefits", "Title sponsorship opportunity", "Exclusive branding on main stage", "30 attendee passes", "Dedicated networking session", "Video feature in conference", "Priority job fair placement", "Year-round brand exposure"],
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Grow Together</SectionTag>
        <SectionTitle>Partnership & Sponsorship</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              SRC 2026 offers unparalleled access to the GCC's top undergraduate engineering talent. Partner with us to build your brand, recruit future leaders, and demonstrate commitment to engineering education.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Users />, title: "Talent Access", text: "Direct connection with 1,000+ top chemical engineering students from the GCC's leading universities." },
                { icon: <Star />, title: "Brand Visibility", text: "Prominent placement in all conference materials, digital channels, and event signage." },
                { icon: <Heart />, title: "CSR Impact", text: "Invest in the future of STEM education and the region's next generation of engineers." },
                { icon: <Network />, title: "Industry Engagement", text: "Position your company as a leader in shaping the engineering landscape of the GCC." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span style={{ color: TEAL }} className="mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Partnership Tiers</h3>
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div key={tier.name} className="rounded-xl border p-5" style={{ background: tier.featured ? `${TEAL}08` : "var(--card)", borderColor: tier.featured ? `${TEAL}40` : "var(--border)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-lg font-extrabold" style={{ color: tier.color }}>{tier.name}</span>
                    {tier.featured && <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: TEAL, background: `${TEAL}15`, border: `1px solid ${TEAL}40` }}>Most Popular</span>}
                  </div>
                  <ul className="space-y-1">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: tier.color }} /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Also available: Academic, Service & Custom partnerships.</p>
              <div className="flex flex-wrap gap-3">
                <CTAButton primary>Request Partnership Proposal <ArrowRight className="w-4 h-4" /></CTAButton>
                <CTAButton>Book a Discussion</CTAButton>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" style={{ color: TEAL }} /> partners.src2026@kfupm.edu.sa
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" style={{ color: TEAL }} /> +966 13 860 0000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sponsors Page ────────────────────────────────────────────────────────────
function SponsorsPage() {
  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <MoleculeNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTag>Thank You</SectionTag>
        <SectionTitle>Sponsors & Partners</SectionTitle>
        <Divider />

        {[
          { level: "Main Host", color: ORANGE },
          { level: "Premier Sponsors", color: TEAL },
          { level: "Strategic Partners", color: TEAL },
          { level: "Supporters", color: "#4A9BB5" },
          { level: "Academic Partners", color: "#4A9BB5" },
        ].map((group, i) => (
          <RevealOnScroll key={group.level} delay={i * 100} className="mb-32">
            <h3 className="font-display text-xl font-bold mb-15 flex items-center gap-3" style={{ color: group.color }}>
              <span className="w-8 h-0.5 inline-block" style={{ background: group.color }} />
              {group.level}
            </h3>
            <div className="rounded-xl border p-10 flex flex-wrap gap-8 items-center justify-center min-h-[120px] transition-all duration-500" style={{ background: `${group.color}0d`, borderColor: `${group.color}40` }}>
              <div className="text-center">
                <ComingSoonBadge />
                <p className="text-xs text-muted-foreground mt-2">Announcements coming soon</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}

        <RevealOnScroll>
          <div className="mt-20 text-center">
            <p className="text-xs text-muted-foreground">
              Interested in sponsoring? Join us as a partner and make a lasting impact
              on the engineering community of the GCC.
            </p>
            <button className="mt-2 text-xs font-medium transition-opacity hover:opacity-80" style={{ color: TEAL }}>
              View Partnership Packages →
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}

// ─── Speakers Page ────────────────────────────────────────────────────────────
function SpeakersPage() {
  const categories = [
    { label: "Keynote Speakers", icon: <Mic2 className="w-7 h-7" />, desc: "Industry leaders and innovators sharing their vision for the future of chemical engineering.", color: TEAL },
    { label: "Competition Judges", icon: <Award className="w-7 h-7" />, desc: "Experienced engineers and academics evaluating student work across all competitions.", color: ORANGE },
    { label: "Mentors & Guests", icon: <Star className="w-7 h-7" />, desc: "Industry professionals available for 1-on-1 mentoring, career advice, and networking.", color: TEAL },
  ];

  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <MoleculeNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTag>Meet The Experts</SectionTag>
        <SectionTitle>Speakers, Judges & Mentors</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-3 gap-8 mb-12 mt-8">
          {categories.map((cat, i) => (
            <RevealOnScroll key={cat.label} delay={i * 120}>
              <InteractiveCard
                accent={cat.color}
                className="group relative rounded-2xl p-8 overflow-hidden text-center transition-colors duration-300"
                style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${cat.color}30` }}
              >
                {/* Corner glow blob — same treatment as Mission/Vision cards */}
                <div
                  className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${cat.color}40 0%, transparent 70%)`, filter: "blur(28px)" }}
                />

                <div className="relative flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${cat.color}18`, color: cat.color, boxShadow: `inset 0 0 0 1px ${cat.color}40` }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{cat.desc}</p>
                  <ComingSoonBadge />
                </div>
              </InteractiveCard>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-35 text-center text-xs text-muted-foreground">
            Interested in speaking or judging?{" "}
            <span className="cursor-pointer font-medium" style={{ color: ORANGE }}>
              Express Interest →
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
// ─── Organizing Team ──────────────────────────────────────────────────────────
function OrganizingPage() {
  const leadership = [
    { title: "Conference Advisor", note: "Faculty oversight and strategic guidance", icon: <Star className="w-6 h-6" />, color: TEAL },
    { title: "Conference Chair", note: "Overall leadership and direction", icon: <Award className="w-7 h-7" />, color: ORANGE, featured: true },
    { title: "Vice Chair", note: "Operational coordination", icon: <Target className="w-6 h-6" />, color: TEAL },
  ];

  const committees = [
    { title: "Competitions Committee", note: "All competition logistics and judging" },
    { title: "Logistics Committee", note: "Venue, accommodation, transportation" },
    { title: "Marketing & Media Committee", note: "Communications, social media, press" },
    { title: "Partnerships Committee", note: "Sponsorship and partner relations" },
    { title: "Technical Program Committee", note: "Sessions, workshops, speakers" },
    { title: "Volunteer Committee", note: "Volunteer coordination and training" },
    { title: "Registration Committee", note: "Participant and team registration" },
  ];

  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <MoleculeNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTag>The Team Behind SRC</SectionTag>
        <SectionTitle>Organizing Committee</SectionTitle>
        <Divider />

        {/* ─── Hero: photo + intro text ─── */}
        <RevealOnScroll>
          <div className="grid md:grid-cols-12 gap-10 items-center mb-20 mt-4">
            <div className="md:col-span-5 flex justify-center">
              {/* "Photograph" placeholder — white mat, slight tilt, like a printed photo */}
              <div
                className="bg-white rounded-sm p-3 pb-9 shadow-2xl rotate-[-1.5deg] w-full max-w-sm"
              >
                <div className="aspect-[4/3] rounded-sm overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Users className="w-16 h-16 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl">
                SRC 2026 is organized by a dedicated team of KFUPM students under faculty and professional guidance. Full team profiles will be published soon.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* ─── Leadership ─── */}
        <div className="mb-20">
          <RevealOnScroll>
            <div className="mb-7"><GradientEyebrow>Leadership</GradientEyebrow></div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 items-end">
            {leadership.map((person, i) => (
              <RevealOnScroll key={person.title} delay={i * 120}>
                <div
                  className={`rounded-2xl border p-6 text-center ${person.featured ? "sm:scale-105" : ""}`}
                  style={{
                    background: person.featured ? `${person.color}0d` : "rgba(13,30,48,0.55)",
                    borderColor: `${person.color}40`,
                  }}
                >
                  {/* Small photo placeholder per person */}
                  <div className="bg-white rounded-sm p-2 pb-5 shadow-lg mx-auto mb-4 w-28">
                    <div
                      className="aspect-square rounded-sm flex items-center justify-center"
                      style={{ background: `${person.color}1a`, color: person.color }}
                    >
                      {person.icon}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-white text-base mb-1">{person.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{person.note}</p>
                  <ComingSoonBadge />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* ─── Committees — each with a horizontal scrolling member strip ─── */}
        <div className="mb-12">
          <RevealOnScroll>
            <div className="mb-7"><GradientEyebrow>Committees</GradientEyebrow></div>
          </RevealOnScroll>

          <div className="space-y-14">
            {committees.map((committee, i) => (
              <RevealOnScroll key={committee.title}>
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display font-black text-sm"
                      style={{ background: `${TEAL}15`, color: TEAL }}
                    >
                      {committee.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{committee.title}</p>
                      <p className="text-xs text-muted-foreground">{committee.note}</p>
                    </div>
                  </div>

                  <Marquee reverse={i % 2 === 1} speed={40}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-36 shrink-0 rounded-xl p-4 flex flex-col items-center text-center"
                        style={{ background: "rgba(13,30,48,0.5)", border: `1px solid ${TEAL}22` }}
                      >
                        <div
                          className="w-14 h-14 rounded-full mb-3 flex items-center justify-center"
                          style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}30`, color: `${TEAL}99` }}
                        >
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="h-2 w-16 rounded-full mb-2" style={{ background: `${TEAL}22` }} />
                        <div className="h-2 w-10 rounded-full" style={{ background: `${TEAL}15` }} />
                      </div>
                    ))}
                  </Marquee>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll>
  <div className="text-center">
    <ComingSoonBadge />
    <p className="text-muted-foreground text-sm mt-4">Individual team member profiles and photos will be published here soon.</p>
  </div>
</RevealOnScroll>
      </div>
    </div>
  );
}
// ─── Media Center ─────────────────────────────────────────────────────────────
function MediaPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>News & Resources</SectionTag>
        <SectionTitle>Media Center</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Announcements */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: ORANGE }} /> Latest Announcements
            </h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-8 text-center">
                <ComingSoonBadge />
                <p className="text-muted-foreground text-sm mt-4">Conference announcements and news will appear here.</p>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Follow SRC 2026</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Instagram className="w-5 h-5" />, label: "@src2026kfupm", platform: "Instagram", color: "#E1306C" },
                { icon: <Twitter className="w-5 h-5" />, label: "@SRC2026KFUPM", platform: "X (Twitter)", color: "#1DA1F2" },
                { icon: <Linkedin className="w-5 h-5" />, label: "SRC 2026 KFUPM", platform: "LinkedIn", color: "#0A66C2" },
                { icon: <Youtube className="w-5 h-5" />, label: "SRC 2026", platform: "YouTube", color: "#FF0000" },
              ].map((s) => (
                <div key={s.platform} className="rounded-lg border p-4 flex items-center gap-3 hover:border-white/20 transition-colors cursor-pointer" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{s.platform}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4">Press & Brand Kit</h3>
            <div className="space-y-3">
              {[
                { label: "Download Conference Brief", icon: <Download className="w-4 h-4" /> },
                { label: "Brand Kit / Logos", icon: <Layers className="w-4 h-4" /> },
                { label: "Press Kit", icon: <FileText className="w-4 h-4" /> },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-lg border text-sm font-medium text-foreground hover:border-[#0CBFCE]/40 hover:text-white transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span className="flex items-center gap-2">{item.icon}{item.label}</span>
                  <ComingSoonBadge />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo gallery placeholder */}
        <div>
          <h3 className="font-display text-xl font-bold text-white mb-6">Photo Gallery</h3>
          <div className="rounded-xl border p-12 text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <ComingSoonBadge />
            <p className="text-muted-foreground text-sm mt-4">Conference photos and highlights will be shared here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Page ───────────────────────────────────────────────────────────────
function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Who can attend SRC 2026?", a: "SRC 2026 is open to undergraduate students in chemical engineering or related disciplines, faculty advisors, industry professionals, and anyone interested in engineering education. Some events may require a registered student affiliation." },
    { q: "How can teams register for competitions?", a: "Team registration will open in Q1 2026. Teams must represent a university with an active AIChE student chapter. Visit the Registration page for the link when available, or contact teams.src2026@kfupm.edu.sa." },
    { q: "What competitions are offered?", a: "SRC 2026 features: Chem-E-Car, ChemE Jeopardy, Student Technical Presentation Competition, and Undergraduate Student Poster Competition. See the Competitions page for full details." },
    { q: "Are there hotel or accommodation options?", a: "Yes. On-campus guest housing may be available for visiting teams. Several hotels are located within 5-20 minutes of KFUPM campus including Dhahran Palace Hotel, JW Marriott Dammam, and Le Méridien Al Khobar." },
    { q: "How can companies partner with SRC 2026?", a: "Visit the Partnership page to review sponsorship tiers (Standard, Strategic, Premier) and special partnership categories. Send an inquiry to partners.src2026@kfupm.edu.sa or request a proposal online." },
    { q: "Who should sponsors contact?", a: "For all sponsorship and partnership inquiries: partners.src2026@kfupm.edu.sa | +966 13 860 0000. Our partnership team will respond within 2 business days." },
    { q: "Where is the conference held?", a: "At King Fahd University of Petroleum & Minerals (KFUPM), Dhahran, Eastern Province, Saudi Arabia — near Dammam and Al Khobar in the Eastern Province." },
    { q: "What are the important dates?", a: "Registration opens in Q1 2026. Competition deadlines, submission dates, and the conference schedule will be announced on the Program page and our social media channels. Sign up for notifications at src2026@kfupm.edu.sa." },
    { q: "Is SRC 2026 only for Saudi students?", a: "No. International teams from GCC countries and beyond are warmly welcomed. We encourage participation from any university with an AIChE student chapter." },
    { q: "How do I volunteer?", a: "A volunteer interest form will be available on the Registration page soon. Contact us at src2026@kfupm.edu.sa to be notified when it opens." },
  ];

  const askMailto = `mailto:src2026@kfupm.edu.sa?subject=${encodeURIComponent("Question about SRC 2026")}`;

  return (
    <div className="relative overflow-hidden pt-24 pb-28" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}>
      {/* Scoped animations */}
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }
      `}</style>

      <MoleculeNetwork />
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)", animation: "faqFloat 14s ease-in-out infinite, faqGlow 9s ease-in-out infinite" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "faqDrift 18s ease-in-out infinite, faqGlow 11s ease-in-out infinite" }} />
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 35%, black 30%, transparent 80%)",
      }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header — eyebrow line + gradient title (matches Logistics) */}
        <div className="faq-pop" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-3 mb-7">
            <span className="w-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL})` }} />
            <span className="text-xs font-mono tracking-[0.32em] uppercase" style={{ color: TEAL }}>Got Questions?</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Frequently Asked</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Questions</span>
          </h2>
          <Divider />
        </div>

        {/* Question Cards Stack */}
        <div className="space-y-3 mt-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="faq-pop relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(13,30,48,0.55)",
                  border: `1px solid ${isOpen ? `${ORANGE}75` : `${ORANGE}22`}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: isOpen
                    ? `0 20px 50px -16px ${ORANGE}40, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  animationDelay: `${140 + i * 70}ms`,
                }}
              >
                {/* Thick reflection cut with a finely lowered stable opacity */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(115deg, transparent 6%, rgba(255,255,255,0.0) 9%, rgba(255,255,255,0.08) 13%, rgba(255,255,255,0.13) 16%, rgba(255,255,255,0.0) 21%, transparent 26%)",
                  }}
                />

                {/* Internal static ambient background orange glow */}
                <div
                  className="absolute right-0 top-0 w-80 h-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 30%, ${ORANGE}1E 0%, ${ORANGE}08 50%, transparent 100%)`,
                  }}
                />

                {/* Main top edge active flash overflow backdrop glow */}
                <div
                  className="absolute inset-x-0 -top-16 h-48 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(60% 80% at 50% 0%, ${ORANGE}5C 0%, ${ORANGE}26 38%, transparent 72%)`,
                    filter: "blur(10px)",
                    opacity: isOpen ? 0.95 : 0.7,
                    zIndex: 0,
                  }}
                />

                {/* Orange status indicator bar on the top edge right side */}
                <div 
                  className="absolute top-0 right-14 w-12 h-1 rounded-b-md transition-all duration-300 pointer-events-none"
                  style={{ 
                    background: isOpen ? ORANGE : `${ORANGE}25`,
                    boxShadow: isOpen ? `0 1px 10px ${ORANGE}` : "none"
                  }} 
                />

                {/* Question Trigger Row */}
                <button
                  className="relative z-10 w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-semibold text-white text-sm pr-4 tracking-wide">
                    {faq.q}
                  </span>
                  <span style={{ color: ORANGE }} className="flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Answer Area */}
                {isOpen && (
                  <div
                    className="relative z-10 px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t"
                    style={{ borderColor: `${ORANGE}26` }}
                  >
                    <div className="pt-4 text-foreground/85 font-normal">{faq.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hyperlink section optimized down to text-sm scale footprint */}
        <div
          className="faq-pop mt-10 flex flex-col items-end text-right"
          style={{ animationDelay: `${140 + faqs.length * 70 + 80}ms` }}
        >
          <a
            href={askMailto}
            className="inline-flex items-center gap-1 font-semibold text-sm transition-all hover:opacity-80 no-underline"
            style={{ color: ORANGE }}
          >
            Still have a question?
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { label: "General Inquiries", email: "src2026@kfupm.edu.sa", icon: <Mail /> },
    { label: "Partnership & Sponsorship", email: "partners.src2026@kfupm.edu.sa", icon: <Building2 /> },
    { label: "Team Registration", email: "teams.src2026@kfupm.edu.sa", icon: <Users /> },
    { label: "Logistics & Accommodation", email: "logistics.src2026@kfupm.edu.sa", icon: <MapPin /> },
    { label: "Media & Press", email: "media.src2026@kfupm.edu.sa", icon: <FileText /> },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Get In Touch</SectionTag>
        <SectionTitle>Contact Us</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Our team is here to help. Whether you have questions about registration, partnerships, logistics, or the program — reach out and we'll get back to you promptly.
            </p>

            <div className="space-y-3 mb-8">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center gap-4 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span style={{ color: TEAL }} className="flex-shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <a href={`mailto:${c.email}`} className="text-sm font-medium hover:underline" style={{ color: TEAL }}>{c.email}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-white">+966 13 860 0000</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-white">KFUPM, Dhahran 31261,<br />Eastern Province, Saudi Arabia</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, color: "#E1306C" },
                { icon: <Twitter className="w-4 h-4" />, color: "#1DA1F2" },
                { icon: <Linkedin className="w-4 h-4" />, color: "#0A66C2" },
                { icon: <Youtube className="w-4 h-4" />, color: "#FF0000" },
              ].map((s, i) => (
                <button key={i} className="w-9 h-9 rounded-lg flex items-center justify-center border hover:border-white/30 transition-colors" style={{ background: "var(--card)", borderColor: "var(--border)", color: s.color }}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-xl border p-8" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: TEAL }} />
                <h3 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 48 hours.</p>
                <button className="mt-6 text-sm underline" style={{ color: TEAL }} onClick={() => setSent(false)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-xl font-bold text-white mb-2">Send a Message</h3>
                {[
                  { label: "Your Name", key: "name", type: "text", placeholder: "Ahmed Al-Rashidi" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "ahmed@university.edu" },
                  { label: "Subject", key: "subject", type: "text", placeholder: "Partnership Inquiry" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#0CBFCE]/60 transition-colors"
                      style={{ background: "var(--input-background)", border: `1px solid var(--border)`, color: "var(--foreground)" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg text-sm resize-none outline-none focus:border-[#0CBFCE]/60 transition-colors"
                    style={{ background: "var(--input-background)", border: `1px solid var(--border)`, color: "var(--foreground)" }}
                  />
                </div>
                <CTAButton primary className="w-full justify-center">
                  Send Message <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setSection }: { setSection: (s: Section) => void }) {
  const links: { label: string; section: Section }[] = [
    { label: "Home", section: "home" },
    { label: "About", section: "about" },
    { label: "Competitions", section: "competitions" },
    { label: "Program", section: "program" },
    { label: "Teams", section: "teams" },
    { label: "Logistics", section: "logistics" },
    { label: "Partnership", section: "partnership" },
    { label: "Sponsors", section: "sponsors" },
    { label: "Speakers", section: "speakers" },
    { label: "Organizing Team", section: "organizing" },
    { label: "Media", section: "media" },
    { label: "FAQ", section: "faq" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <footer className="border-t" style={{ background: "#050D18", borderColor: `${TEAL}15` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <SRCLogo size={70} />
            <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-sm leading-relaxed">
              The first AIChE Student Regional Conference in the GCC — bringing together the brightest chemical engineering minds across the region.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, color: "#E1306C" },
                { icon: <Twitter className="w-4 h-4" />, color: "#1DA1F2" },
                { icon: <Linkedin className="w-4 h-4" />, color: "#0A66C2" },
                { icon: <Youtube className="w-4 h-4" />, color: "#FF0000" },
              ].map((s, i) => (
                <button key={i} className="w-9 h-9 rounded-lg flex items-center justify-center border hover:border-white/30 transition-colors" style={{ background: "#0D1E30", borderColor: `${TEAL}20`, color: s.color }}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {links.slice(0, 7).map((l) => (
                <li key={l.section}>
                  <button onClick={() => setSection(l.section)} className="text-sm text-muted-foreground hover:text-white transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">More</h4>
            <ul className="space-y-2 mb-6">
              {links.slice(7).map((l) => (
                <li key={l.section}>
                  <button onClick={() => setSection(l.section)} className="text-sm text-muted-foreground hover:text-white transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" style={{ color: TEAL }} />
                src2026@kfupm.edu.sa
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" style={{ color: TEAL }} />
                KFUPM, Dhahran, Saudi Arabia
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: `${TEAL}15` }}>
          <p className="text-xs text-muted-foreground">
            © 2026 SRC KFUPM · AIChE Student Chapter · All rights reserved
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Powered by <span className="font-semibold" style={{ color: TEAL }}>AIChE</span> · Hosted by <span className="font-semibold text-white">KFUPM</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState<Section>("home");
  const [regModalOpen, setRegModalOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  const openRegModal = () => setRegModalOpen(true);
  const closeRegModal = () => setRegModalOpen(false);

  const pages: Record<Section, React.ReactNode> = {
    home: <HomePage setSection={setSection} onRegisterOpen={openRegModal} />,
    about: <AboutPage />,
    competitions: <CompetitionsPage />,
    registration: <RegistrationPage />,
    program: <ProgramPage />,
    teams: <TeamsPage />,
    logistics: <LogisticsPage />,
    partnership: <PartnershipPage />,
    sponsors: <SponsorsPage />,
    speakers: <SpeakersPage />,
    organizing: <OrganizingPage />,
    media: <MediaPage />,
    faq: <FAQPage />,
    contact: <ContactPage />,
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}
    >
      <style>{`
        .font-display { font-family: 'Exo 2', sans-serif; }
        .font-mono { font-family: 'Thamanyah Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${TEAL}40; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${TEAL}70; }
        details summary::-webkit-details-marker { display: none; }
        .src-reveal {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity .8s cubic-bezier(.16,.84,.44,1),
              transform .8s cubic-bezier(.16,.84,.44,1);
  will-change: opacity, transform;
}
.src-reveal.is-in {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .src-reveal { opacity: 1; transform: none; transition: none; }
}
      `}</style>

      <Navbar active={section} setSection={setSection} onRegisterOpen={openRegModal} />

      <main>
        {pages[section]}
      </main>

      <Footer setSection={setSection} />

      {regModalOpen && <RegistrationModal onClose={closeRegModal} />}
    </div>
  );
}

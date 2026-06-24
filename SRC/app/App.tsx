import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, ArrowRight, MapPin, Calendar,
  Users, Trophy, Mic2, Building2, Mail, Phone, ExternalLink, Download,
  Star, Award, Zap, Globe, BookOpen, Layers, Heart, Target, Eye,
  CheckCircle, Clock, Instagram, Twitter, Linkedin, Youtube,
  FlaskConical, Presentation, FileText, Lightbulb, Network, Wrench,
  MessageSquare, HelpCircle, ChevronUp
} from "lucide-react";
import srcLogoImg from "@/imports/Screenshot_2026-06-19_160229.png";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section =
  | "home" | "about" | "competitions" | "registration" | "program"
  | "teams" | "logistics" | "partnership" | "sponsors" | "speakers"
  | "organizing" | "media" | "faq" | "contact";

// ─── Brand constants ──────────────────────────────────────────────────────────
const TEAL = "#0CBFCE";
const ORANGE = "#E87C2A";

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

function CTAButton({ children, primary, onClick, className = "" }: {
  children: React.ReactNode; primary?: boolean; onClick?: () => void; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200 ${
        primary
          ? "text-[#07111E] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          : "border text-foreground hover:bg-white/5 active:scale-[0.98]"
      } ${className}`}
      style={
        primary
          ? { background: `linear-gradient(135deg, ${TEAL}, #08A8B8)` }
          : { borderColor: `${TEAL}50` }
      }
    >
      {children}
    </button>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: ORANGE, background: `${ORANGE}15`, border: `1px solid ${ORANGE}40` }}>
      <Clock className="w-3 h-3" /> Coming Soon
    </span>
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
}function Marquee({ children, reverse = false, speed = 55 }: { children: React.ReactNode; reverse?: boolean; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const offset = useRef(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          offset.current += speed * dt;
          if (offset.current >= half) offset.current -= half;
          const x = reverse ? offset.current - half : -offset.current;
          track.style.transform = `translateX(${x}px)`;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reverse, speed]);
  return (
    <div
      className="src-edge-fade overflow-hidden"
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
function SRCLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        {/* Saudi Arabia map silhouette simplified */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
          <path
            d="M8 12 L14 10 L18 8 L22 9 L26 8 L30 11 L32 14 L32 20 L28 24 L26 30 L22 32 L20 28 L16 26 L12 27 L10 24 L8 20 Z"
            fill="#4A5568" opacity="0.8"
          />
          <text x="6" y="28" fontFamily="'Exo 2', sans-serif" fontWeight="900" fontSize="14" letterSpacing="1">
            <tspan fill={TEAL}>S</tspan>
            <tspan fill={ORANGE} dy="0">R</tspan>
            <tspan fill={TEAL}>C</tspan>
          </text>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-white text-sm tracking-widest">SRC 2026</span>
        <span className="text-[10px] font-mono tracking-wide" style={{ color: TEAL }}>KFUPM · AIChE</span>
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const navItems: { label: string; section: Section }[] = [
  { label: "Home", section: "home" },
  { label: "About", section: "about" },
  { label: "Competitions", section: "competitions" },
  { label: "Program", section: "program" },
  { label: "Registration", section: "registration" },
  { label: "Logistics", section: "logistics" },
  { label: "Partnership", section: "partnership" },
  { label: "Contact", section: "contact" },
];

function Navbar({ active, setSection }: { active: Section; setSection: (s: Section) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const mainNav = navItems.slice(0, 6);
  const moreNav: { label: string; section: Section }[] = [
    { label: "Organizing Team", section: "organizing" },
    { label: "Media", section: "media" },
    { label: "FAQ", section: "faq" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,17,30,0.97)" : "rgba(7,17,30,0.4)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? `1px solid ${TEAL}20` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setSection("home")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <SRCLogo size={36} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNav.map((item) => (
            <button
              key={item.section}
              onClick={() => setSection(item.section)}
              className={`px-3 py-2 text-sm font-medium rounded transition-all ${
                active === item.section
                  ? "text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
              style={active === item.section ? { color: TEAL } : {}}
            >
              {item.label}
            </button>
          ))}
          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white rounded transition-all flex items-center gap-1"
            >
              More <ChevronDown className="w-3 h-3" />
            </button>
            {moreOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-2xl"
                style={{ background: "#0D1E30", border: `1px solid ${TEAL}25` }}
              >
                {moreNav.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => { setSection(item.section); setMoreOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <CTAButton onClick={() => setSection("partnership")}>Become a Partner</CTAButton>
          <CTAButton primary onClick={() => setSection("registration")}>Register Now</CTAButton>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ background: "rgba(7,17,30,0.98)", borderTop: `1px solid ${TEAL}20` }}>
          {[...navItems, ...moreNav].map((item) => (
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
            <CTAButton onClick={() => { setSection("partnership"); setMobileOpen(false); }}>Become a Partner</CTAButton>
            <CTAButton primary onClick={() => { setSection("registration"); setMobileOpen(false); }}>Register Now</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero Logo (large brand mark with traveling glow outline) ─────────────────
function HeroLogo() {
  // Saudi silhouette path — shared between fill, base stroke, and animated stroke
  const SAUDI_PATH =
    "M60 80 L120 60 L180 50 L240 55 L300 48 L360 60 L410 80 L430 110 L440 150 L430 190 L410 230 L390 260 L370 280 L350 310 L330 340 L310 360 L295 350 L280 330 L270 310 L255 300 L240 305 L230 295 L220 270 L205 260 L190 255 L175 260 L160 255 L145 245 L135 230 L125 215 L115 195 L100 180 L80 165 L65 145 L55 120 Z";

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

      <svg
        viewBox="0 0 500 420"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full"
        aria-label="SRC 2026 logo"
      >
        <defs>
          <filter id="srcHeroGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="srcHeroFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d2238" />
            <stop offset="100%" stopColor="#0a1828" />
          </linearGradient>
          <linearGradient id="srcHeroTrace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TEAL} />
            <stop offset="60%" stopColor="#7CE7F0" />
            <stop offset="100%" stopColor={ORANGE} />
          </linearGradient>
        </defs>

        {/* Filled silhouette */}
        <path d={SAUDI_PATH} fill="url(#srcHeroFill)" />

        {/* Faint static outline so the shape is always visible */}
        <path
          d={SAUDI_PATH}
          fill="none"
          stroke={`${TEAL}33`}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Animated traveling glow — a small bright segment that runs along the perimeter */}
        <path
          d={SAUDI_PATH}
          pathLength={1000}
          fill="none"
          stroke="url(#srcHeroTrace)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#srcHeroGlow)"
          className="src-hero-trace"
        />

        {/* SRC monogram */}
        <text
          x="250"
          y="240"
          textAnchor="middle"
          fontFamily="'Exo 2', 'Inter', sans-serif"
          fontWeight={900}
          fontSize={140}
          letterSpacing={4}
        >
          <tspan fill={TEAL}>S</tspan>
          <tspan fill={ORANGE}>R</tspan>
          <tspan fill={TEAL}>C</tspan>
        </text>
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fontFamily="'Thamanyah Sans', sans-serif"
          fontWeight={600}
          fontSize={28}
          letterSpacing={6}
          fill="#FFFFFF"
          opacity={0.9}
        >
          2026
        </text>
        <text
          x="250"
          y="320"
          textAnchor="middle"
          fontFamily="'Thamanyah Sans', sans-serif"
          fontWeight={500}
          fontSize={14}
          letterSpacing={4}
          fill={TEAL}
          opacity={0.85}
        >
          KFUPM · AIChE
        </text>
      </svg>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setSection }: { setSection: (s: Section) => void }) {
  const stats = [
    { value: "1,000+", label: "Expected Participants" },
    { value: "10+", label: "Universities" },
    { value: "5+", label: "GCC Countries" },
    { value: "20+", label: "Activities & Events" },
  ];

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
        @keyframes srcOutlineTrace {
          to { stroke-dashoffset: -1000; }
        }
        .src-hero-trace {
          stroke-dasharray: 60 940;
          stroke-dashoffset: 0;
          animation: srcOutlineTrace 5.5s linear infinite;
        }
        @keyframes srcHeroFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .src-hero-logo {
          animation: srcHeroFloat 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .src-rise, .src-rise-2, .src-rise-3 { animation: none; }
          .val-card .val-desc { transition: none; }
          .src-track { animation: none; }
          .src-hero-trace, .src-hero-logo { animation: none; }
        }
      `}</style>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Geometric grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(12,191,206,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,191,206,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }} />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(12,191,206,0.08) 0%, transparent 70%)"
        }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Conference info */}
            <div className="max-w-2xl order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
                <span style={{ color: TEAL }}>SRC</span>
                <span className="text-white"> 2026</span>
                <br />
                <span className="text-white/90 text-3xl md:text-4xl font-bold">KFUPM</span>
              </h1>

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
                <CTAButton primary onClick={() => setSection("registration")}>
                  Register Now <ArrowRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton onClick={() => setSection("about")}>
                  Learn More <ChevronRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton onClick={() => setSection("partnership")}>
                  Become a Partner
                </CTAButton>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg p-4 border" style={{ background: `${TEAL}08`, borderColor: `${TEAL}20` }}>
                    <div className="font-display text-2xl md:text-3xl font-black mb-1" style={{ color: TEAL }}>{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Animated SRC logo with glowing outline */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <HeroLogo />
            </div>
          </div>
        </div>
      </section>

      {/* Quick intro */}
      <section className="py-20 border-t" style={{ borderColor: `${TEAL}15` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Trophy className="w-6 h-6" />, title: "World-Class Competitions", desc: "Chem-E-Car, ChemE Jeopardy, Student Technical Presentations, and Poster Competitions." },
              { icon: <Globe className="w-6 h-6" />, title: "International Teams", desc: "Delegations from universities across the GCC and beyond, united by engineering excellence." },
              { icon: <Network className="w-6 h-6" />, title: "Industry Connection", desc: "Direct engagement with leading energy, petrochemical, and technology companies." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-6 border group hover:border-[#0CBFCE]/40 transition-colors" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${TEAL}15`, color: TEAL }}>
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 {/* About */}
      <section className="relative overflow-hidden py-28 md:py-36 border-t" style={{ borderColor: `${TEAL}15`, background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}>
        {/* Animated molecule network */}
        <MoleculeNetwork />
        {/* Soft glow orbs */}
        <div className="absolute -left-32 top-10 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${TEAL}33 0%, transparent 65%)`, filter: "blur(60px)", animation: "srcFloat 14s ease-in-out infinite, srcGlowPulse 9s ease-in-out infinite" }} />
        <div className="absolute right-[-10rem] bottom-0 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "srcDrift 18s ease-in-out infinite, srcGlowPulse 11s ease-in-out infinite" }} />
        {/* Faint grid */}
        <div className="absolute inset-0 pointer-events-none opacity-60" style={{
          backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 80%)",
        }} />
 
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7 src-rise">
            <span className="w-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL})` }} />
            <span className="text-xs font-mono tracking-[0.32em] uppercase" style={{ color: TEAL }}>About the Conference</span>
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
                <div
                  key={item.title}
                  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(13,30,48,0.55)", border: `1px solid ${item.accent}28`, backdropFilter: "blur(6px)" }}
                >
                  <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 0 0 1px ${item.accent}55, 0 18px 50px -12px ${item.accent}55` }} />
                  <div className="relative flex items-center gap-3 mb-3">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.accent}18`, color: item.accent, boxShadow: `inset 0 0 0 1px ${item.accent}40` }}>
                      {item.icon}
                    </span>
                    <h4 className="font-display font-bold text-white text-lg">{item.title}</h4>
                  </div>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
 
          {/* Mission / Vision */}
          <div className="grid md:grid-cols-2 gap-6 mt-20 src-rise-3">
            {[
              { label: "Mission", icon: <Target className="w-5 h-5" />, color: TEAL, text: "To provide an exceptional platform that empowers chemical engineering students across the GCC to showcase their talents, engage with industry, and develop as global engineering leaders — while establishing a sustainable regional AIChE tradition." },
              { label: "Vision", icon: <Eye className="w-5 h-5" />, color: ORANGE, text: "To be the premier student engineering conference in the Middle East, recognized for its academic rigor, cultural richness, and its role in shaping the next generation of engineers who will drive the region's industrial transformation." },
            ].map((mv) => (
              <div key={mv.label} className="group relative rounded-2xl p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${mv.color}30` }}>

                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${mv.color}40 0%, transparent 70%)`, filter: "blur(28px)" }} />
                <div className="relative flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${mv.color}18`, color: mv.color }}>
                    {mv.icon}
                  </div>
                  <span className="font-display text-2xl font-extrabold text-white">{mv.label}</span>
                </div>
                <p className="relative text-muted-foreground leading-relaxed">{mv.text}</p>
              </div>
            ))}
          </div>
 
          {/* Values */}
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-6">
              <p className="text-xs font-mono tracking-[0.28em] uppercase" style={{ color: TEAL }}>What We Stand For</p>
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
              <p className="text-xs font-mono tracking-[0.28em] uppercase mb-2" style={{ color: TEAL }}>Our Supporters</p>
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
              <p className="text-xs font-mono tracking-[0.28em] uppercase mb-2" style={{ color: ORANGE }}>Meet The Experts</p>
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
            <CTAButton primary onClick={() => setSection("registration")}>Register Now <ArrowRight className="w-4 h-4" /></CTAButton>
            <CTAButton onClick={() => setSection("contact")}>Contact Us</CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}

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

// ─── Competitions Page ────────────────────────────────────────────────────────
function CompetitionsPage() {
  const competitions = [
    {
      icon: <FlaskConical className="w-7 h-7" />,
      title: "Chem-E-Car",
      category: "Competition",
      desc: "Teams design and build a car powered by a chemical energy source that can travel a specified distance and stop using a chemical stopping mechanism. One of AIChE's most iconic student challenges.",
      details: ["Team-based competition", "Design, build & present", "Chemical power & stopping mechanism"],
      color: TEAL,
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "ChemE Jeopardy",
      category: "Competition",
      desc: "A fast-paced, Jeopardy-style trivia competition testing breadth of chemical engineering knowledge — from thermodynamics to reactor design to safety.",
      details: ["Team of 3-4 students", "Live Q&A format", "All ChE disciplines"],
      color: ORANGE,
    },
    {
      icon: <Presentation className="w-7 h-7" />,
      title: "Student Technical Presentation",
      category: "Competition",
      desc: "Individual students present original technical research or analysis to a panel of industry and academic judges. Builds critical presentation and communication skills.",
      details: ["Individual presentations", "Industry judges", "Research & analysis focus"],
      color: TEAL,
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Undergraduate Poster Competition",
      category: "Competition",
      desc: "Students present their research and technical projects in a poster format, engaging directly with judges and attendees in a dynamic gallery setting.",
      details: ["Research poster", "Peer & judge engagement", "Open gallery format"],
      color: ORANGE,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Youth Pulse",
      category: "Activity",
      desc: "An energetic program designed for younger engineering students and prospective engineers, featuring hands-on demos, mentoring sessions, and career exposure.",
      details: ["Mentorship sessions", "Hands-on demos", "Career guidance"],
      color: TEAL,
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: "Workshops",
      category: "Activity",
      desc: "Practical, skills-based sessions led by industry experts and faculty. Topics range from process safety to digital engineering tools and AI in chemical engineering.",
      details: ["Industry-led sessions", "Hands-on learning", "Multiple tracks"],
      color: ORANGE,
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Panels & Sessions",
      category: "Activity",
      desc: "Moderated panel discussions featuring leaders from industry, academia, and startups exploring the future of chemical engineering and energy in the GCC.",
      details: ["Expert panelists", "Q&A sessions", "Industry insights"],
      color: TEAL,
    },
    {
      icon: <Network className="w-7 h-7" />,
      title: "Networking & Industry Engagement",
      category: "Activity",
      desc: "Dedicated networking hours, a career fair, and structured industry engagement activities connecting students directly with potential employers and mentors.",
      details: ["Career fair", "Company booths", "Structured networking"],
      color: ORANGE,
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: "Additional Programs",
      category: "Activity",
      desc: "Cultural tours, social events, an opening ceremony, closing gala, and more — making SRC 2026 an unforgettable complete experience.",
      details: ["Opening ceremony", "Closing gala", "Cultural activities"],
      color: TEAL,
    },
  ];

  const [filter, setFilter] = useState<"All" | "Competition" | "Activity">("All");
  const filtered = competitions.filter((c) => filter === "All" || c.category === filter);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>What Awaits You</SectionTag>
        <SectionTitle>Competitions & Activities</SectionTitle>
        <Divider />
        <p className="text-muted-foreground max-w-2xl mb-10 text-lg leading-relaxed">
          SRC 2026 features a rich program of technical competitions, professional development sessions, and networking activities designed to challenge and inspire.
        </p>

        <div className="flex gap-2 mb-10">
          {(["All", "Competition", "Activity"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded text-sm font-semibold transition-all"
              style={filter === f
                ? { background: TEAL, color: "#07111E" }
                : { background: `${TEAL}10`, color: "var(--muted-foreground)", border: `1px solid ${TEAL}25` }
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.title} className="rounded-xl border overflow-hidden group hover:border-[#0CBFCE]/40 transition-all duration-300 hover:-translate-y-1" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: item.color === TEAL ? TEAL : ORANGE, background: `${item.color}12`, border: `1px solid ${item.color}30` }}>
                    {item.category}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                <ul className="space-y-1">
                  {item.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: item.color }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Registration Page ────────────────────────────────────────────────────────
function RegistrationPage() {
  const tracks = [
    { icon: <Users className="w-6 h-6" />, title: "Participant Registration", desc: "Register as an individual attendee to access all sessions, workshops, panels, and networking events.", badge: "Open Soon", color: TEAL },
    { icon: <Trophy className="w-6 h-6" />, title: "Competing Team Registration", desc: "Register your university team for Chem-E-Car, ChemE Jeopardy, Technical Presentation, or Poster Competition.", badge: "Open Soon", color: ORANGE },
    { icon: <Heart className="w-6 h-6" />, title: "Volunteer Interest Form", desc: "Join the SRC 2026 volunteer team and be part of making this historic conference a success.", badge: "Coming Soon", color: TEAL },
    { icon: <Mic2 className="w-6 h-6" />, title: "Speaker / Judge / Mentor", desc: "Share your expertise as a speaker, competition judge, or career mentor at SRC 2026.", badge: "Coming Soon", color: ORANGE },
    { icon: <Building2 className="w-6 h-6" />, title: "Partner Interest Form", desc: "Explore partnership and sponsorship opportunities to connect your organization with the next generation of engineers.", badge: "Coming Soon", color: TEAL },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Join SRC 2026</SectionTag>
        <SectionTitle>Registration</SectionTitle>
        <Divider />
        <p className="text-muted-foreground max-w-2xl mb-12 text-lg leading-relaxed">
          Multiple pathways to participate in SRC 2026. Choose the track that fits your role.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div key={track.title} className="rounded-xl border p-6 flex flex-col group hover:border-[#0CBFCE]/40 transition-all duration-200" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ background: `${track.color}15`, color: track.color }}>
                {track.icon}
              </div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="font-display font-bold text-white text-base leading-tight">{track.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{track.desc}</p>
              <button
                className="w-full py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 border transition-all"
                style={{ borderColor: `${track.color}40`, color: track.color }}
                disabled
              >
                <Clock className="w-4 h-4" /> {track.badge}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
          <h3 className="font-display text-2xl font-bold text-white mb-3">Stay Updated</h3>
          <p className="text-muted-foreground mb-6">Registration forms will open soon. Contact us to be notified when registration opens.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" style={{ color: TEAL }} />
              <span>src2026@kfupm.edu.sa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" style={{ color: TEAL }} />
              <span>+966 13 860 0000</span>
            </div>
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
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [fillPct, setFillPct] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;

        // % of the track the viewport's center has passed
        const pct = ((viewportCenter - rect.top) / rect.height) * 100;
        setFillPct(Math.min(100, Math.max(0, pct)));

        // nearest node to viewport center becomes "active"
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
    <section className="relative py-24 border-t" style={{ borderColor: `${TEAL}15` }}>
      
      {/* Molecule Network Background */}
      <MoleculeNetwork />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <SectionTag>Roadmap</SectionTag>
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

              return (
                <div
                  key={m.event}
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
                      className="rounded-xl p-5 border transition-all duration-500"
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

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Logistics</SectionTag>
        <SectionTitle>Venue & Travel</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: TEAL }} /> Venue
            </h3>
            <div className="rounded-xl border p-6 mb-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h4 className="font-bold text-white mb-1">King Fahd University of Petroleum & Minerals</h4>
              <p className="text-muted-foreground text-sm mb-4">KFUPM Main Campus, Dhahran 31261, Eastern Province, Saudi Arabia</p>
              <div className="rounded-lg overflow-hidden bg-muted h-48 flex items-center justify-center" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}>
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: TEAL }} />
                  <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: TEAL }} /> Accommodation
            </h3>
            <div className="space-y-3">
              {[
                { name: "On-Campus Guest Housing", note: "Available for registered teams — contact teams.src2026@kfupm.edu.sa" },
                { name: "Dhahran Palace Hotel", note: "~5 min from campus · dhahranpalacehotel.com" },
                { name: "JW Marriott Dammam", note: "~20 min from campus · marriott.com" },
                { name: "Le Méridien Al Khobar", note: "~15 min from campus · marriott.com" },
              ].map((hotel) => (
                <div key={hotel.name} className="flex justify-between items-start rounded-lg p-4 border text-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div>
                    <span className="font-medium text-white">{hotel.name}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{hotel.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Travel Information</h3>
            <div className="space-y-4 mb-8">
              {[
                { icon: <Globe className="w-4 h-4" />, label: "Nearest Airport", value: "King Fahd International Airport (DMM), Dammam" },
                { icon: <Clock className="w-4 h-4" />, label: "Drive from Airport", value: "~30 minutes" },
                { icon: <MapPin className="w-4 h-4" />, label: "City", value: "Dhahran, Eastern Province, Saudi Arabia" },
                { icon: <CheckCircle className="w-4 h-4" />, label: "Visa", value: "eVisa available for most nationalities — visitsaudi.com" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-lg p-4 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span style={{ color: TEAL }} className="mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4">FAQs for Visitors</h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-lg border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-medium text-white hover:text-[#0CBFCE] transition-colors">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                </details>
              ))}
            </div>

            <div className="mt-6 rounded-lg p-4 border" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
              <p className="text-sm text-muted-foreground mb-2">Accommodation & travel questions:</p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="w-4 h-4" style={{ color: TEAL }} />
                logistics.src2026@kfupm.edu.sa
              </div>
            </div>
          </div>
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
      
      {/* Molecule Network Background */}
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
        ].map((group) => (
          <div key={group.level} className="mb-30">
            <h3 className="font-display text-xl font-bold mb-15 flex items-center gap-3" style={{ color: group.color }}>
              <span className="w-8 h-0.5 inline-block" style={{ background: group.color }} />
              {group.level}
            </h3>
            <div className="rounded-xl border p-10 flex flex-wrap gap-8 items-center justify-center min-h-[120px] transition-all duration-500" style={{ background: `${group.color}0d`, borderColor: `${group.color}40`, }} >
              <div className="text-center">
                <ComingSoonBadge />
                <p className="text-xs text-muted-foreground mt-2">Announcements coming soon</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-20 text-center">
  <p className="text-xs text-muted-foreground">
    Interested in sponsoring? Join us as a partner and make a lasting impact
    on the engineering community of the GCC.
  </p>

  <button
    className="mt-2 text-xs font-medium transition-opacity hover:opacity-80"
    style={{ color: TEAL }}
  >
    View Partnership Packages →
  </button>
</div>
      </div>
    </div>
  );
}

// ─── Speakers Page ────────────────────────────────────────────────────────────
function SpeakersPage() {
  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      
      {/* Molecule Network Background */}
      <MoleculeNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTag>Meet The Experts</SectionTag>
        <SectionTitle>Speakers, Judges & Mentors</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Keynote Speakers", icon: <Mic2 className="w-7 h-7" />, desc: "Industry leaders and innovators sharing their vision for the future of chemical engineering." },
            { label: "Competition Judges", icon: <Award className="w-7 h-7" />, desc: "Experienced engineers and academics evaluating student work across all competitions." },
            { label: "Mentors & Guests", icon: <Star className="w-7 h-7" />, desc: "Industry professionals available for 1-on-1 mentoring, career advice, and networking." },
          ].map((cat) => (
            <div key={cat.label} className="rounded-xl border p-6 text-center backdrop-blur-md" style={{ background: "rgba(15, 23, 42, 0.4)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${TEAL}15`, color: TEAL }}>
                {cat.icon}
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{cat.label}</h3>
              <p className="text-sm text-muted-foreground mb-5">{cat.desc}</p>
              <ComingSoonBadge />
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-8 text-center backdrop-blur-md" style={{ background: `${ORANGE}0d`, borderColor: `${ORANGE}35` }}>
          <h3 className="font-display text-xl font-bold text-white mb-3">Interested in Speaking or Judging?</h3>
          <p className="text-muted-foreground mb-5 max-w-lg mx-auto text-sm">We welcome industry experts, researchers, and professionals who want to share their knowledge and mentor the next generation.</p>
          <CTAButton primary>Express Interest <ArrowRight className="w-4 h-4" /></CTAButton>
        </div>
      </div>
    </div>
  );
}

// ─── Organizing Team ──────────────────────────────────────────────────────────
function OrganizingPage() {
  const roles = [
    { title: "Conference Advisor", note: "Faculty oversight and strategic guidance" },
    { title: "Conference Chair", note: "Overall leadership and direction" },
    { title: "Vice Chair", note: "Operational coordination" },
    { title: "Competitions Committee", note: "All competition logistics and judging" },
    { title: "Logistics Committee", note: "Venue, accommodation, transportation" },
    { title: "Marketing & Media Committee", note: "Communications, social media, press" },
    { title: "Partnerships Committee", note: "Sponsorship and partner relations" },
    { title: "Technical Program Committee", note: "Sessions, workshops, speakers" },
    { title: "Volunteer Committee", note: "Volunteer coordination and training" },
    { title: "Registration Committee", note: "Participant and team registration" },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>The Team Behind SRC</SectionTag>
        <SectionTitle>Organizing Committee</SectionTitle>
        <Divider />

        <p className="text-muted-foreground max-w-2xl mb-12 text-lg leading-relaxed">
          SRC 2026 is organized by a dedicated team of KFUPM students under faculty and professional guidance. Full team profiles will be published soon.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {roles.map((role) => (
            <div key={role.title} className="rounded-lg border p-5 flex items-start gap-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display font-black text-sm" style={{ background: `${TEAL}15`, color: TEAL }}>
                {role.title.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{role.title}</p>
                <p className="text-xs text-muted-foreground">{role.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
          <ComingSoonBadge />
          <p className="text-muted-foreground text-sm mt-4">Individual team member profiles and photos will be published here soon.</p>
        </div>
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

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
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

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <SectionTag>Got Questions?</SectionTag>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <Divider />

        <div className="space-y-3 mt-8">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden transition-all" style={{ background: "var(--card)", borderColor: open === i ? `${TEAL}40` : "var(--border)" }}>
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                <span style={{ color: TEAL }} className="flex-shrink-0">
                  {open === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t" style={{ borderColor: `${TEAL}20` }}>
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
          <HelpCircle className="w-10 h-10 mx-auto mb-3" style={{ color: TEAL }} />
          <h3 className="font-display text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-5">Reach out and we'll get back to you within 48 hours.</p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: TEAL }}>
            <Mail className="w-4 h-4" /> src2026@kfupm.edu.sa
          </div>
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
    { label: "Registration", section: "registration" },
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
            <SRCLogo size={44} />
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
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  const pages: Record<Section, React.ReactNode> = {
    home: <HomePage setSection={setSection} />,
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
      `}</style>

      <Navbar active={section} setSection={setSection} />

      <main>
        {pages[section]}
      </main>

      <Footer setSection={setSection} />
    </div>
  );
}

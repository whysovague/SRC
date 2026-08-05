import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import {
  Menu, X, ChevronDown, ChevronRight, ArrowRight, MapPin, Calendar,
  Users, Trophy, Mic2, Building2, Mail, Phone, ExternalLink, Download,
  Star, Award, Zap, Globe, BookOpen, Layers, Heart, Target, Eye,
  CheckCircle, Clock, Instagram, Twitter, Linkedin, Youtube,
  FlaskConical, Presentation, FileText, Lightbulb, Network, Wrench,
  MessageSquare, HelpCircle, ChevronUp
} from "lucide-react";
import {
  TEAL, ORANGE, PALETTE_BLUE, PALETTE_ORANGE,
  ORBIT_CYAN, ORBIT_ORANGE, ORBIT_WHITE,
} from "./theme";
import type { Section, RegType, Competition } from "./types";
import {
  SectionTag, SectionTitle, Divider, GradientEyebrow, ComingSoonBadge,
  CTAButton, RevealOnScroll, InteractiveCard, GlassCard,
  MoleculeNetwork, Marquee, SRCLogo, CountUp,
} from "./components/common";
import srcTealSvg from "@/assets/src_teal.svg";
import srcLettersSvg from "@/assets/src_letters.svg";
import { submitRegistration } from "./lib/firebase";
import { findUserByEmail, createUserIfNotExists, type AppUser } from "./lib/users";
import kfupmLogoImg from "@/assets/kfupm-logo-png_seeklogo-643173.png";
import aicheLogoImg from "@/assets/aichelogo.png";

// ─── Navigation ───────────────────────────────────────────────────────────────
const navItems: { label: string; section: Section }[] = [
  { label: "Home", section: "home" },
  { label: "Competitions", section: "competitions" },
  { label: "Agenda", section: "agenda" },
  { label: "Partnership", section: "partnership" },
  { label: "Contact", section: "contact" },
  //{ label: "Organizing Team", section: "organizing" },
  { label: "FAQ", section: "faq" },
];

function Navbar({ active, setSection, onRegisterClick, user, onLogout }: {
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

    let W = 0, H = 0, cx = 0, cy = 0, S = 0, raf = 0, drive = 0;
    let held = false;         // true while the pointer is pressed down on the logo
    let px = 0, py = 0;       // last pointer position
    let vRotX = 0, vRotY = 0; // angular velocity (rad/frame) around the screen X/Y axes

    // ── 3×3 matrix helpers (row-major) — free 360° trackball rotation ────────
    type M3 = number[];
    const mul = (a: M3, b: M3): M3 => [
      a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
      a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
      a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8],
    ];
    const rotX = (a: number): M3 => [1,0,0, 0,Math.cos(a),-Math.sin(a), 0,Math.sin(a),Math.cos(a)];
    const rotY = (a: number): M3 => [Math.cos(a),0,Math.sin(a), 0,1,0, -Math.sin(a),0,Math.cos(a)];
    const rotZ = (a: number): M3 => [Math.cos(a),-Math.sin(a),0, Math.sin(a),Math.cos(a),0, 0,0,1];
    const apply = (m: M3, x: number, y: number, z: number) =>
      ({ x: m[0]*x+m[1]*y+m[2]*z, y: m[3]*x+m[4]*y+m[5]*z, z: m[6]*x+m[7]*y+m[8]*z });

    // Orientation of the whole orbit system — spun freely by the user
    let R: M3 = mul(rotX(-0.35), rotY(0.4));

    type Electron = { angle: number; speed: number; color: string; trail: { x: number; y: number }[] };
    type Orbit = { rF: number; basis: M3; color: string; electrons: Electron[] };

    // Each orbit is a circle living in its own tilted 3D plane
    const orbits: Orbit[] = [
    { rF: 0.44, basis: mul(rotZ(-0.32), rotX(1.35)), color: ORBIT_WHITE, electrons: [] },
      { rF: 0.41, basis: mul(rotZ(0.60),  rotX(0.35)), color: ORBIT_CYAN, electrons: [] },
      { rF: 0.44, basis: mul(rotZ(1.25),  rotX(1.05)), color: ORBIT_ORANGE, electrons: [] },
    ];

    const seed = () => {
      orbits.forEach((o, i) => {
        const count = 4;
        o.electrons = Array.from({ length: count }, (_, k) => ({
          angle: (Math.PI * 2 * k) / count + i,
          speed: (0.003 + Math.random() * 0.002) * (i % 2 ? -1 : 1),
          color: o.color, trail: [],
        }));
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height; cx = W / 2; cy = H / 2; S = Math.min(W, H);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Rotate a point on an orbit by the global orientation, then project with perspective
    const project = (basis: M3, rF: number, a: number) => {
      const r = rF * S;
      const l = apply(basis, Math.cos(a) * r, Math.sin(a) * r, 0);
      const p = apply(R, l.x, l.y, l.z);
      const persp = 2.4 * S;
      const sc = persp / (persp - p.z);
      return { x: cx + p.x * sc, y: cy + p.y * sc, depth: p.z / r }; // depth ∈ [-1, 1]
    };

    const drawPath = (o: Orbit) => {
      const c = o.color;
      const N = 72;
      let prev = project(o.basis, o.rF, 0);
      for (let i = 1; i <= N; i++) {
        const p = project(o.basis, o.rF, (Math.PI * 2 * i) / N);
        const d = ((prev.depth + p.depth) / 2 + 1) / 2; // fade the far side of the ring
        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${c},${0.04 + d * 0.16})`; ctx.lineWidth = 1; ctx.stroke();
        prev = p;
      }
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

      // Released: let the user's momentum carry the spin briefly, then rest
      if (!held) {
        vRotX *= 0.95; vRotY *= 0.95;
        R = mul(mul(rotX(vRotX), rotY(vRotY)), R);
      }

      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 900);
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.22);
      ng.addColorStop(0, `rgba(12,191,206,${0.16 + pulse * 0.10 + drive * 0.10})`);
      ng.addColorStop(1, "rgba(12,191,206,0)");
      ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);

      orbits.forEach(drawPath);

      orbits.forEach((o) => {
        o.electrons.forEach((e) => {
          e.angle += e.speed * drive * 1.7;
          const p = project(o.basis, o.rF, e.angle);
          const x = p.x, y = p.y;
          const depth = (p.depth + 1) / 2;
          const size = 1.6 + depth * 2.2;
          const alpha = 0.45 + depth * 0.55;
          const c = e.color;

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


      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const ROT_DRAG = 0.0065; // radians per px while grabbing — 1:1 trackball feel

    const press = (e: PointerEvent) => {
      held = true; px = e.clientX; py = e.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!held) return; // rotation is grab-only — hovering does nothing
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      // Direct trackball rotation; remember velocity so release keeps momentum
      R = mul(mul(rotX(-dy * ROT_DRAG), rotY(dx * ROT_DRAG)), R);
      vRotX = -dy * ROT_DRAG * 0.55; vRotY = dx * ROT_DRAG * 0.55;
      if (reduce) frame();
    };
    const release = () => { held = false; canvas.style.cursor = "grab"; };

    canvas.addEventListener("pointerdown", press);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", release);
    window.addEventListener("resize", resize);

    resize(); seed(); frame();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointermove", move);
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

// ─── Countdown to Day 1 (ticks every second) ─────────────────────────────────
const EVENT_START = new Date("2026-08-31T08:30:00+03:00").getTime(); // Day 1, 8:30 AM AST

// Split-flap digit pair — flips like a volleyball scoreboard when the value changes
function FlipUnit({ value }: { value: number }) {
  const v = String(value).padStart(2, "0");
  const [cur, setCur] = useState(v);
  const [prev, setPrev] = useState(v);

  useEffect(() => {
    if (v === cur) return;
    setPrev(cur); setCur(v);
    const id = setTimeout(() => setPrev(v), 620); // settle after the flip finishes
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only on a new value; a `cur` dep would clear the settle timer early
  }, [v]);

  const flipping = prev !== cur;

  return (
    <div className="src-flip">
      {/* Static halves: top already shows the new value, bottom still shows the old */}
      <div className="src-flip-half src-flip-top"><span>{cur}</span></div>
      <div className="src-flip-half src-flip-bot"><span>{prev}</span></div>
      {/* Animated flaps: old top folds down, new bottom unfolds behind it */}
      {flipping && (
        <Fragment key={cur}>
          <div className="src-flip-half src-flip-top src-flip-flap-down"><span>{prev}</span></div>
          <div className="src-flip-half src-flip-bot src-flip-flap-up"><span>{cur}</span></div>
        </Fragment>
      )}
      <div className="src-flip-seam" />
    </div>
  );
}

function CountdownTimer() {
  const calc = () => {
    const diff = Math.max(0, EVENT_START - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
      done: diff === 0,
    };
  };
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: t.days,    label: "Days" },
    { value: t.hours,   label: "Hours" },
    { value: t.minutes, label: "Minutes" },
    { value: t.seconds, label: "Seconds" },
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-6 text-center">
      <style>{`
        .src-flip { position: absolute; inset: 0; perspective: 340px; }
        .src-flip-half {
          position: absolute; left: 0; width: 100%; height: 50%;
          overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden;
        }
        .src-flip-top { top: 0; border-radius: 8px 8px 0 0; background: linear-gradient(180deg, #13283F 0%, #0D1E30 100%); }
        .src-flip-bot { bottom: 0; border-radius: 0 0 8px 8px; background: linear-gradient(180deg, #0B1A2A 0%, #0D1E30 100%); }
        .src-flip-half > span {
          position: absolute; left: 0; width: 100%; height: 200%;
          display: flex; align-items: center; justify-content: center;
          text-shadow: 0 0 10px ${TEAL}, 0 0 2px ${TEAL};
        }
        .src-flip-top > span { top: 0; }
        .src-flip-bot > span { bottom: 0; }
        .src-flip-flap-down {
          transform-origin: 50% 100%; z-index: 3;
          animation: srcFlapDown .28s cubic-bezier(.37,.01,.94,.35) both;
        }
        .src-flip-flap-up {
          transform-origin: 50% 0%; z-index: 3;
          animation: srcFlapUp .28s .28s cubic-bezier(.15,.45,.28,1) both;
        }
        @keyframes srcFlapDown { from { transform: rotateX(0); } to { transform: rotateX(-90deg); } }
        @keyframes srcFlapUp   { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }
        /* Scoreboard hinge across the middle */
        .src-flip-seam {
          position: absolute; top: 50%; left: 4%; right: 4%; height: 2px; margin-top: -1px;
          z-index: 4; pointer-events: none;
          background: rgba(0,0,0,0.55);
          box-shadow: 0 1px 0 rgba(255,255,255,0.05);
        }
        @media (prefers-reduced-motion: reduce) {
          .src-flip-flap-down, .src-flip-flap-up { animation-duration: 0s; animation-delay: 0s; }
        }
      `}</style>
      <h3 className="font-display text-3xl md:text-4xl font-extrabold mb-10">
        {t.done ? (
          <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            SRC 2026 is live!
          </span>
        ) : (
          <span className="text-white">Days Until SRC 2026</span>
        )}
      </h3>

      {!t.done && (
        <div className="flex items-stretch justify-center gap-2 sm:gap-3 md:gap-5">
          {units.map((u, i) => (
            <Fragment key={u.label}>
              <div
                className="relative rounded-xl border overflow-hidden w-[72px] sm:w-[96px] md:w-[128px] py-4 md:py-6"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                {/* Accent bar — site card signature */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-md pointer-events-none"
                  style={{ background: `${TEAL}40` }}
                />
                {/* Internal ambient glow */}
                <div className="absolute inset-x-0 -top-10 h-24 pointer-events-none" style={{
                  background: `radial-gradient(60% 80% at 50% 0%, ${TEAL}30 0%, transparent 70%)`,
                  filter: "blur(10px)",
                }} />
                <div className="relative mx-2 h-11 sm:h-14 md:h-[4.5rem] font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tabular-nums">
                  <FlipUnit value={u.value} />
                </div>
                <div className="relative text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
                  {u.label}
                </div>
              </div>
              {i < units.length - 1 && (
                <div className="self-center font-display text-2xl md:text-4xl font-black pb-4" style={{ color: ORANGE }}>:</div>
              )}
            </Fragment>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setSection, onRegisterClick }: { setSection: (s: Section) => void; onRegisterClick: () => void }) {
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
        /* Marquee styling moved to src/styles/theme.css so it applies on every
           page that uses <Marquee>, not just this one. */
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
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 1000;
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
              {/* Hero title — SRC letters + host + year, locked up as a single entity */}
              <div className="mb-3 src-rise">
                <div
                  role="img"
                  aria-label="SRC · AIChE · 2026"
                  className="flex items-stretch gap-4 md:gap-5"
                >
                  {/* AIChE Chapter Logo */}
                  <img
                    src={aicheLogoImg}
                    alt="KFUPM-AIChE Students Chapter"
                    className="shrink-0 object-contain"
                    style={{ width: "min(46%, 160px)" }}
                  />
                  

                  {/* Divider line */}
                  <div
                    className="w-px self-stretch my-2"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, #4c90c1 35%, #e47d1b 75%, transparent 100%)",
                    }}
                  />
                  {/* KFUPM Logo */}
                  <img
                    src={kfupmLogoImg}
                    alt="KFUPM"
                    className="shrink-0 object-contain"
                    style={{
                      width: "min(46%, 200px)",
                      filter: "brightness(0) invert(1)",
                    }}
                  />

                  
                </div>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-5 max-w-xl">
              Bringing together the brightest minds in chemical engineering from across the GCC and beyond.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: ORANGE }} />
                  <span className="font-semibold text-foreground">2026 · Aug 31st - Sep 2nd</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: ORANGE }} />
                  <span className="font-semibold text-foreground">KFUPM, Dhahran, Saudi Arabia</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <CTAButton primary onClick={onRegisterClick}>
                  Register Now <ArrowRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton onClick={scrollToAbout}>
                  Learn More <ChevronRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton onClick={() => setSection("partnership")}>
                  Become a Partner <ChevronRight className="w-4 h-4" />
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
                <div className="relative mb-2">
  {/* Glow */}
  <div
    className="absolute inset-0 flex justify-center items-center
               font-display text-5xl md:text-6xl font-black
               blur-xl opacity-50 pointer-events-none select-none"
    style={{ color: TEAL }}
  >
    <CountUp to={s.to} suffix={s.suffix} />
  </div>

  {/* Main Number */}
  <div
    className="relative font-display text-5xl md:text-5xl font-black
               tracking-tight"
    style={{
      color: "#fff",
      textShadow: `
        0 0 10px ${TEAL},
        0 0 2px ${TEAL},
        0 0 3px ${TEAL}
      `,
    }}
  >
    <CountUp to={s.to} suffix={s.suffix} />
  </div>
</div>
                <div className="text-sm md:text-base text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown to Day 1 */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <RevealOnScroll>
          <CountdownTimer />
        </RevealOnScroll>
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
 
              
            </div>
 
            <div className="lg:col-span-5 space-y-5 src-rise-2">
              {[
                { title: "Why SRC Matters", icon: <Zap className="w-5 h-5" />, accent: TEAL, text: "SRC 2026 at KFUPM marks a historic milestone, it is the first time this conference is held in the Gulf Cooperation Council (GCC), bringing the AIChE tradition of academic excellence to the heart of the Arab world's energy and engineering hub." },
                { title: "Why KFUPM?", icon: <Building2 className="w-5 h-5" />, accent: ORANGE, text: "Hosted by King Fahd University of Petroleum & Minerals (KFUPM) in Dhahran, Saudi Arabia, this conference will attract students, faculty advisors, and industry professionals from across the GCC and the broader Middle East region." },
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
              { label: "Mission", icon: <Target className="w-5 h-5" />, color: TEAL, text: "Connecting industry with future engineers through innovation and collaboration." },
              { label: "Vision", icon: <Eye className="w-5 h-5" />, color: ORANGE, text: "Developing the GCC's next generation of engineering talent." },
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
            <CTAButton primary onClick={onRegisterClick}>Register Now <ArrowRight className="w-4 h-4" /></CTAButton>
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
                SRC 2026 at KFUPM marks a historic milestone it is the <span style={{ color: TEAL }} className="font-semibold">first time this conference is held in the Gulf Cooperation Council (GCC)</span>, bringing the AIChE tradition of academic excellence to the heart of the Arab world's energy and engineering hub.
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
            { label: "Mission", icon: <Target />, text: "To provide an exceptional platform that empowers chemical engineering students across the GCC to showcase their talents, engage with industry, and develop as global engineering leaders while establishing a sustainable regional AIChE tradition.", color: TEAL },
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
function CompetitionsPage({ onParticipate }: { onParticipate: (competition: Competition) => void }) {
  const competitions: {
    icon: React.ReactNode; title: string; category: "Competition" | "Activity";
    desc: string; details: string[]; color: string; compId?: Competition;
  }[] = [
    {
      icon: <FlaskConical className="w-7 h-7" />,
      title: "Chem-E-Car",
      category: "Competition",
      desc: "Teams design and build a car powered by a chemical energy source that can travel a specified distance and stop using a chemical stopping mechanism. One of AIChE's most iconic student challenges.",
      details: ["Team-based competition", "Design, build & present", "Chemical power & stopping mechanism"],
      color: TEAL,
      compId: "chem-e-car",
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "ChemE Jeopardy",
      category: "Competition",
      desc: "A fast-paced, Jeopardy-style trivia competition testing breadth of chemical engineering knowledge from thermodynamics to reactor design to safety.",
      details: ["Team of 3-4 students", "Live Q&A format", "All ChE disciplines"],
      color: ORANGE,
      compId: "cheme-jeopardy",
    },
    {
      icon: <Presentation className="w-7 h-7" />,
      title: "Student Technical Presentation",
      category: "Competition",
      desc: "Individual students present original technical research or analysis to a panel of industry and academic judges. Builds critical presentation and communication skills.",
      details: ["Individual presentations", "Industry judges", "Research & analysis focus"],
      color: TEAL,
      compId: "technical-presentation",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Undergraduate Poster Competition",
      category: "Competition",
      desc: "Students present their research and technical projects in a poster format, engaging directly with judges and attendees in a dynamic gallery setting.",
      details: ["Research poster", "Peer & judge engagement", "Open gallery format"],
      color: ORANGE,
      compId: "poster-competition",
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
      desc: "Cultural tours, social events, an opening ceremony, closing gala, and more. Making SRC 2026 an unforgettable complete experience.",
      details: ["Opening ceremony", "Closing gala", "Cultural activities"],
      color: TEAL,
    },
  ];

  const [filter, setFilter] = useState<"All" | "Competition" | "Activity">("All");
  const filtered = competitions.filter((c) => filter === "All" || c.category === filter);

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }
      `}</style>

      {/* Background — identical to FAQ/Logistics/Partnership/Contact */}
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

        {/* Header — same eyebrow + gradient title pattern */}
        <div className="faq-pop">
          <div className="mb-7">
            <GradientEyebrow>What Awaits You</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Competitions &</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Activities</span>
          </h2>
          <Divider />
          <p className="text-muted-foreground max-w-2xl mb-10 text-lg leading-relaxed">
            SRC 2026 features a rich program of technical competitions, professional development sessions, and networking activities designed to challenge and inspire.
          </p>
        </div>

        {/* Filter pills */}
        <div className="faq-pop flex gap-2 mb-12" style={{ animationDelay: "80ms" }}>
          {(["All", "Competition", "Activity"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={filter === f
                ? { background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }
                : { background: "rgba(13,30,48,0.55)", color: "var(--muted-foreground)", border: `1px solid ${TEAL}25`, backdropFilter: "blur(8px)" }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <RevealOnScroll key={item.title} delay={(i % 3) * 100}>
              <InteractiveCard
                accent={item.color}
                className="rounded-xl border overflow-hidden group hover:border-[#0CBFCE]/40 transition-colors duration-300 h-full"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="p-6 flex flex-col h-full">
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
                  <ul className="space-y-1 mb-5">
                    {item.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: item.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {/* Register / Participate → opens the registration & login modal,
                      preselecting this competition when the card is one */}
                  <div className="mt-auto pt-1">
                    <button
                      onClick={() => onParticipate(item.compId ?? null)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        color: item.color,
                        background: `${item.color}12`,
                        border: `1px solid ${item.color}35`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${item.color}22`; e.currentTarget.style.borderColor = `${item.color}70`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = `${item.color}12`; e.currentTarget.style.borderColor = `${item.color}35`; }}
                    >
                      {item.compId ? "Participate" : "Register"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </InteractiveCard>
            </RevealOnScroll>
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
      date: "11/4/2026",
      event: "Competition Registrations Open",
      desc: "Registrations open for Chem-E-Car and Chem-E-Jeopardy.",
      status: "upcoming" as const,
    },
    {
      date: "8/6/2026",
      event: "Chem-E-Car Registration Deadline",
      desc: "Final deadline for teams to register for the Chem-E-Car competition.",
      status: "upcoming" as const,
    },
    {
      date: "31/7/2026",
      event: "Other Competitions Registration Deadline",
      desc: "ChemE Jeopardy, Technical Presentation, and Poster Competition registration closes.",
      status: "upcoming" as const,
    },
    {
      date: "16/8/2026",
      event: "Visitor Registration Opens",
      desc: "General visitor registration goes live.",
      status: "upcoming" as const,
    },
    {
      date: "31/8/2026",
      event: "SRC Day 1",
      desc: "Agenda coming soon.",
      status: "main" as const,
    },
    {
      date: "1/9/2026",
      event: "SRC Day 2",
      desc: "Agenda coming soon.",
      status: "upcoming" as const,
    },
    {
      date: "2/9/2026",
      event: "SRC Day 3",
      desc: "Agenda coming soon.",
      status: "upcoming" as const,
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
                    className={`ml-10 md:ml-0 md:w-1/2 text-left ${
                      alignLeft ? "md:pr-14" : "md:pl-14"
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

// ─── Agenda ───────────────────────────────────────────────────────────────────
type AgendaTrack = "Youth" | "Undergraduate";
type AgendaCat =
  | "Main Session"
  | "Competition"
  | "Workshop"
  | "Interactive"
  | "Networking"
  | "Logistics"
  | "Unclassified";

// Note: "Unclassified" is deliberately NOT in this array — it drives the filter
// chips and the legend, and un-colour-coded sessions shouldn't appear in either.
const AGENDA_CATS: AgendaCat[] = [
  "Main Session",
  "Competition",
  "Workshop",
  "Interactive",
  "Networking",
  "Logistics",
];

const AGENDA_CAT_COLOR: Record<AgendaCat, string> = {
  "Main Session": "#A78BFA",
  Competition: "#F2C744",
  Workshop: "#F08A7E",
  Interactive: "#66C95B",
  Networking: "#2FB3F0",
  Logistics: "#8FA3B8",
  Unclassified: "#6B7688",
};

const AGENDA_CAT_LABEL: Record<AgendaCat, string> = {
  "Main Session": "Main Session",
  Competition: "Competition",
  Workshop: "Workshop",
  Interactive: "Interactive",
  Networking: "Networking",
  Logistics: "Logistics",
  Unclassified: "Unclassified",
};

type AgendaItem = {
  time: string;
  start: number; // minutes from midnight — drives chronological sorting
  title: string;
  track: AgendaTrack;
  cat: AgendaCat;
  speakers?: string;
  note?: string;
};

const AGENDA_DAYS: {
  id: number;
  label: string;
  date: string;
  weekday: string;
  items: AgendaItem[];
}[] = [
  {
    id: 1,
    label: "Day 1",
    date: "August 31, 2026",
    weekday: "Monday",
    items: [
      // ── Youth ──
      { time: "8:30 – 9:00 AM", start: 510, title: "Registration & Check-in", track: "Youth", cat: "Logistics" },
      { time: "9:05 – 9:30 AM", start: 545, title: "Opening Ceremony", track: "Youth", cat: "Main Session" },
      { time: "9:40 AM – 12:10 PM", start: 580, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth", cat: "Networking", note: "Guided by ChE students" },
      { time: "12:15 – 1:15 PM", start: 735, title: "Science Olympiad", track: "Youth", cat: "Competition", note: "Mixed teams — Youth & Undergraduate" },
      { time: "1:30 – 2:00 PM", start: 810, title: "Intro to Chemical Engineering", track: "Youth", cat: "Workshop", speakers: "Jumanah Alhawaj, Shouq Almadani" },
      // ── Undergraduate ──
      { time: "1:00 – 1:15 PM", start: 780, title: "Registration & Check-in", track: "Undergraduate", cat: "Logistics" },
      { time: "1:20 – 1:40 PM", start: 800, title: "Opening Ceremony", track: "Undergraduate", cat: "Main Session" },
      { time: "1:45 – 2:05 PM", start: 825, title: "Keynote Speaker I", track: "Undergraduate", cat: "Main Session", speakers: "Osama Aljeraisy · Hadi Bu Saad · Ali Alsaeedi (KFUPM Alumni) · Muhammad Al-Saggaf (President)", note: "Ministry of Education (MOE)" },
      { time: "2:25 – 5:25 PM", start: 865, title: "ChemE Jeopardy", track: "Undergraduate", cat: "Competition" },
      { time: "5:30 – 6:10 PM", start: 1050, title: "Technical Workshop", track: "Undergraduate", cat: "Workshop", speakers: "Steven Qi, Mubarak Alshammari", note: "With Takween (تكوين)" },
      { time: "6:15 – 8:30 PM", start: 1095, title: "Welcome Dinner", track: "Undergraduate", cat: "Logistics", note: "Outside the venue" },
    ],
  },
  {
    id: 2,
    label: "Day 2",
    date: "September 1, 2026",
    weekday: "Tuesday",
    items: [
      // ── Youth ──
      { time: "8:30 – 9:00 AM", start: 510, title: "Registration & Check-in", track: "Youth", cat: "Logistics" },
      { time: "9:00 – 9:25 AM", start: 540, title: "How to Get Into Research", track: "Youth", cat: "Workshop", speakers: "Fatimah Alhassan (KFUPM)" },
      { time: "9:45 – 11:30 AM", start: 585, title: "Youth Poster Competition", track: "Youth", cat: "Competition" },
      { time: "11:35 AM – 1:10 PM", start: 695, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth", cat: "Networking", note: "Guided by ChE students" },
      { time: "1:15 – 1:55 PM", start: 795, title: "Meet Our Future Engineers", track: "Youth", cat: "Networking" },
      // ── Undergraduate ──
      { time: "9:00 – 11:00 AM", start: 540, title: "Site Visits", track: "Undergraduate", cat: "Networking" },
      { time: "1:00 – 1:15 PM", start: 780, title: "Registration & Check-in", track: "Undergraduate", cat: "Logistics" },
      { time: "2:00 – 2:20 PM", start: 840, title: "Keynote Speaker II", track: "Undergraduate", cat: "Main Session", speakers: "Mohammed Alshammasi (Aramco) · Norm Glisdorf · Gaetano De Santis · Mohammed Bin Shams" },
      { time: "2:25 – 2:55 PM", start: 865, title: "Women in ChemE", track: "Undergraduate", cat: "Unclassified", speakers: "Reem Ghanim · Raya · Elaf · Malak" },
      { time: "3:00 – 4:30 PM", start: 900, title: "Presidents Meeting", track: "Undergraduate", cat: "Networking" },
      { time: "3:15 – 4:00 PM", start: 915, title: "Chem-E-Car Poster Competition & Safety Inspection", track: "Undergraduate", cat: "Competition" },
      { time: "4:05 – 4:40 PM", start: 965, title: "Poster Set-Up & Break", track: "Undergraduate", cat: "Logistics" },
      { time: "4:45 – 7:45 PM", start: 1005, title: "Research Poster Competition", track: "Undergraduate", cat: "Competition" },
      { time: "7:50 – 8:35 PM", start: 1190, title: "Career Workshop", track: "Undergraduate", cat: "Workshop", speakers: "Jafar Alhamad, Amal Alhersh (Forge)" },
    ],
  },
  {
    id: 3,
    label: "Day 3",
    date: "September 2, 2026",
    weekday: "Wednesday",
    items: [
      // ── Youth ──
      { time: "8:30 – 9:00 AM", start: 510, title: "Registration & Check-in", track: "Youth", cat: "Logistics" },
      { time: "9:00 – 11:00 AM", start: 540, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth", cat: "Networking", note: "Guided by ChE students" },
      { time: "11:05 – 11:40 AM", start: 665, title: "Women in STEM", track: "Youth", cat: "Main Session", speakers: "Rowa Tawfiq, Hanan Alquraish" },
      { time: "11:45 AM – 1:00 PM", start: 705, title: "Students Visit Undergrad Research Posters", track: "Youth", cat: "Networking" },
      { time: "1:05 – 1:45 PM", start: 785, title: "Youth Award Ceremony & Closing", track: "Youth", cat: "Main Session" },
      // ── Undergraduate ──
      { time: "1:00 – 1:15 PM", start: 780, title: "Registration & Check-in", track: "Undergraduate", cat: "Logistics" },
      { time: "1:20 – 5:10 PM", start: 800, title: "Chem-E-Car Competition", track: "Undergraduate", cat: "Competition" },
      { time: "5:10 – 5:30 PM", start: 1030, title: "Coffee Break", track: "Undergraduate", cat: "Logistics" },
      { time: "5:30 – 7:30 PM", start: 1050, title: "Regional Student Technical Presentation Competition", track: "Undergraduate", cat: "Competition" },
      { time: "7:35 – 9:00 PM", start: 1175, title: "Industry Roundtable", track: "Undergraduate", cat: "Main Session", speakers: "Ammar Aldubaisi · Madi Asiri · Dr. Soloman Almadi · Abdullah Fairag · Hadi Al-Qahtani · Nawaf Al-Ahmadi" },
      { time: "9:00 – 10:00 PM", start: 1260, title: "Award Banquet", track: "Undergraduate", cat: "Main Session", note: "Building 70" },
    ],
  },
];

const AGENDA_ALL_DAY: { title: string; cat: AgendaCat; days: number[]; track?: AgendaTrack }[] = [
  { title: "Sponsor Exhibition & Booths", cat: "Networking", days: [1, 2, 3] },
  { title: "Sponsor Passport", cat: "Networking", days: [1, 2, 3] },
  { title: "ChemE Treasure Hunt", cat: "Interactive", days: [1, 2, 3] },
  { title: "Photobooth", cat: "Interactive", days: [1, 2, 3] },
  { title: "Giant SRC–AIChE Letters", cat: "Interactive", days: [1, 2, 3] },
  { title: "Gold Sponsor Showcase", cat: "Networking", days: [1] },
  { title: "Build Your Own Tower", cat: "Interactive", days: [1], track: "Youth" },
  { title: "Poster Engagement Game", cat: "Interactive", days: [2] },
  { title: "Presidents Meeting (3:00 – 4:30 PM)", cat: "Unclassified", days: [2], track: "Undergraduate" },
  { title: "Mini-Experiment Stations", cat: "Interactive", days: [2], track: "Youth" },
  { title: "Best Moment Captured Competition", cat: "Interactive", days: [3] },
  { title: 'Chem-E-Car "Stock Market"', cat: "Interactive", days: [3] },
];

// ─── Agenda · Coming Soon ─────────────────────────────────────────────────────
// The full agenda below is finished but hidden until the schedule is public.
// Flip this to true to bring it back — nothing else needs to change.
const AGENDA_LIVE = false;

function AgendaComingSoon() {
  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes csRing   { 0% { transform: scale(1); opacity:.5; } 100% { transform: scale(1.6); opacity:0; } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        .cs-ring { animation: csRing 3s ease-out infinite; }
        .cs-ring-2 { animation-delay: 1.5s; }
        @media (prefers-reduced-motion: reduce) {
          .faq-pop, .cs-ring { animation: none; }
        }
      `}</style>

      {/* Background — identical to Competitions/FAQ/Logistics/Partnership/Contact */}
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

      <div className="relative max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="faq-pop text-center">
          <div className="mb-7">
            <GradientEyebrow>August 31 – Sep 2</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Event </span>
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Schedule</span>
          </h2>
          <div className="flex justify-center"><Divider /></div>
        </div>

        {/* Pulsing calendar medallion */}
        <div className="faq-pop flex justify-center mb-8" style={{ animationDelay: "60ms" }}>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <span className="cs-ring absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `1px solid ${TEAL}55` }} />
            <span className="cs-ring cs-ring-2 absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `1px solid ${ORANGE}45` }} />
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(13,30,48,0.7)",
                border: `1px solid ${TEAL}33`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 18px 50px -20px ${TEAL}, inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}>
              <Calendar className="w-9 h-9" style={{ color: TEAL }} />
            </div>
          </div>
        </div>

        {/* Badge + copy */}
        <div className="faq-pop text-center mb-10" style={{ animationDelay: "120ms" }}>
          <div className="flex justify-center mb-6"><ComingSoonBadge /></div>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            We're putting the finishing touches on three days of competitions, keynotes,
            workshops and networking at KFUPM. The full day-by-day schedule goes live soon.
          </p>
        </div>

        {/* Release date card */}
        <GlassCard className="p-8 md:p-10" delay={180}>
          <div className="relative text-center">
            <div className="text-xs font-mono tracking-[0.28em] uppercase mb-4" style={{ color: "var(--muted-foreground)" }}>
              Schedule Published
            </div>
            <div className="font-display text-4xl md:text-5xl font-extrabold leading-none mb-2">
              <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                16 August
              </span>
              <span className="text-white"> 2026</span>
            </div>
            <div className="text-sm font-mono tracking-[0.18em] uppercase" style={{ color: "var(--muted-foreground)" }}>
              Sunday
            </div>

            <div className="h-px my-8" style={{ background: `linear-gradient(90deg, transparent, ${TEAL}33, ${ORANGE}33, transparent)` }} />

            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                { icon: Calendar, label: "Dates", value: "Aug 31 – Sep 2, 2026" },
                { icon: MapPin, label: "Venue", value: "KFUPM, Dhahran" },
                { icon: Layers, label: "Tracks", value: "Youth & Undergraduate" },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}2A` }}>
                    <d.icon className="w-4 h-4" style={{ color: TEAL }} />
                  </div>
                  <div>
                  <div className="text-[11px] font-mono tracking-[0.22em] uppercase mb-1" style={{ color: "var(--muted-foreground)" }}>
                    {d.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground leading-snug">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

    </div>
  </div>
);
}

function AgendaPage() {
  const [day, setDay] = useState<number>(1);
  const [track, setTrack] = useState<"All" | AgendaTrack>("All");
  const [cat, setCat] = useState<"All" | AgendaCat>("All");

  const dayData = AGENDA_DAYS.find((d) => d.id === day) || AGENDA_DAYS[0];

  const byTrack = dayData.items.filter((i) => track === "All" || i.track === track);
  const items = byTrack
    .filter((i) => cat === "All" || i.cat === cat)
    .slice()
    .sort((a, b) => a.start - b.start);

  // Day + track only 
  const allDayForTrack = AGENDA_ALL_DAY.filter((a) => a.days.includes(day))
    .filter((a) => track === "All" || !a.track || a.track === track);

  const allDay = allDayForTrack.filter((a) => cat === "All" || a.cat === cat);

  const trackTint = (t: AgendaTrack) => (t === "Youth" ? ORANGE : TEAL);
  const compCount = byTrack.filter((i) => i.cat === "Competition").length;
  const firstTime = byTrack.length ? [...byTrack].sort((a, b) => a.start - b.start)[0].time.split(" – ")[0] : "—";

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes agSlideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        .ag-seg { transition: color .25s ease, background .3s cubic-bezier(.16,.84,.44,1), box-shadow .3s ease; }
        .ag-row { animation: agSlideIn .45s cubic-bezier(.16,.84,.44,1) both; transition: background .25s ease, padding-left .25s ease; }
        .ag-row:hover { background: rgba(12,191,206,0.07); padding-left: 26px; }
        .ag-row-alt { background: rgba(255,255,255,0.016); }
        .ag-daytitle { animation: agSlideIn .5s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .faq-pop, .ag-row, .ag-daytitle { animation: none; }
          .ag-row:hover { padding-left: 20px; }
        }
      `}</style>

      {/* Background — identical to Competitions/FAQ/Logistics/Partnership/Contact */}
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

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="faq-pop text-center">
          <div className="flex items-center justify-center gap-3 mb-7">
            <span className="w-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${TEAL})` }} />
            <span className="text-xs font-mono tracking-[0.32em] uppercase" style={{ color: TEAL }}>Aug 31 – Sep 2, 2026</span>
            <span className="w-10 h-px" style={{ background: `linear-gradient(90deg, ${ORANGE}, transparent)` }} />
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Event </span>
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Schedule</span>
          </h2>
          <div className="flex justify-center"><Divider /></div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Three days of competitions, keynotes, workshops and networking at KFUPM.
            Choose your track, then browse the day.
          </p>
        </div>

        {/* Track segmented control */}
        <div className="faq-pop flex justify-center mb-4" style={{ animationDelay: "60ms" }}>
          <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl"
            style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${TEAL}22`, backdropFilter: "blur(12px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            {(["All", "Youth", "Undergraduate"] as const).map((t) => {
              const on = track === t;
              return (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  className="ag-seg px-6 md:px-10 py-3 rounded-xl text-xs md:text-sm font-mono font-bold tracking-[0.18em] uppercase"
                  style={on
                    ? {
                        background: t === "Youth"
                          ? `linear-gradient(135deg, ${ORANGE}, #C8631A)`
                          : `linear-gradient(135deg, ${TEAL}, #08A8B8)`,
                        color: "#07111E",
                        boxShadow: `0 10px 30px -12px ${t === "Youth" ? ORANGE : TEAL}`,
                      }
                    : { background: "transparent", color: "var(--muted-foreground)" }
                  }
                >
                  {t === "All" ? "Full Schedule" : t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day segmented control */}
        <div className="faq-pop flex justify-center mb-10" style={{ animationDelay: "100ms" }}>
          <div className="inline-flex gap-1 p-1.5 rounded-2xl"
            style={{ background: "rgba(13,30,48,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            {AGENDA_DAYS.map((d) => {
              const on = d.id === day;
              return (
                <button
                  key={d.id}
                  onClick={() => setDay(d.id)}
                  className="ag-seg px-7 md:px-12 py-2.5 rounded-xl text-xs font-mono font-bold tracking-[0.2em] uppercase"
                  style={on
                    ? { background: "rgba(255,255,255,0.95)", color: "#07111E" }
                    : { background: "transparent", color: "var(--muted-foreground)" }
                  }
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big day title */}
        <div key={`${day}-${track}`} className="ag-daytitle text-center mb-8">
          <div className="font-display font-extrabold text-4xl md:text-5xl tracking-[0.28em] md:tracking-[0.34em] pl-[0.28em]"
            style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {dayData.label.toUpperCase()}
          </div>
          <div className="text-sm font-mono text-muted-foreground mt-3 tracking-[0.12em]">
            {dayData.weekday} · {dayData.date}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-5 text-xs font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Layers className="w-3 h-3" style={{ color: TEAL }} />{byTrack.length} sessions</span>
            <span className="inline-flex items-center gap-1.5"><Trophy className="w-3 h-3" style={{ color: ORANGE }} />{compCount} competitions</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" style={{ color: TEAL }} />starts {firstTime}</span>
          </div>
        </div>

        {/* Session-type filter */}
        <div className="faq-pop flex flex-wrap justify-center gap-2 mb-8" style={{ animationDelay: "140ms" }}>
          <button
            onClick={() => setCat("All")}
            className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200"
            style={cat === "All"
              ? { background: "#fff", color: "#07111E" }
              : { background: "rgba(13,30,48,0.55)", color: "var(--muted-foreground)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(8px)" }
            }
          >
            All Types
          </button>
          {AGENDA_CATS.map((c) => {
            const n =
              byTrack.filter((i) => i.cat === c).length +
              allDayForTrack.filter((a) => a.cat === c).length;
            const on = cat === c;
            const col = AGENDA_CAT_COLOR[c];
            return (
              <button
                key={c}
                onClick={() => setCat(on ? "All" : c)}
                className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 inline-flex items-center gap-2"
                style={on
                  ? { background: col, color: "#07111E" }
                  : { background: "rgba(13,30,48,0.55)", color: "var(--muted-foreground)", border: `1px solid ${col}40`, backdropFilter: "blur(8px)", opacity: n === 0 ? 0.35 : 1 }
                }
              >
                <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: on ? "#07111E" : col }} />
                {AGENDA_CAT_LABEL[c]}
                <span style={{ opacity: 0.65 }}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Schedule table */}
        <div className="faq-pop rounded-2xl overflow-hidden border" style={{
          animationDelay: "180ms",
          borderColor: "rgba(255,255,255,0.09)",
          background: "rgba(7,17,30,0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
        }}>
          {/* Table header */}
          <div className="grid md:grid-cols-[200px_1fr_200px] md:gap-4 pl-[23px] pr-5 py-3.5"
            style={{ background: `linear-gradient(90deg, ${TEAL}, ${ORANGE})` }}>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.24em] uppercase" style={{ color: "#07111E" }}>
              <Clock className="w-3.5 h-3.5" /> Time
            </div>
            <div className="hidden md:block text-[11px] font-mono font-bold tracking-[0.24em] uppercase" style={{ color: "#07111E" }}>
              Session
            </div>
            <div className="hidden md:block text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-right" style={{ color: "#07111E" }}>
              Track & Type
            </div>
          </div>

          {/* Rows */}
          {items.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              No sessions match this combination — try another track or session type.
            </div>
          )}

          {items.map((it, i) => {
            const col = AGENDA_CAT_COLOR[it.cat];
            const tint = trackTint(it.track);
            return (
              <div
                key={`${day}-${track}-${cat}-${i}`}
                className={`ag-row grid md:grid-cols-[200px_1fr_200px] md:items-center gap-2 md:gap-4 px-5 py-4 ${i % 2 ? "ag-row-alt" : ""}`}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.055)",
                  borderLeft: `3px solid ${col}`,
                  animationDelay: `${Math.min(i, 10) * 45}ms`,
                }}
              >
                <div className="inline-flex items-start gap-2.5">
                  <span className="inline-block rounded-full flex-shrink-0 mt-[7px]"
                    style={{ width: 7, height: 7, background: col, boxShadow: `0 0 10px ${col}99` }} />
                  <span className="text-sm font-mono text-white leading-snug tracking-tight">{it.time}</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base md:text-lg text-white leading-snug">{it.title}</h3>
                  {it.speakers && (
                    <p className="text-sm leading-relaxed mt-1" style={{ color: TEAL }}>{it.speakers}</p>
                  )}
                  {it.note && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 italic">{it.note}</p>
                  )}
                </div>

                <div className="flex md:justify-end flex-wrap items-start gap-1.5 mt-1 md:mt-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ color: tint, background: `${tint}12`, border: `1px solid ${tint}30` }}>
                    {it.track === "Youth" ? "Youth" : "Undergrad"}
                  </span>
                  {it.cat !== "Unclassified" && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ color: col, background: `${col}12`, border: `1px solid ${col}30` }}>
                      {AGENDA_CAT_LABEL[it.cat]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Table footer */}
          <div className="px-5 py-3.5 text-center text-[11px] font-mono tracking-[0.2em] uppercase"
            style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.07)", color: "var(--muted-foreground)" }}>
            <MapPin className="w-3 h-3 inline-block mr-2 -mt-0.5" style={{ color: TEAL }} />
            Location: Saudi Arabia · Dhahran · KFUPM
          </div>
        </div>

        {/* All-day activities */}
        {allDay.length > 0 && (
          <GlassCard className="mt-10" delay={220}>
            <div className="relative z-10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Zap className="w-4 h-4" style={{ color: ORANGE }} />
                <span className="text-xs font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE }}>
                  Running All Day · {dayData.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {allDay.map((a) => {
                  const col = AGENDA_CAT_COLOR[a.cat];
                  return (
                    <span key={a.title}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-white"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${col}33` }}>
                      <span className="inline-block rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: col }} />
                      {a.title}
                      {a.track && (
                        <span className="text-[11px] font-mono" style={{ color: trackTint(a.track) }}>
                          {a.track === "Youth" ? "YOUTH" : "UNDERGRAD"}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10">
          {AGENDA_CATS.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="inline-block rounded-sm" style={{ width: 10, height: 10, background: AGENDA_CAT_COLOR[c] }} />
              {AGENDA_CAT_LABEL[c]}
            </span>
          ))}
        </div>

        <p className="text-xs font-mono text-center text-muted-foreground mt-8">
          Agenda is provisional and subject to change. Final timings will be confirmed closer to the event.
        </p>
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

  const benefits = [
    { icon: <Users className="w-5 h-5" />, title: "Talent Access", color: TEAL, text: "Direct connection with 1,000+ top chemical engineering students from the GCC's leading universities." },
    { icon: <Star className="w-5 h-5" />, title: "Brand Visibility", color: ORANGE, text: "Prominent placement in all conference materials, digital channels, and event signage." },
    { icon: <Heart className="w-5 h-5" />, title: "CSR Impact", color: TEAL, text: "Invest in the future of STEM education and the region's next generation of engineers." },
    { icon: <Network className="w-5 h-5" />, title: "Industry Engagement", color: ORANGE, text: "Position your company as a leader in shaping the engineering landscape of the GCC." },
  ];

  return (
    <div className="relative overflow-hidden pt-24 pb-28" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}>
      {/* Scoped animations (match Logistics / FAQ) */}
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }
      `}</style>

      {/* Molecule network background + glow orbs + faint grid */}
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
        {/* Header — line eyebrow + two-line gradient title (matches Logistics / FAQ) */}
        <div className="faq-pop">
          <div className="mb-7">
            <GradientEyebrow>Grow Together</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Partnership &amp;</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Sponsorship</span>
          </h2>
          <Divider />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mt-4 items-start">
          {/* LEFT — intro + benefit cards (Mission/Vision card treatment) */}
          <div>
            <p className="faq-pop text-muted-foreground leading-relaxed text-lg mb-8" style={{ animationDelay: "120ms" }}>
              SRC 2026 offers unparalleled access to the GCC's top undergraduate engineering talent. Partner with us to build your brand, recruit future leaders, and demonstrate commitment to engineering education.
            </p>
            <div className="faq-pop grid sm:grid-cols-2 gap-6" style={{ animationDelay: "200ms" }}>
              {benefits.map((item) => (
                <InteractiveCard
                  key={item.title}
                  accent={item.color}
                  className="group relative rounded-2xl p-6 overflow-hidden transition-colors duration-300"
                  style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${item.color}30` }}
                >
                  <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`, filter: "blur(28px)" }} />
                  <div className="relative flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}>
                      {item.icon}
                    </div>
                    <span className="font-display text-lg font-extrabold text-white">{item.title}</span>
                  </div>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </InteractiveCard>
              ))}
            </div>
          </div>

          {/* RIGHT — unified partnership statement + plain CTA */}
          <div>
            <h3 className="faq-pop font-display text-xl font-bold text-white mb-6" style={{ animationDelay: "160ms" }}>Partnership Packages</h3>
            <div className="faq-pop" style={{ animationDelay: "240ms" }}>
              <InteractiveCard
                accent={TEAL}
                className="group relative rounded-2xl p-8 overflow-hidden transition-colors duration-300"
                style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${TEAL}30` }}
              >
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${TEAL}40 0%, transparent 70%)`, filter: "blur(28px)" }} />
                <p className="relative text-muted-foreground leading-relaxed">
                  SRC 2026 offers a range of sponsorship and partnership packages designed to fit organizations of every size and goal — from brand visibility and on-site activation to direct engagement with the region's top engineering talent. Request our sponsorship proposal for the full breakdown of tiers, benefits, and custom options.
                </p>
              </InteractiveCard>
            </div>

            {/* CTA / contact — plain content, NOT in a card */}
            <div className="faq-pop mt-8" style={{ animationDelay: "320ms" }}>
              <div className="flex flex-wrap gap-3 mb-5">
                <CTAButton primary>Request Partnership Proposal <ArrowRight className="w-4 h-4" /></CTAButton>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" style={{ color: TEAL }} /> aiche@kfupm.edu.sa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Organizing Team ──────────────────────────────────────────────────────────
function OrganizingPage() {
  const leadership = [
    { title: "Conference Advisor", name: "Dr. Basim Abussaud", note: "Faculty oversight and strategic guidance", icon: <Star className="w-6 h-6" />, color: TEAL },
    { title: "Conference Chair", name: "Faisal Alasmari", note: "Overall leadership and direction", icon: <Award className="w-7 h-7" />, color: ORANGE, featured: true },
    { title: "Conference General Coordinator", name: "Faisal Alharthi", note: "Operational coordination", icon: <Target className="w-6 h-6" />, color: TEAL },
  ];

  const committees: { title: string; members: { name: string; role?: string }[] }[] = [
    {
      title: "Heads of Committees",
      members: [
        { name: "Fatimah Almahfoudh", role: "Outreach Head" },
        { name: "Manar Alahmed", role: "Logistics & Operation Day Head" },
        { name: "Ashraf Almallahi", role: "Technical Program Head" },
        { name: "Mohammed Al-Ghadeeb", role: "Marketing Head" },
        { name: "Reema Aldkheli", role: "Sponsorship Head" },
        { name: "Mesk Almutairi", role: "Financial Officer" },
        { name: "Zainab AlMutawa", role: "Technical Sessions Leader" },
        { name: "Saba Aljohani", role: "Web Development Leader" },
        { name: "Zainab Alkhater", role: "Physical Marketing Leader" },
        { name: "Dali Alanzi", role: "Social Media Leader" },
        { name: "Alaa Alsadiq", role: "Design Leader" },
        { name: "Mohammed Almahasnah", role: "Sr. Consultant" },
        { name: "Fatimah Almakinah", role: "Sr. Consultant" },
        { name: "Zainab Aldukhi", role: "Consultant" },
        { name: "Ahmad Albalawi", role: "Consultant" },
        { name: "Alaa Alsaad", role: "Marketing Consultant" },
        { name: "Asseel Alzahrani", role: "Sponsorship Consultant" },
        { name: "Abdullah Alomar", role: "Technical Program Consultant" },
        { name: "Meshal Alrefaei", role: "Sponsorship Consultant" },
      ],
    },
    { title: "Sponsorships Committee", members: [] },
    { title: "Outreach Committee", members: [] },
    { title: "Logistics Committee", members: [] },
    { title: "Activities and Engagement Subcommittee", members: [] },
    { title: "Competitions Subcommittee", members: [] },
    { title: "Web Development Subcommittee", members: [] },
    { title: "Physical Marketing Subcommittee", members: [] },
    { title: "Social Media Subcommittee", members: [] },
    { title: "Design Subcommittee", members: [] },
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
                  <p className="text-sm text-white/90 mb-1">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.note}</p>
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
                    </div>
                  </div>

                  <Marquee reverse={i % 2 === 1} speed={40}>
                    {(committee.members.length > 0
                      ? committee.members
                      : Array.from({ length: 6 }).map(() => null)
                    ).map((m, j) => (
                      <div
                        key={j}
                        className="w-40 shrink-0 rounded-xl p-4 flex flex-col items-center text-center"
                        style={{ background: "rgba(13,30,48,0.5)", border: `1px solid ${TEAL}22` }}
                      >
                        <div
                          className="w-14 h-14 rounded-full mb-3 flex items-center justify-center"
                          style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}30`, color: `${TEAL}99` }}
                        >
                          <Users className="w-5 h-5" />
                        </div>
                        {m ? (
                          <>
                            <p className="text-white text-xs font-semibold leading-tight mb-1">{m.name}</p>
                            {m.role && (
                              <p className="text-[10px] text-muted-foreground leading-tight">{m.role}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-16 rounded-full mb-2" style={{ background: `${TEAL}22` }} />
                            <div className="h-2 w-10 rounded-full" style={{ background: `${TEAL}15` }} />
                          </>
                        )}
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
                <button key={item.label} className="w-full flex items-center justify-between p-4 rounded-xl border text-sm font-medium text-foreground hover:border-[#0CBFCE]/40 hover:text-white transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
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
function FAQPage({ goToContactForm }: { goToContactForm: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  const faqs: {
    q: string; a: string; list?: string[];
  }[] = [
    {
      q: "Are international (non-Saudi) scholarship students allowed to participate?",
      a: "Yes. The conference is open to all university students, and everyone is welcome to register for the competitions.",
    },
    {
      q: "For the Poster Competition (Research), can someone participate if they only have an initial idea that has not been fully developed?",
      a: "No. The submission must be a genuine research project with sufficient data and findings to present. An initial idea alone is not considered a research project.",
    },
    {
      q: "What are the eligibility requirements for the Poster and Presentation Competitions?",
      a: "Any university student may participate. Winners will qualify to compete at the AIChE Annual Student Conference in the United States, provided their major falls under a STEM discipline. STEM stands for:",
      list: ["Science", "Technology", "Engineering", "Mathematics"],
    },
    {
      q: "Will participants in the Poster Competition receive a certificate even if they do not qualify or win?",
      a: "Yes. All participants in the Poster Competition will receive a certificate.",
    },
    {
      q: "Does the Poster Competition require a prototype or completed project, or is a research study sufficient?",
      a: "A research study is sufficient. A prototype or completed project is not required.",
    },
    {
      q: "When will the competitions take place?",
      a: "",
      list: [
        "Day 1 (August 31): ChemE Jeopardy",
        "Day 2 (September 1): Poster Competition",
        "Day 3 (September 2): Chem-E-Car & Presentation Competition",
      ],
    },
    {
      q: "Is the conference only intended for Chemical Engineering students?",
      a: "No. While the conference focuses on Chemical Engineering, it welcomes students from various majors. The workshops, keynote sessions, and technical talks offer valuable learning opportunities for students from different academic backgrounds.",
    },
    {
      q: "What are the conference hours?",
      a: "",
      list: [
        "Day 1: 8:30 AM – 8:30 PM",
        "Day 2: 8:30 AM – 8:30 PM",
        "Day 3: 8:30 AM – 10:00 PM",
      ],
    },
    {
      q: "Is the Poster Competition limited to individual participation?",
      a: "No. Participants may choose to compete individually or as a team.",
    },
    {
      q: "Regarding AIChE membership, is it necessary to have a Global AIChE membership or just be a member of the university's student chapter?",
      a: "Participants are required to have an AIChE Global Membership. The process is straightforward, and after registering for the competition, participants will be guided through the steps to obtain their membership.",
    },
  ];

  const askMailto = `mailto:src2026@kfupm.edu.sa?subject=${encodeURIComponent("Question about SRC 2026")}`;

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}
    >
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

        {/* Header */}
        <div className="faq-pop">
         <div className="mb-7">
            <GradientEyebrow>Got Questions?</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Frequently Asked</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Questions</span>
          </h2>
          <Divider />
        </div>

        {/* FAQ items */}
        <div className="space-y-3 mt-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const accent = TEAL;
            return (
                <InteractiveCard
                  key={i}
                  accent={accent}
                  className="faq-pop rounded-xl border overflow-hidden group transition-colors duration-300"
                  style={{
                    background: "var(--card)",
                    borderColor: isOpen ? `${accent}66` : "var(--border)",
                    animationDelay: `${140 + i * 70}ms`,
                  }}
                >
                  {/* Accent status bar (top-right) — site card signature */}
                  <div className="absolute top-0 right-14 w-12 h-1 rounded-b-md pointer-events-none z-10"
                    style={{
                      background: isOpen ? accent : `${accent}25`,
                      boxShadow: isOpen ? `0 1px 10px ${accent}` : "none",
                      transition: "background 0.3s ease, box-shadow 0.3s ease",
                    }} />

                  {/* Question */}
                  <button
                    className="relative z-10 w-full flex items-center gap-4 p-6 text-left focus:outline-none"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-white text-base flex-1 pr-2">{faq.q}</span>
                    <span
                      className="flex-shrink-0"
                      style={{
                        color: accent,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.5s cubic-bezier(.16,.84,.44,1)",
                      }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Answer — grid-template-rows dropdown */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.55s cubic-bezier(.16,.84,.44,1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        className="relative z-10 px-6 pb-6 text-sm leading-relaxed border-t"
                        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                      >
                        <div className="pt-4">
                          {faq.a && <p className="mb-0">{faq.a}</p>}
                          {faq.list && (
                            <ul className={`space-y-1.5 ${faq.a ? "mt-3" : ""}`}>
                              {faq.list.map((d) => (
                                <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
            );
          })}
        </div>

        {/* More questions CTA */}
        <div
          className="faq-pop mt-12 rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: "rgba(13,30,48,0.55)",
            border: `1px solid ${ORANGE}30`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            animationDelay: `${140 + faqs.length * 70 + 80}ms`,
          }}
        >
          <div className="absolute inset-x-0 -top-16 h-40 pointer-events-none" style={{
            background: `radial-gradient(60% 80% at 50% 0%, ${ORANGE}40 0%, transparent 70%)`,
            filter: "blur(12px)",
          }} />
          <div className="relative">
            <HelpCircle className="w-8 h-8 mx-auto mb-3" style={{ color: ORANGE }} />
            <h3 className="font-display text-2xl font-bold text-white mb-2">Do you have more questions?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Send us a message and our team will get back to you.
            </p>
            <CTAButton primary onClick={goToContactForm}>
              Send us a Message <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <div className="mt-4">
              <a href={askMailto} className="text-xs text-muted-foreground hover:text-white transition-colors no-underline">
                or email us directly
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage({ focusForm = false, onFocusHandled }: { focusForm?: boolean; onFocusHandled?: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    if (!focusForm) return;
    const t = setTimeout(() => {
      const el = formRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1600);
      }
      onFocusHandled?.();
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusForm]);

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(232,124,42,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes faqFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(0,-26px) scale(1.05); } }
        @keyframes faqDrift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,16px) scale(1.08); } }
        @keyframes faqGlow  { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
        @keyframes faqPop   { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .faq-pop { animation: faqPop .6s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) { .faq-pop { animation: none; } }

        .contact-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: #E8EDF5;
          font-size: 16px;
          padding: 10px 0 12px;
          outline: none;
          transition: border-color 0.3s;
          font-family: inherit;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.25); }
        .contact-input:focus { border-bottom-color: ${TEAL}; }
        .contact-input.highlight-focus { border-bottom-color: ${TEAL}; box-shadow: 0 2px 0 0 ${TEAL}55; }
        textarea.contact-input { resize: none; }
      `}</style>

      {/* Background — matches FAQ/Logistics/Partnership exactly */}
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

      <div className="relative max-w-2xl mx-auto px-6">

        {/* Header — same eyebrow + gradient title as other pages */}
        <div className="faq-pop mb-12">
          <div className="mb-7">
            <GradientEyebrow>Get In Touch</GradientEyebrow>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            <span className="text-white">Get In</span>
            <br />
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Touch.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-4 max-w-lg">
            Whether you have questions about registration, partnerships, logistics, or the program — our team will get back to you promptly.
          </p>
        </div>

        {/* Form — floats directly on the dark background, no card wrapper */}
        <div
          ref={formRef}
          className="faq-pop"
          style={{
            animationDelay: "120ms",
            scrollMarginTop: "100px",
            outline: highlight ? `2px solid ${TEAL}55` : "none",
            outlineOffset: highlight ? "22px" : "0px",
            borderRadius: 8,
            transition: "outline 0.4s ease, outline-offset 0.4s ease",
          }}
        >
          {sent ? (
            <div className="text-center py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: TEAL }} />
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">Message Sent.</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Thank you for reaching out. We'll get back to you within 48 hours.
              </p>
              <button
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: TEAL }}
                onClick={() => setSent(false)}
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Field rows — underline style, no boxes */}
              <div className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmed Al-Rashidi"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      className={`contact-input${highlight ? " highlight-focus" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ahmed@university.edu"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      className="contact-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Partnership Inquiry"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    required
                    className="contact-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${TEAL}99` }}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    className="contact-input"
                  />
                </div>
              </div>

              {/* Divider + submit row */}
              <div
                className="mt-10 pt-8 flex items-center justify-between gap-4 flex-wrap"
              >
                <CTAButton primary>
                  Send Message <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            </form>
          )}
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
    { label: "Registration", section: "registration" },
    { label: "Teams", section: "teams" },
    { label: "Partnership", section: "partnership" },
    { label: "Organizing Team", section: "organizing" },
    { label: "Media", section: "media" },
    { label: "FAQ", section: "faq" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <footer className="border-t" style={{ background: "#050D18", borderColor: `${TEAL}15` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-start mb-12">
          <div className="max-w-lg ml-6">
            <SRCLogo size={70} />
            <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-sm leading-relaxed">
              The first AIChE Student Regional Conference in the GCC — bringing together the brightest chemical engineering minds across the region.
            </p>
            <div className="flex justify-start gap-3">
  {[
    {
      icon: <Instagram className="w-4 h-4" />,
      color: "#E1306C",
      href: "https://www.instagram.com/kfupm_aiche/",
    },
    {
      icon: <Twitter className="w-4 h-4" />,
      color: "#1DA1F2",
      href: "https://x.com/KFUPMAIChE?lang=ar",
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      color: "#0A66C2",
      href: "https://sa.linkedin.com/company/kfupm-aiche",
    },
    {
      icon: <Youtube className="w-4 h-4" />,
      color: "#FF0000",
      href: "https://youtube.com/@kfupmaiche?si=FpLHkciIUcAnlXAZ",
    },
  ].map((s, i) => (
    <a
      key={i}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-xl flex items-center justify-center border hover:border-white/30 transition-colors"
      style={{
        background: "#0D1E30",
        borderColor: `${TEAL}20`,
        color: s.color,
      }}
    >
      {s.icon}
    </a>
  ))}
</div>

<div className="space-y-2 mt-6">
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Mail className="w-4 h-4" style={{ color: TEAL }} />
    aiche@kfupm.edu.sa
  </div>

  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <MapPin className="w-4 h-4" style={{ color: TEAL }} />
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

// ─── Registration Modal ───────────────────────────────────────────────────────
const REG_TYPES = [
  {
    id: "participant" as const,
    icon: <Users className="w-7 h-7" />,
    title: "Visitor",
    desc: "Attend sessions, workshops, panels, and networking events.",
    color: TEAL,
  },
  {
    id: "team" as const,
    icon: <Trophy className="w-7 h-7" />,
    title: "Competition Participant",
    desc: "Register to compete in one of our flagship competitions.",
    color: ORANGE,
  },
];

const COMPETITIONS = [
  {
    id: "chem-e-car" as const,
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Chem-E-Car",
    desc: "Design a car powered by a chemical energy source.",
    color: TEAL,
    formUrl: "", // Add external link if needed later
  },
  {
    id: "cheme-jeopardy" as const,
    icon: <Trophy className="w-6 h-6" />,
    title: "ChemE Jeopardy",
    desc: "Fast-paced trivia on chemical engineering topics (Teams of 4).",
    color: ORANGE,
    formUrl: "https://forms.gle/J1iAXjN98r2nNoxy6",
  },
  {
    id: "technical-presentation" as const,
    icon: <Presentation className="w-6 h-6" />,
    title: "Technical Presentation",
    desc: "Present original technical research to industry judges.",
    color: TEAL,
    formUrl: "https://forms.gle/W1LP6t2KiHFNSJ6y9",
  },
  {
    id: "poster-competition" as const,
    icon: <FileText className="w-6 h-6" />,
    title: "Poster Competition",
    desc: "Present research in a dynamic poster gallery setting.",
    color: ORANGE,
    formUrl: "https://forms.gle/vGEnWBdgs3p6mRfg7",
  },
];

const TEAM_COMPETITIONS: Record<string, { exactMembers?: number }> = {
  "chem-e-car": {},
  "cheme-jeopardy": { exactMembers: 4 },
};
const INDIVIDUAL_COMPETITIONS = ["technical-presentation"];

const STEP_LABELS = ["Select Type", "Fill Information", "Review & Submit"];

function RegistrationModal({ open, onClose, onLoginSuccess, initialCompetition = null }: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  initialCompetition?: Competition;
}) {
  // "register" = the existing conference flow (unchanged).
  // "login"    = the modal body is swapped for the lightweight login screen.
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [regType, setRegType] = useState<RegType>(null);
  const [competition, setCompetition] = useState<Competition>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setStep(0);
        setRegType(null);
        setCompetition(null);
        setFormData({});
        setSubmitted(false);
        setSubmitting(false);
        setSubmitError(null);
        setMode("register");
        setLoginName("");
        setLoginEmail("");
        setLoginError(null);
        setLoggingIn(false);
      }, 300);
      return () => clearTimeout(id); // reopening cancels the pending reset
    }
  }, [open]);

  // Deep link from the Competitions page — jump straight to the team form
  // with the chosen competition preselected (user can still hit "Change").
  useEffect(() => {
    if (open && initialCompetition) {
      setMode("register");
      setSubmitted(false);
      setRegType("team");
      setCompetition(initialCompetition);
      setStep(1);
    }
  }, [open, initialCompetition]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const setField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleTypeSelect = (type: RegType) => {
    setRegType(type);
    setStep(1);
  };

  const goBack = () => {
    if (step === 2) { setStep(1); return; }
    if (step === 1) {
      if (regType === "team" && competition) { setCompetition(null); return; }
      setStep(0); setRegType(null);
    }
  };

  const handleSubmit = async () => {
  if (!regType || submitting) return;
  setSubmitting(true);
  setSubmitError(null);
  
  try {
    await submitRegistration({
      type: regType,
      competition: regType === "team" ? competition : null,
      data: formData,
    });

    // Lightweight user record — one per email, never duplicated.
    // Wrapped separately so it can never fail an otherwise-successful registration.
    const newUserEmail = (formData.email ?? "").trim();
    const newUserName = (formData.fullName ?? formData.contactPerson ?? formData.teamName ?? "").trim();
    if (newUserEmail) {
      try {
        await createUserIfNotExists(newUserName, newUserEmail);
      } catch (userErr) {
        console.error("User record error:", userErr);
      }
    }

    setSubmitted(true);
  } catch (e: any) {
    console.error("Firestore submit error:", e);
    setSubmitError(e?.message || "Submission failed. Please check your connection and try again.");
  } finally {
    setSubmitting(false);
  }
};

  // Lightweight login — Firestore lookup by email only. No auth, no passwords.
  const handleLogin = async () => {
    const email = loginEmail.trim();
    const name = loginName.trim();
    if (!email || !name || loggingIn) return;

    setLoggingIn(true);
    setLoginError(null);
    try {
      const found = await findUserByEmail(email);
      if (!found) {
        setLoginError("This email is not registered.");
        return;
      }
      onLoginSuccess(found);
      onClose();
    } catch (e: any) {
      console.error("Firestore login error:", e);
      setLoginError(e?.message || "Login failed. Please check your connection and try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const getFields = (): { key: string; label: string; type?: string; required?: boolean; options?: string[]; max?: number }[] => {
    switch (regType) {
      case "participant": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "organization", label: "Organization / Company / University", required: true },
        { key: "position", label: "Position / Job Title", required: true },
        { key: "country", label: "Country", required: true },
      ];
      case "team": {
        if (competition === "technical-presentation") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Presenter Name", required: true },
            { key: "email", label: "Presenter Email", type: "email", required: true },
            { key: "phone", label: "Presenter Phone Number", required: true },
            { key: "major", label: "Major", required: true },
            { key: "topic", label: "General Presentation Topic", required: true },
            { key: "aicheConfirm", label: "I confirm I am an active AIChE Student Member", type: "checkbox", required: true },
          ];
        }

        if (competition === "poster-competition") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Lead Participant Name", required: true },
            { key: "email", label: "Lead Participant Email", type: "email", required: true },
            { key: "phone", label: "Lead Participant Phone Number", required: true },
            { key: "major", label: "Major", required: true },
            { key: "topic", label: "General Research Topic (e.g. Water Treatment, Renewable Energy)", required: true },
            { key: "coAuthors", label: "Co-Authors / Additional Team Members (Names & Majors)", type: "textarea", required: false },
            { key: "aicheConfirm", label: "I confirm all participants are active AIChE Student Members", type: "checkbox", required: true },
          ];
        }

        if (competition === "cheme-jeopardy") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Team Captain Name", required: true },
            { key: "email", label: "Team Captain Email", type: "email", required: true },
            { key: "phone", label: "Team Captain Phone Number", required: true },
            { key: "member1", label: "Member 1 Name & Major (Captain)", required: true },
            { key: "member2", label: "Member 2 Name & Major", required: true },
            { key: "member3", label: "Member 3 Name & Major", required: true },
            { key: "member4", label: "Member 4 Name & Major", required: true },
            { key: "aicheConfirm", label: "I confirm all 4 members are active AIChE Student Members", type: "checkbox", required: true },
          ];
        }

        // Fallback for Chem-E-Car
        return [
          { key: "university", label: "University Name", required: true },
          { key: "fullName", label: "Team Leader Name", required: true },
          { key: "email", label: "Team Leader Email", type: "email", required: true },
          { key: "phone", label: "Phone Number", required: true },
          { key: "teamName", label: "Team Name", required: true },
          { key: "aicheConfirm", label: "I confirm all team members are active AIChE Student Members", type: "checkbox", required: true },
        ];
      }
      case "speaker": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "organization", label: "Organization", required: true },
        { key: "position", label: "Position", required: true },
        { key: "country", label: "Country", required: true },
        { key: "role", label: "Role", options: ["Speaker", "Judge", "Mentor"], required: true },
      ];
      case "volunteer": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "university", label: "University", required: true },
        { key: "major", label: "Major", required: true },
        { key: "country", label: "Country", required: true },
      ];
      case "partner": return [
        { key: "companyName", label: "Company Name", required: true },
        { key: "contactPerson", label: "Contact Person", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "position", label: "Position", required: true },
        { key: "country", label: "Country", required: true },
        { key: "partnershipInterest", label: "Partnership Interest", required: true },
      ];
      default: return [];
    }
  };

  const isFormValid = () => {
    if (regType === "team" && !competition) return false;
    const fields = getFields();
    for (const f of fields) {
      const val = (formData[f.key] ?? "").trim();
      if (f.required && !val) return false;
      if (f.type === "checkbox" && f.required && val !== "true") return false;
      if (val && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
    }
    return true;
  };

  const getRegTypeLabel = () => REG_TYPES.find(r => r.id === regType)?.title ?? "";
  const getCompetitionLabel = () => COMPETITIONS.find(c => c.id === competition)?.title ?? "";

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: "rgba(4, 10, 18, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "regOverlayIn 0.25s ease forwards",
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <style>{`
        @keyframes regOverlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes regModalIn { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes regStepIn { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: translateX(0) } }
        .reg-modal { animation: regModalIn 0.3s cubic-bezier(.16,.84,.44,1) forwards; }
        .reg-step { animation: regStepIn 0.3s cubic-bezier(.16,.84,.44,1) forwards; }
        .reg-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(12, 191, 206, 0.2);
          background: rgba(7, 17, 30, 0.6);
          color: #E8EDF5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .reg-input:focus { border-color: #0CBFCE; box-shadow: 0 0 0 3px rgba(12,191,206,0.12); }
        .reg-select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(12, 191, 206, 0.2);
          background: rgba(7, 17, 30, 0.6);
          color: #E8EDF5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
          font-family: inherit;
          cursor: pointer;
        }
        .reg-select:focus { border-color: #0CBFCE; box-shadow: 0 0 0 3px rgba(12,191,206,0.12); }
        .reg-select option { background: #0D1E30; color: #E8EDF5; }
        .reg-card-type {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(12, 191, 206, 0.18);
          background: rgba(13, 30, 48, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .reg-card-type:hover {
          border-color: rgba(12, 191, 206, 0.5);
          background: rgba(12, 191, 206, 0.07);
          transform: translateY(-1px);
        }
        .reg-card-type-lg { flex-direction: column; align-items: flex-start; gap: 14px; padding: 22px 20px; }
        .reg-card-comp {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(12, 191, 206, 0.18);
          background: rgba(13, 30, 48, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .reg-card-comp:hover {
          border-color: rgba(12, 191, 206, 0.5);
          background: rgba(12, 191, 206, 0.07);
          transform: translateY(-1px);
        }
        .reg-progress-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600;
        }
        .reg-progress-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .reg-progress-line {
          flex: 1; height: 1px;
          transition: background 0.3s;
        }
        .reg-review-row {
          display: flex;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
          gap: 12px;
        }
        .reg-review-row:last-child { border-bottom: none; }
      `}</style>

      <div
        className="reg-modal relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(9, 20, 34, 0.95)",
          border: `1px solid ${TEAL}30`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${TEAL}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Ambient glow top-right */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 0%, ${TEAL}15 0%, transparent 60%)`, borderRadius: "0 1rem 0 0" }} />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <div>
            <p className="text-xs font-mono tracking-[0.2em] uppercase mb-0.5" style={{ color: TEAL }}>SRC 2026</p>
            <h2 className="font-display text-xl font-bold text-white">
              {mode === "login"
                ? "Welcome Back"
                : submitted ? "Registration Submitted" : step === 0 ? "Register" : step === 1 ? getRegTypeLabel() : "Review & Submit"}
            </h2>
            {mode === "register" && !submitted && step === 0 && (
              <button
                type="button"
                onClick={() => { setMode("login"); setLoginError(null); }}
                className="mt-1.5 text-xs text-left transition-opacity hover:opacity-75"
                style={{ color: "var(--muted-foreground)" }}
              >
                Already registered?{" "}
                <span className="font-semibold underline" style={{ color: TEAL }}>Log in here</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        {mode === "register" && !submitted && (
          <div className="relative z-10 px-6 pb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="reg-progress-step">
                    <div
                      className="reg-progress-dot"
                      style={
                        i < step
                          ? { background: TEAL, color: "#07111E" }
                          : i === step
                          ? { background: `${TEAL}20`, border: `2px solid ${TEAL}`, color: TEAL }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--muted-foreground)" }
                      }
                    >
                      {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className="hidden sm:block text-xs" style={{ color: i <= step ? TEAL : "var(--muted-foreground)" }}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="reg-progress-line flex-1" style={{ background: i < step ? TEAL : "rgba(255,255,255,0.1)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex-shrink-0 mx-6" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">

          {/* LOGIN — replaces the modal body. No router, no second modal. */}
          {mode === "login" && (
            <div className="reg-step">
              <p className="text-muted-foreground text-sm mb-5">
                Enter the name and email you used when registering for SRC 2026.
              </p>
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    Full Name<span style={{ color: TEAL }}> *</span>
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    value={loginName}
                    onChange={e => setLoginName(e.target.value)}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    Email<span style={{ color: TEAL }}> *</span>
                  </label>
                  <input
                    className="reg-input"
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(null); }}
                    onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs mt-3" style={{ color: "#ff8a8a" }}>{loginError}</p>
              )}

              <div className="mt-7 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setMode("register"); setLoginError(null); }}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  ← Back to registration
                </button>
                <CTAButton
                  primary
                  onClick={handleLogin}
                  className={(!loginName.trim() || !loginEmail.trim() || loggingIn) ? "opacity-40 pointer-events-none" : ""}
                >
                  {loggingIn ? "Logging in…" : "Login"} <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {mode === "register" && submitted && (
            <div className="reg-step text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}>
                <CheckCircle className="w-8 h-8" style={{ color: TEAL }} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">You're registered!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                Your registration as a <span className="text-white font-semibold">{getRegTypeLabel()}</span>
                {regType === "team" && competition && <> for <span className="text-white font-semibold">{getCompetitionLabel()}</span></>} has been submitted. We'll be in touch at your provided email address.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25`, color: TEAL }}>
                <Mail className="w-4 h-4" /> Confirmation sent to {formData.email || formData.leaderEmail}
              </div>
              <div className="mt-8">
                <CTAButton primary onClick={onClose}>Close</CTAButton>
              </div>
            </div>
          )}

          {/* STEP 0 — TYPE SELECTION */}
          {mode === "register" && !submitted && step === 0 && (
            <div className="reg-step">
              <p className="text-muted-foreground text-sm mb-4">How would you like to participate in SRC 2026?</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {REG_TYPES.map((type) => (
                  <button key={type.id} className="reg-card-type reg-card-type-lg" onClick={() => handleTypeSelect(type.id)}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${type.color}15`, color: type.color }}>
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-white text-base mb-1">{type.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{type.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — FORM */}
          {mode === "register" && !submitted && step === 1 && (
            <div className="reg-step">
              {/* Team: competition picker first */}
              {regType === "team" && !competition && (
                <div>
                  <p className="text-muted-foreground text-sm mb-4">Which competition would you like to register for?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMPETITIONS.map((comp) => (
                      <button key={comp.id} className="reg-card-comp" onClick={() => setCompetition(comp.id)}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${comp.color}15`, color: comp.color }}>
                          {comp.icon}
                        </div>
                        <div>
                          <div className="font-display font-bold text-white text-sm">{comp.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{comp.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form fields */}
              {(regType !== "team" || competition) && (
                <div>
                  {regType === "team" && competition && (
                    <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg" style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}30` }}>
                      <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: ORANGE }} />
                      <span className="text-sm font-semibold" style={{ color: ORANGE }}>{getCompetitionLabel()}</span>
                      <button onClick={() => setCompetition(null)} className="ml-auto text-xs text-muted-foreground hover:text-white transition-colors">Change</button>
                    </div>
                  )}
                  <div className="grid gap-4">
                    {getFields().map((field) => (
                      <div key={field.key}>
                        {field.type !== "checkbox" && (
                          <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                            {field.label}{field.required && <span style={{ color: TEAL }}> *</span>}
                          </label>
                        )}
                        {field.type === "checkbox" ? (
                          <label className="flex items-center gap-3 cursor-pointer mt-1">
                            <input
                              type="checkbox"
                              checked={formData[field.key] === "true"}
                              onChange={e => setField(field.key, e.target.checked ? "true" : "")}
                              className="w-4 h-4 rounded accent-[#0CBFCE] cursor-pointer"
                            />
                            <span className="text-xs text-white leading-tight">{field.label}. To become an active member, join <a href="https://www2.aiche.org/membership" className="text-blue-500 hover:underline">here</a></span>
                          </label>
                        ) : field.type === "textarea" ? (
                          <textarea
                            className="reg-input"
                            rows={3}
                            value={formData[field.key] ?? ""}
                            onChange={e => setField(field.key, e.target.value)}
                            placeholder={field.label}
                          />
                        ) : field.options ? (
                          <select
                            className="reg-select"
                            value={formData[field.key] ?? ""}
                            onChange={e => setField(field.key, e.target.value)}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <>
                            <input
                              className="reg-input"
                              type={field.type ?? "text"}
                              value={formData[field.key] ?? ""}
                              onChange={e => setField(field.key, e.target.value)}
                              placeholder={field.label}
                            />
                            {field.type === "email" && (formData[field.key] ?? "").trim() !== "" &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData[field.key] ?? "").trim()) && (
                                <p className="text-xs mt-1.5" style={{ color: "#ff8a8a" }}>Please enter a valid email address.</p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — REVIEW */}
          {mode === "register" && !submitted && step === 2 && (
            <div className="reg-step">
              <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(12,191,206,0.05)", border: `1px solid ${TEAL}20` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${TEAL}15`, color: TEAL }}>
                    {REG_TYPES.find(r => r.id === regType)?.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">{getRegTypeLabel()}</div>
                    {regType === "team" && competition && (
                      <div className="text-xs" style={{ color: ORANGE }}>{getCompetitionLabel()}</div>
                    )}
                  </div>
                </div>
                <div>
                  {getFields().map(field => (
                    formData[field.key] ? (
                      <div key={field.key} className="reg-review-row">
                        <span className="text-muted-foreground">{field.label}</span>
                        <span className="text-white font-medium text-right">{formData[field.key]}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Please review your information before submitting.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === "register" && !submitted && step > 0 && (
          <div className="relative z-10 flex-shrink-0 px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </button>

            {step === 1 && (regType !== "team" || competition) && (
              <CTAButton primary onClick={() => setStep(2)} className={isFormValid() ? "" : "opacity-40 pointer-events-none"}>
                Review <ChevronRight className="w-4 h-4" />
              </CTAButton>
            )}
            {step === 2 && (
              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <p className="text-xs text-right" style={{ color: "#ff8a8a" }}>{submitError}</p>
                )}
                <CTAButton
                  primary
                  onClick={handleSubmit}
                  className={submitting ? "opacity-60 pointer-events-none" : ""}
                >
                  {submitting ? "Submitting…" : "Submit Registration"} <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Floating "Do you need help?" button ─────────────────────────────────────
// Fixed bottom-right helper that jumps to the FAQ page. Collapsed to a glass
// circle; expands to reveal its label on hover (label always shown on touch).
function HelpButton({ active, onClick }: { active: Section; onClick: () => void }) {
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

// ─── Root App ─────────────────────────────────────────────────────────────────
const USER_STORAGE_KEY = "src2026:user";

export default function App() {
  const [section, setSection] = useState<Section>("home");
  const [regModalOpen, setRegModalOpen] = useState(false);
  // Competition preselected from a Competitions-page card ("Participate")
  const [regCompetition, setRegCompetition] = useState<Competition>(null);

  const openRegistration = (competition: Competition = null) => {
    setRegCompetition(competition);
    setRegModalOpen(true);
  };

  // Lightweight local session — a plain Firestore document, no Firebase Auth.
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); } catch { /* ignore */ }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try { localStorage.removeItem(USER_STORAGE_KEY); } catch { /* ignore */ }
  };

  const [contactFocus, setContactFocus] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // FAQ "more questions" → Contact page, then scroll to the message form.
  const goToContactForm = () => {
    setContactFocus(true);
    setSection("contact");
  };

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  const pages: Record<Section, React.ReactNode> = {
    home: <HomePage setSection={setSection} onRegisterClick={() => openRegistration()} />,
    about: <AboutPage />,
    competitions: <CompetitionsPage onParticipate={openRegistration} />,
    registration: <RegistrationPage />,
    // Agenda hidden until the schedule is public — set AGENDA_LIVE = true to restore.
      agenda: AGENDA_LIVE ? <AgendaPage /> : <AgendaComingSoon />,
    teams: <TeamsPage />,
    partnership: <PartnershipPage />,
    organizing: <OrganizingPage />,
    media: <MediaPage />,
    faq: <FAQPage goToContactForm={goToContactForm} />,
    contact: <ContactPage focusForm={contactFocus} onFocusHandled={() => setContactFocus(false)} />,
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
      `}</style>

      <Navbar
        active={section}
        setSection={setSection}
        onRegisterClick={() => openRegistration()}
        user={currentUser}
        onLogout={handleLogout}
      />

      <HelpButton active={section} onClick={() => setSection("faq")} />

      <RegistrationModal
        open={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialCompetition={regCompetition}
      />

      <main>
        {pages[section]}
      </main>

      <Footer setSection={setSection} />
    </div>
  );
}
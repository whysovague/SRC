import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Clock, Layers, MapPin, Zap } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, ComingSoonBadge, GlassCard, MoleculeNetwork } from "@/app/components/common";

export type AgendaTrack = "Youth" | "Undergraduate";

export type AgendaItem = {
  time: string;
  start: number; // minutes from midnight — drives chronological sorting
  title: string;
  track: AgendaTrack;
  /** Optional — no speakers are confirmed in the spreadsheet yet, but the row
   *  renders them, so they can be filled in per session later. */
  speakers?: string;
  note?: string;
};

// ─── Schedule data ────────────────────────────────────────────────────────────
// Transcribed from the organising team's agenda spreadsheet. `start` exists only
// so the two tracks interleave correctly when "Full Schedule" is selected — keep
// it in sync with `time` if you edit a slot.

export const AGENDA_DAYS: {
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
      { time: "8:30 am – 9:00 am", start: 510, title: "Registration & Check-in", track: "Youth" },
      { time: "9:05 am – 9:30 am", start: 545, title: "Opening Ceremony", track: "Youth" },
      { time: "9:35 am – 10:05 am", start: 575, title: "Intro to ChemE", track: "Youth" },
      { time: "10:15 am – 12:40 pm", start: 615, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth" },
      { time: "12:45 pm – 2:00 pm", start: 765, title: "Science Olympiad", track: "Youth" },
      { time: "1:00 pm – 1:15 pm", start: 780, title: "Registration & Check-in", track: "Undergraduate" },
      { time: "1:15 pm – 1:30 pm", start: 795, title: "Opening Ceremony", track: "Undergraduate" },
      { time: "1:30 pm – 2:20 pm", start: 810, title: "Keynote Speakers", track: "Undergraduate" },
      { time: "2:20 pm – 3:10 pm", start: 860, title: "Panel Talks", track: "Undergraduate" },
      { time: "3:30 pm – 6:30 pm", start: 930, title: "Chem-E-Jeopardy", track: "Undergraduate" },
      { time: "6:25 pm – 7:05 pm", start: 1105, title: "Technical Workshop", track: "Undergraduate" },
      { time: "7:05 pm – 7:20 pm", start: 1145, title: "Break", track: "Undergraduate" },
      { time: "7:20 pm – 8:20 pm", start: 1160, title: "Chem-E-Jeopardy Final", track: "Undergraduate" },
      { time: "8:20 pm – 10:00 pm", start: 1220, title: "Welcome Dinner", track: "Undergraduate", note: "Outside the venue" },
    ],
  },
  {
    id: 2,
    label: "Day 2",
    date: "September 1, 2026",
    weekday: "Tuesday",
    items: [
      { time: "8:30 am – 9:00 am", start: 510, title: "Registration & Check-in", track: "Youth" },
      { time: "9:00 am – 9:40 am", start: 540, title: "Fresh vs Experienced Graduate Talk", track: "Youth" },
      { time: "9:45 am – 12:15 pm", start: 585, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth" },
      { time: "12:20 pm – 1:55 pm", start: 740, title: "Youth Poster Competition", track: "Youth" },
      { time: "1:00 pm – 1:15 pm", start: 780, title: "Registration & Check-in", track: "Undergraduate" },
      { time: "2:00 pm – 3:00 pm", start: 840, title: "Technical Workshop", track: "Undergraduate" },
      { time: "2:00 pm – 3:15 pm", start: 840, title: "Chem-E-Car Poster Competition & Safety Inspection", track: "Undergraduate" },
      { time: "3:15 pm – 3:45 pm", start: 915, title: "Poster Set Up & Prayer Break", track: "Undergraduate" },
      { time: "4:00 pm – 7:00 pm", start: 960, title: "Research Poster Competition", track: "Undergraduate" },
      { time: "7:00 pm – 7:30 pm", start: 1140, title: "Prayer Break", track: "Undergraduate" },
      { time: "7:30 pm – 10:00 pm", start: 1170, title: "Career Workshop", track: "Undergraduate" },
    ],
  },
  {
    id: 3,
    label: "Day 3",
    date: "September 2, 2026",
    weekday: "Wednesday",
    items: [
      { time: "8:30 am – 9:00 am", start: 510, title: "Registration & Check-in", track: "Youth" },
      { time: "9:00 am – 9:45 am", start: 540, title: "Women in STEM", track: "Youth" },
      { time: "9:50 am – 11:50 am", start: 590, title: "KFUPM & Chemical Engineering Campus Tour", track: "Youth" },
      { time: "11:50 am – 1:00 pm", start: 710, title: "Students Visit Undergrad Research Posters", track: "Youth" },
      { time: "1:00 pm – 1:15 pm", start: 780, title: "Registration & Check-in", track: "Undergraduate" },
      { time: "1:15 pm – 2:00 pm", start: 795, title: "Award Ceremony & Closing", track: "Youth" },
      { time: "1:20 pm – 2:20 pm", start: 800, title: "Mock Interviews", track: "Undergraduate" },
      { time: "2:25 pm – 5:25 pm", start: 865, title: "Chem-E-Car Competition", track: "Undergraduate" },
      { time: "4:00 pm – 7:00 pm", start: 960, title: "Regional Student Technical Presentation Competition", track: "Undergraduate" },
      { time: "4:30 pm – 6:00 pm", start: 990, title: "International Training Program Talk", track: "Undergraduate" },
      { time: "8:30 pm – 10:00 pm", start: 1230, title: "Award Banquet", track: "Undergraduate" },
    ],
  },
];

export const AGENDA_ALL_DAY: { title: string; days: number[]; time?: string }[] = [
  // The spreadsheet's "All Day Activities" column is per-day, not per-track, so
  // these show on both tracks. A few carry their own time — those are kept here
  // rather than in the main table, with the time shown on the chip.
  { title: "Sponsor Exhibition & Booths", days: [1, 2, 3] },
  { title: "Sponsor Passport", days: [1, 2, 3] },
  { title: "Photobooth", days: [1, 2, 3] },
  { title: "\"Build Your Own Tower\"", days: [1] },
  { title: "Undergrad Site Visits", days: [2], time: "9:00 – 11:00 am" },
  { title: "Presidents Meeting", days: [2], time: "3:00 – 4:30 pm" },
  { title: "Poster Engagement Game", days: [2] },
  { title: "Mini-Experiment Stations (Slime)", days: [2] },
  { title: "Best Moment Captured Competition", days: [3] },
  { title: "Technical Workshop", days: [3] },
  { title: "Activity 2", days: [3], time: "6:30 – 8:00 pm" },
];

// ─── Agenda visibility ────────────────────────────────────────────────────────
// Flip to false to swap the schedule back for the "coming soon" screen —
// nothing else needs to change.
export const AGENDA_LIVE = true;

export function AgendaComingSoon() {
  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes csRing   { 0% { transform: scale(1); opacity:.5; } 100% { transform: scale(1.6); opacity:0; } }
        .cs-ring { animation: csRing 3s ease-out infinite; }
        .cs-ring-2 { animation-delay: 1.5s; }
        @media (prefers-reduced-motion: reduce) {
          .cs-ring { animation: none; }
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

// ─── Day motif ────────────────────────────────────────────────────────────────
// Linear acenes: benzene (one ring), naphthalene (two), anthracene (three).
// Real molecules, and the ring count happens to land on the day number.
const ACENE_R = 27;

function acene(rings: number) {
  const R = ACENE_R;
  const dx = Math.sqrt(3) * R;
  const hexes: string[] = [];
  const centres: number[] = [];
  for (let i = 0; i < rings; i++) {
    const cx = i * dx;
    centres.push(cx);
    hexes.push(
      Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 180) * (30 + 60 * k);
        return `${(cx + R * Math.cos(a)).toFixed(2)},${(R * Math.sin(a)).toFixed(2)}`;
      }).join(" ")
    );
  }
  // Radius swept by the outermost vertex as the molecule spins about its centre.
  // The box has to reserve this much, or the rotation paints over its neighbours.
  const mid = ((rings - 1) * dx) / 2;
  const sweep = Math.hypot(mid + dx / 2, R / 2);
  return { hexes, centres, span: (rings - 1) * dx, sweep };
}

// One square box for every day, sized to the biggest molecule (anthracene) at its
// worst angle. Fixed so switching days doesn't shove the schedule up and down.
const MOL_BOX = Math.ceil(2 * (acene(3).sweep + 3));

/**
 * The day's molecule. Drag it to spin — same trackball idiom as the hero orbit,
 * with momentum on release easing back into a slow idle drift.
 */
function DayMolecule({ rings, tint }: { rings: number; tint: string }) {
  const { hexes, centres, span } = acene(rings);
  const mid = span / 2;
  const gRef = useRef<SVGGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const g = gRef.current;
    const wrap = wrapRef.current;
    if (!g || !wrap) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const IDLE = 0.14; // degrees per frame — slow enough to ignore, alive enough to notice
    let angle = 0, vel = IDLE, held = false, px = 0, raf = 0;

    const frame = () => {
      if (!held) {
        vel += (IDLE - vel) * 0.03; // momentum bleeds back to the idle drift
        angle += vel;
      }
      g.setAttribute("transform", `rotate(${angle.toFixed(2)} ${mid} 0)`);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) g.setAttribute("transform", `rotate(0 ${mid} 0)`);
    else raf = requestAnimationFrame(frame);

    const press = (e: PointerEvent) => {
      held = true; px = e.clientX;
      wrap.setPointerCapture?.(e.pointerId);
      wrap.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!held) return;
      const d = (e.clientX - px) * 0.8;
      px = e.clientX;
      angle += d;
      vel = d * 0.35; // remember the throw
      g.setAttribute("transform", `rotate(${angle.toFixed(2)} ${mid} 0)`);
    };
    const release = () => { held = false; wrap.style.cursor = "grab"; };

    wrap.addEventListener("pointerdown", press);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", release);
    wrap.addEventListener("pointercancel", release);
    wrap.addEventListener("pointerleave", release);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerdown", press);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", release);
      wrap.removeEventListener("pointercancel", release);
      wrap.removeEventListener("pointerleave", release);
    };
  }, [rings, mid]);

  return (
    <div
      ref={wrapRef}
      className="inline-block touch-none select-none"
      style={{ cursor: "grab" }}
      title="Drag to spin"
      aria-hidden
    >
      <svg
        width={MOL_BOX}
        height={MOL_BOX}
        viewBox={`${mid - MOL_BOX / 2} ${-MOL_BOX / 2} ${MOL_BOX} ${MOL_BOX}`}
        style={{ overflow: "hidden", display: "block" }}
      >
        <g ref={gRef}>
          {hexes.map((pts, i) => (
            <polygon key={i} points={pts} fill="none" stroke={tint} strokeWidth={1.6} strokeLinejoin="round" opacity={0.85} />
          ))}
          {centres.map((cx, i) => (
            <circle key={i} cx={cx} cy={0} r={ACENE_R * 0.46} fill="none" stroke={tint} strokeWidth={1.2} opacity={0.45} />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─── Schedule chain ───────────────────────────────────────────────────────────
// The spine down the left of the schedule is drawn as a skeletal formula: a
// zig-zag carbon backbone with one atom per session. Atom positions are measured
// from the rows themselves rather than assumed, so the chain stays locked to its
// sessions whether a row is one line tall on desktop or two stacked on a phone.
const RAIL_W = 64;   // desktop gutter
const RAIL_W_SM = 32; // phone gutter

function ChainRail({
  count, tint, hovered, onHover,
}: {
  count: number;
  tint: string;
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const atomsRef = useRef<(SVGGElement | null)[]>([]);
  const [ys, setYs] = useState<number[]>([]);
  const [h, setH] = useState(0);
  const [w, setW] = useState(RAIL_W);

  // Measure where the rows actually sit. The host is read from the SVG's own
  // parent, not a ref handed down from above: a child's layout effect runs
  // before the parent's ref is attached, so a passed-in ref is still null here.
  // ResizeObserver catches reflow from a rotation, a late webfont, or the
  // breakpoint flipping row layout.
  useLayoutEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return;

    const measure = () => {
      const rows = Array.from(host.querySelectorAll<HTMLElement>(".ag-node"));
      setYs(rows.map((r) => r.offsetTop + r.offsetHeight / 2));
      setH(host.offsetHeight);
      setW(host.clientWidth >= 768 ? RAIL_W : RAIL_W_SM);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(host);
    host.querySelectorAll<HTMLElement>(".ag-node").forEach((r) => ro.observe(r));
    return () => ro.disconnect();
  }, [count]);

  const atomX = (i: number) => (i % 2 ? w * 0.66 : w * 0.34);

  // Pointer magnetism — atoms lean toward the cursor. Mouse only; on a touch
  // screen there is no hover to lean toward and pointermove means a scroll.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !ys.length) return;
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0, mx = -9999, my = -9999;
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };

    const frame = () => {
      atomsRef.current.forEach((g, i) => {
        if (!g || ys[i] == null) return;
        const dx = mx - atomX(i);
        const dy = my - ys[i];
        const d = Math.hypot(dx, dy);
        const pull = d < 110 ? (1 - d / 110) ** 2 * 7 : 0;
        g.style.transform = d
          ? `translate(${((dx / d) * pull).toFixed(2)}px, ${((dy / d) * pull).toFixed(2)}px)`
          : "translate(0px, 0px)";
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const parent = svg.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
    };
  }, [ys, w]);

  // The SVG always renders — it is what the measure step reads the host from.
  // On the very first paint it is empty; the layout effect fills it before the
  // browser draws, so nothing flashes.
  const bonds = ys.map((y, i) => `${i ? "L" : "M"} ${atomX(i).toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const r = w < RAIL_W ? 3.6 : 4.5;

  return (
    <svg
      ref={svgRef}
      width={w}
      height={h}
      className="ag-rail absolute left-0 top-0 pointer-events-none"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {ys.length > 1 && (
        <path d={bonds} fill="none" stroke={`${tint}55`} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      )}
      {ys.map((y, i) => {
        const on = hovered === i;
        return (
          <g
            key={i}
            ref={(el) => { atomsRef.current[i] = el; }}
            style={{ transition: "none", cursor: "pointer", pointerEvents: "auto" }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          >
            <circle cx={atomX(i)} cy={y} r={14} fill="transparent" />
            <circle
              cx={atomX(i)} cy={y} r={on ? r + 2.5 : r}
              fill={on ? tint : "#0A1626"}
              stroke={tint}
              strokeWidth={2}
              style={{ transition: "r .18s ease, fill .18s ease", filter: on ? `drop-shadow(0 0 9px ${tint})` : "none" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function AgendaPage() {
  // The day is held in the URL (`/agenda?day=2`) so a link can open a specific
  // day, and so the address bar matches what is on screen if it gets shared.
  const [params, setParams] = useSearchParams();
  const parsed = Number(params.get("day"));
  const day = AGENDA_DAYS.some((d) => d.id === parsed) ? parsed : 1;
  const setDay = (next: number) => {
    // `replace` so flicking between day tabs does not fill the back button.
    setParams(next === 1 ? {} : { day: String(next) }, { replace: true });
  };
  // Undergraduate is the default: it is the larger track and the conference's
  // primary audience. There is no combined view — the two tracks run in
  // parallel and interleaving them made the day harder to read, not easier.
  const [track, setTrack] = useState<AgendaTrack>("Undergraduate");
  // Shared between the chain and the rows so hovering either lights both.
  const [hovered, setHovered] = useState<number | null>(null);

  const dayData = AGENDA_DAYS.find((d) => d.id === day) || AGENDA_DAYS[0];

  const items = dayData.items
    .filter((i) => i.track === track)
    .slice()
    .sort((a, b) => a.start - b.start);

  const allDay = AGENDA_ALL_DAY.filter((a) => a.days.includes(day));

  // Youth and Undergraduate are the only distinction the schedule draws, so the
  // track colour carries it everywhere — rail, dot and badge.
  const trackTint = (t: AgendaTrack) => (t === "Youth" ? ORANGE : TEAL);
  const tint = trackTint(track);

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
    >
      <style>{`
        @keyframes agSlideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .ag-seg { transition: color .25s ease, background .3s cubic-bezier(.16,.84,.44,1), box-shadow .3s ease; }
        .ag-node {
          animation: agSlideIn .45s cubic-bezier(.16,.84,.44,1) both;
          transition: background .22s ease;
        }
        .ag-node:hover { background: rgba(255,255,255,0.03); }
        .ag-daytitle { animation: agSlideIn .5s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ag-node, .ag-daytitle { animation: none; }
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
          </p>
        </div>

        {/* Track segmented control */}
        <div className="faq-pop flex justify-center mb-4" style={{ animationDelay: "60ms" }}>
          <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl"
            style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${TEAL}22`, backdropFilter: "blur(12px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            {(["Youth", "Undergraduate"] as const).map((t) => {
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
                  {t}
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
          <div className="flex justify-center mt-1">
            <DayMolecule rings={day} tint={tint} />
          </div>
        </div>

        {/* Schedule — a skeletal-formula chain, one atom per session */}
        <div className="faq-pop rounded-2xl border px-5 md:px-7 py-6 md:py-8" style={{
          animationDelay: "180ms",
          borderColor: "rgba(255,255,255,0.09)",
          background: "rgba(7,17,30,0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
        }}>
          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No sessions listed for this track on this day.
            </div>
          ) : (
            <div className="relative" key={`${day}-${track}`}>
              <ChainRail count={items.length} tint={tint} hovered={hovered} onHover={setHovered} />

              {items.map((it, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="ag-node md:h-[78px] flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-3.5 md:py-0 md:pl-[86px] pl-[42px]"
                  style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
                >
                  <div
                    className="text-sm font-mono tracking-tight md:w-[150px] flex-shrink-0 transition-colors duration-200"
                    style={{ color: hovered === i ? tint : "rgba(255,255,255,0.72)" }}
                  >
                    {it.time}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base md:text-lg text-white leading-snug">
                      {it.title}
                      {it.note && (
                        <span className="ml-2 text-xs font-normal font-mono text-muted-foreground align-middle">
                          {it.note}
                        </span>
                      )}
                    </h3>
                    {it.speakers && (
                      <p className="text-sm leading-relaxed mt-0.5" style={{ color: TEAL }}>{it.speakers}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-7 pt-5 text-center text-[11px] font-mono tracking-[0.2em] uppercase"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", color: "var(--muted-foreground)" }}>
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
                  const col = ORANGE;
                  return (
                    <span key={a.title}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-white"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${col}33` }}>
                      {a.title}
                      {a.time && (
                        <span className="text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                          {a.time}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
}

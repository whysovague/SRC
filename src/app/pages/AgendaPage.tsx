import { useState } from "react";
import { Calendar, Clock, Layers, MapPin, Trophy, Zap } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, ComingSoonBadge, GlassCard, MoleculeNetwork } from "@/app/components/common";

export type AgendaTrack = "Youth" | "Undergraduate";
export type AgendaCat =
  | "Main Session"
  | "Competition"
  | "Workshop"
  | "Interactive"
  | "Networking"
  | "Logistics"
  | "Unclassified";

// Note: "Unclassified" is deliberately NOT in this array — it drives the filter
// chips and the legend, and un-colour-coded sessions shouldn't appear in either.
export const AGENDA_CATS: AgendaCat[] = [
  "Main Session",
  "Competition",
  "Workshop",
  "Interactive",
  "Networking",
  "Logistics",
];

export const AGENDA_CAT_COLOR: Record<AgendaCat, string> = {
  "Main Session": "#A78BFA",
  Competition: "#F2C744",
  Workshop: "#F08A7E",
  Interactive: "#66C95B",
  Networking: "#2FB3F0",
  Logistics: "#8FA3B8",
  Unclassified: "#6B7688",
};

export const AGENDA_CAT_LABEL: Record<AgendaCat, string> = {
  "Main Session": "Main Session",
  Competition: "Competition",
  Workshop: "Workshop",
  Interactive: "Interactive",
  Networking: "Networking",
  Logistics: "Logistics",
  Unclassified: "Unclassified",
};

export type AgendaItem = {
  time: string;
  start: number; // minutes from midnight — drives chronological sorting
  title: string;
  track: AgendaTrack;
  cat: AgendaCat;
  speakers?: string;
  note?: string;
};

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

export const AGENDA_ALL_DAY: { title: string; cat: AgendaCat; days: number[]; track?: AgendaTrack }[] = [
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
export const AGENDA_LIVE = false;

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

export function AgendaPage() {
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
        @keyframes agSlideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .ag-seg { transition: color .25s ease, background .3s cubic-bezier(.16,.84,.44,1), box-shadow .3s ease; }
        .ag-row { animation: agSlideIn .45s cubic-bezier(.16,.84,.44,1) both; transition: background .25s ease, padding-left .25s ease; }
        .ag-row:hover { background: rgba(12,191,206,0.07); padding-left: 26px; }
        .ag-row-alt { background: rgba(255,255,255,0.016); }
        .ag-daytitle { animation: agSlideIn .5s cubic-bezier(.16,.84,.44,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ag-row, .ag-daytitle { animation: none; }
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

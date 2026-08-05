import { Fragment, useEffect, useState } from "react";

import { TEAL, ORANGE } from "@/app/theme";

// ─── Countdown to Day 1 (ticks every second) ─────────────────────────────────
const EVENT_START = new Date("2026-08-31T08:30:00+03:00").getTime(); // Day 1, 8:30 AM AST

// Split-flap digit pair — flips like a volleyball scoreboard when the value changes
export function FlipUnit({ value }: { value: number }) {
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

export function CountdownTimer() {
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

import { useState, useEffect, useRef } from "react";
import { Calendar, Star } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { SectionTitle, Divider, GradientEyebrow, InteractiveCard } from "@/app/components/common";

export function TimelineSection() {
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
      date: "10/8/2026",
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

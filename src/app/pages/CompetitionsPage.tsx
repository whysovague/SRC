import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, FlaskConical, Lightbulb, MessageSquare, Network, Presentation, Trophy, Wrench, Zap } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import type { Competition } from "@/app/types";
import { Divider, GradientEyebrow, RevealOnScroll, InteractiveCard, MoleculeNetwork } from "@/app/components/common";

export function CompetitionsPage({ onParticipate }: { onParticipate: (competition: Competition) => void }) {
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

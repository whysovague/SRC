import { useState } from "react";
import { ArrowRight, CheckCircle, ChevronDown, HelpCircle } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, CTAButton, InteractiveCard, MoleculeNetwork } from "@/app/components/common";

export function FAQPage({ goToContactForm }: { goToContactForm: () => void }) {
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

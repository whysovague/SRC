import { useRef } from "react";
import { ArrowRight, Award, Building2, Calendar, ChevronRight, Eye, Globe, Heart, Lightbulb, MapPin, Star, Target, Zap } from "lucide-react";

import { TEAL, ORANGE, PALETTE_BLUE, PALETTE_ORANGE } from "@/app/theme";
import type { Section } from "@/app/types";
import { Divider, GradientEyebrow, CTAButton, RevealOnScroll, InteractiveCard, MoleculeNetwork, CountUp } from "@/app/components/common";
import { HeroLogo } from "@/app/components/hero/HeroLogo";
import { CountdownTimer } from "@/app/components/hero/CountdownTimer";
import { TimelineSection } from "./TimelineSection";
import kfupmLogoImg from "@/assets/Full Stacked - negative.png";
import aicheLogoImg from "@/assets/aichelogo.png";

// ─── Home Page ────────────────────────────────────────────────────────────────
export function HomePage({ setSection, onRegisterClick }: { setSection: (s: Section) => void; onRegisterClick: () => void }) {
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const stats: { to: number; suffix: string; label: string }[] = [
    { to: 1200, suffix: "+", label: "Expected Participants" },
    { to: 14,   suffix: "+", label: "Universities" },
    { to: 7,    suffix: "+", label: "Countries" },
    { to: 25,   suffix: "+", label: "Activities & Events" },
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

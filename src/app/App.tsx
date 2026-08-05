import { useState, useEffect, useRef } from "react";
import {
  X, ChevronDown, ChevronRight, ArrowRight, MapPin, Calendar,
  Users, Trophy, Mic2, Building2, Mail, Phone, ExternalLink, Download,
  Star, Award, Zap, Globe, BookOpen, Layers, Heart, Target, Eye,
  CheckCircle, Clock, Instagram, Twitter, Linkedin, Youtube,
  FlaskConical, Presentation, FileText, Lightbulb, Network, Wrench,
  MessageSquare, HelpCircle, ChevronUp
} from "lucide-react";
import { TEAL, ORANGE, PALETTE_BLUE, PALETTE_ORANGE } from "./theme";
import type { Section, RegType, Competition } from "./types";
import {
  SectionTag, SectionTitle, Divider, GradientEyebrow, ComingSoonBadge,
  CTAButton, RevealOnScroll, InteractiveCard, GlassCard,
  MoleculeNetwork, Marquee, CountUp,
} from "./components/common";
import { AboutPage } from "./pages/AboutPage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { TeamsPage } from "./pages/TeamsPage";
import { PartnershipPage } from "./pages/PartnershipPage";
import { OrganizingPage } from "./pages/OrganizingPage";
import { MediaPage } from "./pages/MediaPage";
import { RegistrationModal } from "./components/registration/RegistrationModal";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HelpButton } from "./components/layout/HelpButton";
import { HeroLogo } from "./components/hero/HeroLogo";
import { CountdownTimer } from "./components/hero/CountdownTimer";
import { submitRegistration } from "./lib/firebase";
import { findUserByEmail, createUserIfNotExists, type AppUser } from "./lib/users";
import kfupmLogoImg from "@/assets/kfupm-logo-png_seeklogo-643173.png";
import aicheLogoImg from "@/assets/aichelogo.png";

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
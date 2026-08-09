import { useState } from "react";
import { ArrowRight, Heart, Mail, Network, Star, Users, X, CheckCircle, Globe, Building2, Linkedin, Instagram, Twitter } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, CTAButton, InteractiveCard, MoleculeNetwork, RevealOnScroll } from "@/app/components/common";

export function PartnershipPage({ goToContactForm }: { goToContactForm: () => void }) {

  return (
    <div className="relative overflow-hidden pt-24 pb-28">
      <style>{`
        @keyframes leadScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .lead-track {
          display: flex; width: max-content; gap: 20px;
          animation: leadScroll 30s linear infinite;
          will-change: transform;
        }
        .lead-track:hover { animation-play-state: paused; }
        @keyframes serviceScroll {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .service-track {
          display: flex; width: max-content; gap: 20px;
          animation: serviceScroll 28s linear infinite;
          will-change: transform;
        }
        .service-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Background */}
      <MoleculeNetwork />
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        backgroundImage: `linear-gradient(rgba(12,191,206,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12,191,206,0.035) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
      }} />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="mb-7"><GradientEyebrow>Grow Together</GradientEyebrow></div>
        <h2 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-white">SRC</span>
          <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Partners
          </span>
        </h2>
        <Divider />

        

        {/* ── Why Partner ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mb-20">
          {[
            { icon: <Users className="w-5 h-5" />, title: "Talent Access", color: TEAL, text: "1,000+ top ChE students from GCC's leading universities." },
            { icon: <Star className="w-5 h-5" />, title: "Brand Visibility", color: ORANGE, text: "Prominent placement across all conference materials." },
            { icon: <Heart className="w-5 h-5" />, title: "CSR Impact", color: TEAL, text: "Invest in STEM education and the region's next generation." },
            { icon: <Network className="w-5 h-5" />, title: "Industry Leadership", color: ORANGE, text: "Shape the engineering landscape of the GCC." },
          ].map((item, i) => (
            <RevealOnScroll key={item.title} delay={i * 80}>
              <InteractiveCard
                accent={item.color}
                className="rounded-2xl p-6 overflow-hidden h-full"
                style={{ background: "rgba(13,30,48,0.6)", border: `1px solid ${item.color}30` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${item.color}18`, color: item.color }}>
                  {item.icon}
                </div>
                <span className="font-display text-base font-bold text-white block mb-2">{item.title}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </InteractiveCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* ── CTA ── */}
        <RevealOnScroll delay={0}>
          <div className="pt-6 text-center">
            <h3 className="font-display text-2xl font-bold text-white mb-2">Ready to Partner with SRC 2026?</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Join us and be part of the first AIChE Student Regional Conference in the GCC.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CTAButton primary onClick={goToContactForm}>
                Apply to Become a Sponsor <ArrowRight className="w-4 h-4" />
              </CTAButton>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
}
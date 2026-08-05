import { ArrowRight, Heart, Mail, Network, Star, Users } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, CTAButton, InteractiveCard, MoleculeNetwork } from "@/app/components/common";

export function PartnershipPage() {
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

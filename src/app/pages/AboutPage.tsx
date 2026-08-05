import { Award, Building2, Eye, Globe, Heart, Lightbulb, Star, Target, Zap } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { SectionTag, SectionTitle, Divider } from "@/app/components/common";

// TODO DELETE ABOUT PAGE
// ─── About Page ───────────────────────────────────────────────────────────────
export function AboutPage() {
  const values = [
    { icon: <Star className="w-5 h-5" />, title: "Excellence", desc: "Upholding the highest standards in engineering education and competition." },
    { icon: <Globe className="w-5 h-5" />, title: "Collaboration", desc: "Bridging students, faculty, and industry across borders." },
    { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation", desc: "Driving creative solutions to the challenges of our time." },
    { icon: <Heart className="w-5 h-5" />, title: "Community", desc: "Building a lasting AIChE network in the GCC region." },
    { icon: <Award className="w-5 h-5" />, title: "Leadership", desc: "Developing the next generation of chemical engineering leaders." },
    { icon: <Target className="w-5 h-5" />, title: "Impact", desc: "Creating tangible outcomes for students, industry, and society." },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <SectionTag>About SRC 2026</SectionTag>
          <SectionTitle>What is SRC?</SectionTitle>
          <Divider />
          <div className="grid md:grid-cols-2 gap-12 mt-8">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                The <span className="text-white font-semibold">Student Regional Conference (SRC)</span> is an AIChE flagship event that gathers undergraduate chemical engineering students from universities across a geographic region for competitions, technical presentations, workshops, and professional development.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                SRC 2026 at KFUPM marks a historic milestone it is the <span style={{ color: TEAL }} className="font-semibold">first time this conference is held in the Gulf Cooperation Council (GCC)</span>, bringing the AIChE tradition of academic excellence to the heart of the Arab world's energy and engineering hub.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hosted by King Fahd University of Petroleum & Minerals (KFUPM) in Dhahran, Saudi Arabia, this conference will attract students, faculty advisors, and industry professionals from across the GCC and the broader Middle East region.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Why SRC Matters", icon: <Zap />, text: "SRC creates a platform where students sharpen technical skills, compete at a high level, and build professional networks that last a career. It bridges academic learning with real-world engineering challenges." },
                { title: "Why KFUPM?", icon: <Building2 />, text: "KFUPM is the premier engineering and science university in the GCC, located at the epicenter of the global energy industry. Its world-class facilities, faculty, and industry connections make it the ideal host for a landmark event." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: TEAL }}>{item.icon}</span>
                    <h4 className="font-display font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { label: "Mission", icon: <Target />, text: "To provide an exceptional platform that empowers chemical engineering students across the GCC to showcase their talents, engage with industry, and develop as global engineering leaders while establishing a sustainable regional AIChE tradition.", color: TEAL },
            { label: "Vision", icon: <Eye />, text: "To be the premier student engineering conference in the Middle East, recognized for its academic rigor, cultural richness, and its role in shaping the next generation of engineers who will drive the region's industrial transformation.", color: ORANGE },
          ].map((mv) => (
            <div key={mv.label} className="rounded-xl p-8 border" style={{ background: "var(--card)", borderColor: `${mv.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${mv.color}15`, color: mv.color }}>
                  {mv.icon}
                </div>
                <span className="font-display text-2xl font-extrabold text-white">{mv.label}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{mv.text}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <SectionTag>Our Values</SectionTag>
          <SectionTitle>What We Stand For</SectionTitle>
          <Divider />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg p-5 border hover:border-[#0CBFCE]/30 transition-colors group" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: TEAL }} className="group-hover:scale-110 transition-transform">{v.icon}</span>
                  <h4 className="font-semibold text-white">{v.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Competitions Page ────────────────────────────────────────────────────────

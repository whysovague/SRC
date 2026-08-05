import { Award, Star, Target, Users } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { SectionTag, SectionTitle, Divider, GradientEyebrow, ComingSoonBadge, RevealOnScroll, MoleculeNetwork, Marquee } from "@/app/components/common";

export function OrganizingPage() {
  const leadership = [
    { title: "Conference Advisor", name: "Dr. Basim Abussaud", note: "Faculty oversight and strategic guidance", icon: <Star className="w-6 h-6" />, color: TEAL },
    { title: "Conference Chair", name: "Faisal Alasmari", note: "Overall leadership and direction", icon: <Award className="w-7 h-7" />, color: ORANGE, featured: true },
    { title: "Conference General Coordinator", name: "Faisal Alharthi", note: "Operational coordination", icon: <Target className="w-6 h-6" />, color: TEAL },
  ];

  const committees: { title: string; members: { name: string; role?: string }[] }[] = [
    {
      title: "Heads of Committees",
      members: [
        { name: "Fatimah Almahfoudh", role: "Outreach Head" },
        { name: "Manar Alahmed", role: "Logistics & Operation Day Head" },
        { name: "Ashraf Almallahi", role: "Technical Program Head" },
        { name: "Mohammed Al-Ghadeeb", role: "Marketing Head" },
        { name: "Reema Aldkheli", role: "Sponsorship Head" },
        { name: "Mesk Almutairi", role: "Financial Officer" },
        { name: "Zainab AlMutawa", role: "Technical Sessions Leader" },
        { name: "Saba Aljohani", role: "Web Development Leader" },
        { name: "Zainab Alkhater", role: "Physical Marketing Leader" },
        { name: "Dali Alanzi", role: "Social Media Leader" },
        { name: "Alaa Alsadiq", role: "Design Leader" },
        { name: "Mohammed Almahasnah", role: "Sr. Consultant" },
        { name: "Fatimah Almakinah", role: "Sr. Consultant" },
        { name: "Zainab Aldukhi", role: "Consultant" },
        { name: "Ahmad Albalawi", role: "Consultant" },
        { name: "Alaa Alsaad", role: "Marketing Consultant" },
        { name: "Asseel Alzahrani", role: "Sponsorship Consultant" },
        { name: "Abdullah Alomar", role: "Technical Program Consultant" },
        { name: "Meshal Alrefaei", role: "Sponsorship Consultant" },
      ],
    },
    { title: "Sponsorships Committee", members: [] },
    { title: "Outreach Committee", members: [] },
    { title: "Logistics Committee", members: [] },
    { title: "Activities and Engagement Subcommittee", members: [] },
    { title: "Competitions Subcommittee", members: [] },
    { title: "Web Development Subcommittee", members: [] },
    { title: "Physical Marketing Subcommittee", members: [] },
    { title: "Social Media Subcommittee", members: [] },
    { title: "Design Subcommittee", members: [] },
  ];

  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <MoleculeNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionTag>The Team Behind SRC</SectionTag>
        <SectionTitle>Organizing Committee</SectionTitle>
        <Divider />

        {/* ─── Hero: photo + intro text ─── */}
        <RevealOnScroll>
          <div className="grid md:grid-cols-12 gap-10 items-center mb-20 mt-4">
            <div className="md:col-span-5 flex justify-center">
              {/* "Photograph" placeholder — white mat, slight tilt, like a printed photo */}
              <div
                className="bg-white rounded-sm p-3 pb-9 shadow-2xl rotate-[-1.5deg] w-full max-w-sm"
              >
                <div className="aspect-[4/3] rounded-sm overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Users className="w-16 h-16 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl">
                SRC 2026 is organized by a dedicated team of KFUPM students under faculty and professional guidance. Full team profiles will be published soon.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* ─── Leadership ─── */}
        <div className="mb-20">
          <RevealOnScroll>
            <div className="mb-7"><GradientEyebrow>Leadership</GradientEyebrow></div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 items-end">
            {leadership.map((person, i) => (
              <RevealOnScroll key={person.title} delay={i * 120}>
                <div
                  className={`rounded-2xl border p-6 text-center ${person.featured ? "sm:scale-105" : ""}`}
                  style={{
                    background: person.featured ? `${person.color}0d` : "rgba(13,30,48,0.55)",
                    borderColor: `${person.color}40`,
                  }}
                >
                  {/* Small photo placeholder per person */}
                  <div className="bg-white rounded-sm p-2 pb-5 shadow-lg mx-auto mb-4 w-28">
                    <div
                      className="aspect-square rounded-sm flex items-center justify-center"
                      style={{ background: `${person.color}1a`, color: person.color }}
                    >
                      {person.icon}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-white text-base mb-1">{person.title}</h4>
                  <p className="text-sm text-white/90 mb-1">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.note}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* ─── Committees — each with a horizontal scrolling member strip ─── */}
        <div className="mb-12">
          <RevealOnScroll>
            <div className="mb-7"><GradientEyebrow>Committees</GradientEyebrow></div>
          </RevealOnScroll>

          <div className="space-y-14">
            {committees.map((committee, i) => (
              <RevealOnScroll key={committee.title}>
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display font-black text-sm"
                      style={{ background: `${TEAL}15`, color: TEAL }}
                    >
                      {committee.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{committee.title}</p>
                    </div>
                  </div>

                  <Marquee reverse={i % 2 === 1} speed={40}>
                    {(committee.members.length > 0
                      ? committee.members
                      : Array.from({ length: 6 }).map(() => null)
                    ).map((m, j) => (
                      <div
                        key={j}
                        className="w-40 shrink-0 rounded-xl p-4 flex flex-col items-center text-center"
                        style={{ background: "rgba(13,30,48,0.5)", border: `1px solid ${TEAL}22` }}
                      >
                        <div
                          className="w-14 h-14 rounded-full mb-3 flex items-center justify-center"
                          style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}30`, color: `${TEAL}99` }}
                        >
                          <Users className="w-5 h-5" />
                        </div>
                        {m ? (
                          <>
                            <p className="text-white text-xs font-semibold leading-tight mb-1">{m.name}</p>
                            {m.role && (
                              <p className="text-[10px] text-muted-foreground leading-tight">{m.role}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-16 rounded-full mb-2" style={{ background: `${TEAL}22` }} />
                            <div className="h-2 w-10 rounded-full" style={{ background: `${TEAL}15` }} />
                          </>
                        )}
                      </div>
                    ))}
                  </Marquee>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll>
  <div className="text-center">
    <ComingSoonBadge />
    <p className="text-muted-foreground text-sm mt-4">Individual team member profiles and photos will be published here soon.</p>
  </div>
</RevealOnScroll>
      </div>
    </div>
  );
}
// ─── Media Center ─────────────────────────────────────────────────────────────

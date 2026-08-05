import { Mail } from "lucide-react";

import { TEAL } from "@/app/theme";
import { SectionTag, SectionTitle, Divider, ComingSoonBadge } from "@/app/components/common";

// ─── Teams & Delegations ──────────────────────────────────────────────────────
export function TeamsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Delegations</SectionTag>
        <SectionTitle>Teams & Universities</SectionTitle>
        <Divider />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              SRC 2026 welcomes competing teams and delegations from universities across Saudi Arabia, the GCC, and the broader region. International teams are warmly invited.
            </p>
            <div className="space-y-4">
              {[
                { title: "Eligibility", text: "Undergraduate chemical engineering (or related) students at accredited universities with an active AIChE student chapter." },
                { title: "Team Composition", text: "Team sizes vary by competition. Chem-E-Car: 2-10 members. ChemE Jeopardy: 3-4 members. Technical Presentation: individual. Poster: 1-3 authors." },
                { title: "International Teams", text: "Teams from outside Saudi Arabia are welcome. Travel support information will be provided upon registration. KFUPM has accommodation partnerships for visiting delegations." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6">Participating Teams</h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="p-8 text-center">
                <ComingSoonBadge />
                <p className="text-muted-foreground text-sm mt-4">Registered teams and universities will be listed here once registration opens.</p>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8 mb-4">Team Coordinator Contact</h3>
            <div className="rounded-lg p-5 border" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
              <p className="text-sm text-muted-foreground mb-3">For team registration questions, guidelines, and coordination:</p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="w-4 h-4" style={{ color: TEAL }} />
                teams.src2026@kfupm.edu.sa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Partnership Page ─────────────────────────────────────────────────────────

import { Building2, Clock, Heart, Mail, Mic2, Trophy, Users } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import { SectionTag, SectionTitle, Divider } from "@/app/components/common";

// ─── Registration Page ────────────────────────────────────────────────────────
export function RegistrationPage() {
  const tracks = [
    { icon: <Users className="w-6 h-6" />, title: "Participant Registration", desc: "Register as an individual attendee to access all sessions, workshops, panels, and networking events.", badge: "Open Soon", color: TEAL },
    { icon: <Trophy className="w-6 h-6" />, title: "Competing Team Registration", desc: "Register your university team for Chem-E-Car, ChemE Jeopardy, Technical Presentation, or Poster Competition.", badge: "Open Soon", color: ORANGE },
    { icon: <Heart className="w-6 h-6" />, title: "Volunteer Interest Form", desc: "Join the SRC 2026 volunteer team and be part of making this historic conference a success.", badge: "Coming Soon", color: TEAL },
    { icon: <Mic2 className="w-6 h-6" />, title: "Speaker / Judge / Mentor", desc: "Share your expertise as a speaker, competition judge, or career mentor at SRC 2026.", badge: "Coming Soon", color: ORANGE },
    { icon: <Building2 className="w-6 h-6" />, title: "Partner Interest Form", desc: "Explore partnership and sponsorship opportunities to connect your organization with the next generation of engineers.", badge: "Coming Soon", color: TEAL },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTag>Join SRC 2026</SectionTag>
        <SectionTitle>Registration</SectionTitle>
        <Divider />
        <p className="text-muted-foreground max-w-2xl mb-12 text-lg leading-relaxed">
          Multiple pathways to participate in SRC 2026. Choose the track that fits your role.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div key={track.title} className="rounded-xl border p-6 flex flex-col group hover:border-[#0CBFCE]/40 transition-all duration-200" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ background: `${track.color}15`, color: track.color }}>
                {track.icon}
              </div>
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="font-display font-bold text-white text-base leading-tight">{track.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{track.desc}</p>
              <button
                className="w-full py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 border transition-all"
                style={{ borderColor: `${track.color}40`, color: track.color }}
                disabled
              >
                <Clock className="w-4 h-4" /> {track.badge}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}25` }}>
          <h3 className="font-display text-2xl font-bold text-white mb-3">Stay Updated</h3>
          <p className="text-muted-foreground mb-6">Registration forms will open soon. Contact us to be notified when registration opens.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" style={{ color: TEAL }} />
              <span>src2026@kfupm.edu.sa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Timeline Section (Important Dates) ─────────────────────────────────────

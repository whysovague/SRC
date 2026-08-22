import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, FileText, FlaskConical, Loader2, Lock, Medal, MessageSquare, Presentation, Sparkles, Trophy, Users, Wrench, X } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import type { Competition } from "@/app/types";
import type { AppUser } from "@/app/lib/users";
import { getSignedUpSet, saveActivitySignup, MAX_QUESTION_CHARS, type ActivityId } from "@/app/lib/activities";
import { Divider, GradientEyebrow, RevealOnScroll, InteractiveCard, MoleculeNetwork } from "@/app/components/common";

export function CompetitionsPage({ onParticipate, user }: {
  onParticipate: (competition: Competition, notice?: string) => void;
  user: AppUser | null;
}) {
  const competitions: {
    icon: React.ReactNode; title: string; category: "Competition" | "Activity";
    /** Both optional — a session whose copy hasn't been written yet shows the
     *  title, its slot and the button, and nothing invented to fill the space. */
    desc?: string; details?: string[];
    color: string; compId?: Competition; comingSoon?: boolean;
    /** Small line under the title — eligibility, or the day and time. */
    note?: string;
    /** Set on the sessions people can sign up for once they hold a conference
     *  registration. Conference registration itself stays in the main modal. */
    activityId?: ActivityId;
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
      icon: <Medal className="w-7 h-7" />,
      title: "SRC Science Olympiad",
      category: "Competition",
      desc: "The SRC Science Olympiad is an interactive Kahoot-style competition that brings together high school students and KFUPM university students to form mixed teams. Working together, they will solve exciting science, engineering, and critical-thinking questions in a fun and competitive environment, encouraging collaboration, mentorship, and knowledge sharing.",
      details: ["Mixed high school & university teams", "Live Kahoot-style rounds", "Science, engineering & critical thinking"],
      color: TEAL,
      comingSoon: true,
      note: "Sophomore & Junior",
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: "Workshops",
      category: "Activity",
      desc: "Practical, skills-based sessions led by industry experts and faculty. Topics range from process safety to digital engineering tools and AI in chemical engineering.",
      details: ["Industry-led sessions", "Hands-on learning", "Multiple tracks"],
      color: ORANGE,
      comingSoon: true,
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Intro to ChE",
      category: "Activity",
      color: TEAL,
      note: "Day 1 · 9:35 – 10:05 am",
      activityId: "intro-to-che",
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Fresh vs Experienced",
      category: "Activity",
      color: ORANGE,
      note: "Day 2 · 9:00 – 9:40 am",
      activityId: "fresh-vs-experienced",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Women in STEM",
      category: "Activity",
      desc: "An inspiring panel featuring successful women in Science, Technology, Engineering, and Mathematics who will share their academic and professional journeys, discuss challenges and opportunities, and encourage young women to pursue STEM careers. The session aims to empower participants through personal stories, practical advice, and interactive discussion.",
      details: ["Panel of women working in STEM", "Academic & professional journeys", "Personal stories & interactive discussion"],
      color: ORANGE,
      note: "Day 3 · 9:00 – 9:45 am",
      activityId: "women-in-stem",
    },
  ];

  const [filter, setFilter] = useState<"All" | "Competition" | "Activity">("All");
  const filtered = competitions.filter((c) => filter === "All" || c.category === filter);

  // ─── Activity sign-ups ──────────────────────────────────────────────────
  // Which of this person's sign-ups already exist, so a card can show
  // "Registered" instead of inviting them to do it twice.
  const [signedUp, setSignedUp] = useState<Set<ActivityId>>(new Set());
  const [dialog, setDialog] = useState<{ id: ActivityId; title: string; color: string } | null>(null);

  const activityIds = competitions
    .map((c) => c.activityId)
    .filter((id): id is ActivityId => Boolean(id));
  const activityKey = activityIds.join(",");

  useEffect(() => {
    if (!user?.email) { setSignedUp(new Set()); return; }
    let cancelled = false;
    getSignedUpSet(user.email, activityIds).then((set) => {
      if (!cancelled) setSignedUp(set);
    });
    return () => { cancelled = true; };
    // activityIds is rebuilt each render; compare it by value, not identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, activityKey]);

  const REGISTER_FIRST_NOTICE =
    "You need a conference registration before you can sign up for individual activities. Register below, or log in if you already have.";

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
                    <div className="flex items-center gap-2">
                      {item.compId && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: "#ff8a8a", background: "rgba(255,138,138,0.1)", border: "1px solid rgba(255,138,138,0.3)" }}>
                          Closed
                        </span>
                      )}
                      {item.comingSoon && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: "#f5c451", background: "rgba(245,196,81,0.1)", border: "1px solid rgba(245,196,81,0.3)" }}>
                          Coming Soon
                        </span>
                      )}
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: item.color === TEAL ? TEAL : ORANGE, background: `${item.color}12`, border: `1px solid ${item.color}30` }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{item.title}</h3>
                  {item.note && (
                    <div className="mb-2">
                      <span
                        className="inline-block text-[11px] font-mono tracking-wide px-2 py-0.5 rounded-md"
                        style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}30` }}
                      >
                        {item.note}
                      </span>
                    </div>
                  )}
                  {item.desc && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                  )}
                  {item.details && item.details.length > 0 && (
                    <ul className="space-y-1 mb-5">
                      {item.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: item.color }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Register / Participate → opens the registration & login modal,
                      preselecting this competition when the card is one */}
                  <div className="mt-auto pt-1">
                    {item.compId ? (
                      <div
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed"
                        style={{
                          color: "var(--muted-foreground)",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Lock className="w-4 h-4" /> Registration Closed
                      </div>
                    ) : item.comingSoon ? (
                      <div
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed"
                        style={{
                          color: "var(--muted-foreground)",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Lock className="w-4 h-4" /> Coming Soon
                      </div>
                    ) : item.activityId && signedUp.has(item.activityId) ? (
                      // Already signed up — say so rather than inviting a repeat.
                      <div
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                        style={{
                          color: item.color,
                          background: `${item.color}1A`,
                          border: `1px solid ${item.color}55`,
                        }}
                      >
                        <CheckCircle className="w-4 h-4" /> Registered
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          // Signing up for a session assumes a conference
                          // registration. Without one, send them there first.
                          if (item.activityId) {
                            if (!user) { onParticipate(null, REGISTER_FIRST_NOTICE); return; }
                            setDialog({ id: item.activityId, title: item.title, color: item.color });
                            return;
                          }
                          onParticipate(item.compId ?? null);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          color: item.color,
                          background: `${item.color}12`,
                          border: `1px solid ${item.color}35`,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${item.color}22`; e.currentTarget.style.borderColor = `${item.color}70`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = `${item.color}12`; e.currentTarget.style.borderColor = `${item.color}35`; }}
                      >
                        Register <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </InteractiveCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {dialog && user && (
        <ActivitySignupDialog
          activityId={dialog.id}
          title={dialog.title}
          color={dialog.color}
          user={user}
          onClose={() => setDialog(null)}
          onDone={(id) => {
            setSignedUp((prev) => new Set(prev).add(id));
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Sign-up dialog for a single session. The person is already registered for the
 * conference, so nothing personal is asked for — only an optional question for
 * the speakers.
 */
function ActivitySignupDialog({ activityId, title, color, user, onClose, onDone }: {
  activityId: ActivityId;
  title: string;
  color: string;
  user: AppUser;
  onClose: () => void;
  onDone: (id: ActivityId) => void;
}) {
  const [question, setQuestion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Escape closes; body scroll stays locked while it is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, saving]);

  const confirm = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveActivitySignup({
        email: user.email,
        fullName: user.fullName,
        activityId,
        question,
      });
      onDone(activityId);
    } catch (e: any) {
      console.error("Activity sign-up failed:", e);
      setError(e?.message || "Could not save your sign-up. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(4,10,18,0.72)", backdropFilter: "blur(6px)" }}
      onClick={() => { if (!saving) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Sign up for ${title}`}
        className="w-full max-w-md rounded-2xl border p-6"
        style={{
          background: "rgba(7,17,30,0.97)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase mb-1" style={{ color }}>
              Sign up
            </div>
            <h3 className="font-display font-bold text-xl text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted-foreground)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-3 mb-5">
          You're signed in as <span className="text-white">{user.fullName || user.email}</span>.
        </p>

        <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          A question for the speakers <span className="font-normal">— optional</span>
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_CHARS))}
          rows={3}
          disabled={saving}
          className="w-full rounded-lg px-3 py-2.5 text-sm text-white resize-none outline-none transition-colors disabled:opacity-60"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
        <div className="text-[11px] font-mono mt-1 text-right" style={{ color: "var(--muted-foreground)" }}>
          {question.length}/{MAX_QUESTION_CHARS}
        </div>

        {error && <p className="text-xs mt-3" style={{ color: "#ff8a8a" }}>{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-xs text-muted-foreground hover:text-white transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60"
            style={{ color, background: `${color}18`, border: `1px solid ${color}45` }}
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <>Confirm <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

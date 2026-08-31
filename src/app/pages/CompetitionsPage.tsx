import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, CheckCircle, FileText, FlaskConical, Loader2, Lock, Medal, MessageSquare, Presentation, Sparkles, Trophy, Users, Wrench, X } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import type { Competition } from "@/app/types";
import type { AppUser } from "@/app/lib/users";
import { getSignedUpSet, saveActivitySignup, MAX_QUESTION_CHARS, type ActivityId } from "@/app/lib/activities";
import { saveWorkshopSignup, isValidEmail, MAX_NAME_CHARS, WORKSHOP_SESSIONS, type WorkshopId } from "@/app/lib/workshops";
import { Divider, GradientEyebrow, RevealOnScroll, InteractiveCard, MoleculeNetwork } from "@/app/components/common";
import tabaqatPoster from "@/assets/tabaqat-workshop.jpg";

export function CompetitionsPage({ onParticipate, user }: {
  onParticipate: (competition: Competition, notice?: string) => void;
  user: AppUser | null;
}) {
  const competitions: {
    icon: React.ReactNode; title: string; category: "Competition" | "Activity" | "Workshop";
    /** Both optional — a session whose copy hasn't been written yet shows the
     *  title, its slot and the button, and nothing invented to fill the space. */
    desc?: string; details?: string[];
    color: string; compId?: Competition; comingSoon?: boolean;
    /** Small line under the title — eligibility, or the day and time. */
    note?: string;
    /** Set on the sessions people can sign up for once they hold a conference
     *  registration. Conference registration itself stays in the main modal. */
    activityId?: ActivityId;
    /** Informational card — renders no action control at all: no Register
     *  button, no "Registered" pill, no disabled placeholder. For sessions
     *  anyone can simply turn up to, where a button would only imply a step
     *  that does not exist. `activityId` is kept on these so the sign-up flow
     *  can be switched back on by deleting this one line. */
    noAction?: boolean;
    /** Workshops take their own registration — name and email, no conference
     *  registration or login required, so anyone can sign up straight from the
     *  card. Stored in `workshopSignups`, counted on the export page. */
    workshopId?: WorkshopId;
    /** Poster shown across the top of the card. Import it from `@/assets` so
     *  Vite fingerprints and bundles it — a bare "/foo.png" string would skip
     *  that and 404 on any path that is not the site root. */
    image?: string;
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
      icon: <Briefcase className="w-7 h-7" />,
      title: "Career Workshop",
      category: "Workshop",
      desc: "Workshop on CV Writing and the Art of Passing Job Interviews.",
      details: ["Presented by Amal Al Hersh", "Human Resources Development Fund (HRDF)"],
      color: TEAL,
      note: "Day 2 · 5:30 – 8:40 pm · Room 004",
      workshopId: "career-workshop",
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: "Tabaqat 3D Printing Workshop",
      category: "Workshop",
      desc: "Have you ever wondered how ideas are transformed into real-world prototypes? Join us for an interactive workshop where we'll explore the fundamentals of 3D printing and how it helps turn ideas into reality.",
      color: ORANGE,
      // Runs twice; the registration form asks which sitting. Kept vague here so
      // the card and the form cannot drift apart — the times live in
      // WORKSHOP_SESSIONS, which is what the form renders.
      note: "Day 1 & Day 3",
      image: tabaqatPoster,
      workshopId: "tabaqat-3d-printing",
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Intro to ChE",
      category: "Activity",
      desc: "An engaging introductory session designed for high school students to explore what Chemical Engineering is, how chemical engineers solve real-world problems, and the wide range of industries they work in. The session will highlight exciting applications in sustainability, energy, healthcare, food, and advanced materials while introducing students to studying Chemical Engineering at KFUPM.",
      color: TEAL,
      note: "Day 1 · 9:35 – 10:05 am",
      activityId: "intro-to-che",
      noAction: true,
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Fresh vs Experienced",
      category: "Activity",
      color: ORANGE,
      note: "Day 2 · 9:00 – 9:40 am",
      activityId: "fresh-vs-experienced",
      noAction: true,
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
      noAction: true,
    },
  ];

  const [filter, setFilter] = useState<"All" | "Competition" | "Activity" | "Workshop">("All");
  const filtered = competitions
    .filter((c) => filter === "All" || c.category === filter)
    .sort((a, b) => {
      // Priority 0: Open for registration right now — anything actionable
      //             outranks a card the visitor can only read.
      // Priority 1: Informational sessions (noAction) — no step to take, but
      //             they are happening, so they stay above anything shut.
      // Priority 2: Coming soon
      // Priority 3: Closed competitions
      //
      // Nothing is priority 0 today, which is why the informational sessions
      // sit at the top. The tier exists so that re-opening a registration
      // automatically lifts it above them without touching this function.
      const getPriority = (item: (typeof competitions)[number]) => {
        if (item.compId) return 3;
        if (item.comingSoon) return 2;
        if (item.noAction) return 1;
        return 0;
      };
      return getPriority(a) - getPriority(b);
    });

  // ─── Activity sign-ups ──────────────────────────────────────────────────
  // Which of this person's sign-ups already exist, so a card can show
  // "Registered" instead of inviting them to do it twice.
  const [signedUp, setSignedUp] = useState<Set<ActivityId>>(new Set());
  const [dialog, setDialog] = useState<{ id: ActivityId; title: string; color: string } | null>(null);

  // ─── Workshop registrations ─────────────────────────────────────────────
  // Open to anyone — no login, no conference registration first — so unlike the
  // activity sign-ups above there is no signed-in email to check against. A
  // card therefore cannot know whether this visitor already registered; the
  // dialog just says so on success, and a repeat submission overwrites the
  // same document rather than double-counting.
  const [workshopDialog, setWorkshopDialog] =
    useState<{ id: WorkshopId; title: string; color: string } | null>(null);

  // Informational cards are excluded: their sign-up state is never rendered,
  // so looking it up would be a Firestore read per card per page load for
  // nothing.
  const activityIds = competitions
    .filter((c) => !c.noAction)
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

  // Phrased around logging in, because that is what the card actually checks.
  // Someone who registered on another device already has an account and only
  // needs to log in — telling them to register would be wrong.
  const LOGIN_FIRST_NOTICE =
    "You need to be logged in to sign up for activities. If you haven't registered for SRC 2026 yet, register below.";

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
          {(["All", "Competition", "Workshop", "Activity"] as const).map((f) => (
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
                // `flex flex-col` so a card with a poster splits into image +
                // content instead of the content claiming the card's whole
                // height and pushing its button out through `overflow-hidden`.
                className="rounded-xl border overflow-hidden group hover:border-[#0CBFCE]/40 transition-colors duration-300 h-full flex flex-col"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                {/* Poster, when the session has one — full-bleed across the top
                    of the card. The card already has `overflow-hidden`, so it
                    inherits the rounded corners.

                    The bottom dissolves into the card rather than ending on a
                    rule: `mask-image` fades the image's own alpha to zero, so
                    whatever the card background happens to be shows through. An
                    overlay gradient would have to hard-code that background and
                    would break the moment it changed. The content below is
                    pulled up into the faded region, which is where the effect
                    reads as one surface rather than a picture with a gap. */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={`${item.title} poster`}
                    loading="lazy"
                    className="w-full object-cover object-top flex-shrink-0"
                    style={{
                      aspectRatio: "5 / 4",
                      maskImage: "linear-gradient(to bottom, black 45%, transparent 97%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 97%)",
                    }}
                  />
                )}
                <div className={`p-6 flex flex-col flex-1 ${item.image ? "-mt-16 relative" : ""}`}>
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
                      preselecting this competition when the card is one.
                      Skipped entirely for informational cards: no control at
                      all, not a disabled one, so nothing suggests a step the
                      visitor is missing. */}
                  {!item.noAction && (
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
                          // Workshops are open to anyone — straight to the
                          // name/email form, no login gate.
                          if (item.workshopId) {
                            setWorkshopDialog({ id: item.workshopId, title: item.title, color: item.color });
                            return;
                          }
                          // Signing up for a session assumes a conference
                          // registration. Without one, send them there first.
                          if (item.activityId) {
                            if (!user) { onParticipate(null, LOGIN_FIRST_NOTICE); return; }
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
                  )}
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

      {/* No `&& user` guard, unlike the activity dialog — workshops are open to
          anyone, which is the whole point of collecting the name and email. */}
      {workshopDialog && (
        <WorkshopSignupDialog
          workshopId={workshopDialog.id}
          title={workshopDialog.title}
          color={workshopDialog.color}
          onClose={() => setWorkshopDialog(null)}
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

// ─── Workshop registration dialog ─────────────────────────────────────────────
// Unlike ActivitySignupDialog above, this one is open to anyone: it collects the
// name and email itself rather than reading them off a signed-in user, so a
// visitor can register for a workshop without holding a conference registration.
function WorkshopSignupDialog({ workshopId, title, color, onClose }: {
  workshopId: WorkshopId;
  title: string;
  color: string;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Empty for a workshop that runs once — the picker is then skipped entirely
  // rather than shown with a single option.
  const sessions = WORKSHOP_SESSIONS[workshopId];
  // Deliberately starts unset even though there are only two options: a
  // pre-selected day would be silently submitted by anyone who did not read it.
  const [sessionId, setSessionId] = useState("");

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

  // Checked on every keystroke so the button's enabled state matches what the
  // save would actually accept — no submitting into a rejection.
  const nameOk = fullName.trim().length >= 2;
  const emailOk = isValidEmail(email);
  const sessionOk = sessions.length === 0 || sessionId !== "";
  const canSubmit = nameOk && emailOk && sessionOk && !saving;

  const submit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      await saveWorkshopSignup({ workshopId, fullName, email, sessionId });
      setDone(true);
    } catch (e: any) {
      console.error("Workshop registration failed:", e);
      setError(e?.message || "Could not save your registration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const field = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
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
        aria-label={`Register for ${title}`}
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
              Workshop registration
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

        {done ? (
          // ── Success ──
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${color}15`, border: `2px solid ${color}40` }}>
              <CheckCircle className="w-8 h-8" style={{ color }} />
            </div>
            <p className="font-display font-bold text-lg text-white mb-1">You're registered</p>
            <p className="text-sm text-muted-foreground">
              We've saved your place for {title}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{ color, background: `${color}18`, border: `1px solid ${color}45` }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Day first — this workshop runs more than once, and which sitting
                someone is coming to is the thing the organisers most need. */}
            {sessions.length > 0 && (
              <div className="mt-5 mb-4">
                <label className="block text-xs font-semibold mb-2 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  Choose your day
                </label>
                <div className="grid gap-2">
                  {sessions.map((s) => {
                    const picked = sessionId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSessionId(s.id)}
                        disabled={saving}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-all disabled:opacity-60"
                        style={{
                          background: picked ? `${color}14` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${picked ? color + "70" : "rgba(255,255,255,0.12)"}`,
                          color: picked ? "#fff" : "var(--muted-foreground)",
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ border: `2px solid ${picked ? color : "rgba(255,255,255,0.25)"}` }}
                        >
                          {picked && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                        </span>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className={`block text-xs font-semibold mb-1.5 tracking-wide ${sessions.length > 0 ? "" : "mt-5"}`} style={{ color: "var(--muted-foreground)" }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.slice(0, MAX_NAME_CHARS))}
              disabled={saving}
              autoComplete="name"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-colors disabled:opacity-60 mb-4"
              style={field}
              onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            />

            <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-colors disabled:opacity-60"
              style={field}
              onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            {/* Only nags once there is something to be wrong about. */}
            {email.length > 0 && !emailOk && (
              <p className="text-[11px] mt-1.5" style={{ color: "#ff8a8a" }}>
                That doesn't look like a valid email address.
              </p>
            )}

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
                onClick={submit}
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  color,
                  background: `${color}18`,
                  border: `1px solid ${color}45`,
                  opacity: canSubmit ? 1 : 0.45,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : <>Register <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

import { TEAL } from "./theme";
import type { Section, Competition } from "./types";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { AgendaPage, AgendaComingSoon, AGENDA_LIVE } from "./pages/AgendaPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { TeamsPage } from "./pages/TeamsPage";
import { PartnershipPage } from "./pages/PartnershipPage";
import { OrganizingPage } from "./pages/OrganizingPage";
import { MediaPage } from "./pages/MediaPage";
import { RegistrationModal } from "./components/registration/RegistrationModal";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HelpButton } from "./components/layout/HelpButton";
import type { AppUser } from "./lib/users";

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
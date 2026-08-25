import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Section, Competition } from "./types";
import { pathToSection, sectionToPath } from "./routes";
import { HomePage } from "./pages/HomePage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { AgendaPage, AgendaComingSoon, AGENDA_LIVE } from "./pages/AgendaPage";
import { AttendancePage } from "./pages/AttendancePage";
import { PartnershipPage } from "./pages/PartnershipPage";
import { RegistrationModal } from "./components/registration/RegistrationModal";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HelpButton } from "./components/layout/HelpButton";
import type { AppUser } from "./lib/users";

const USER_STORAGE_KEY = "src2026:user";

export default function App() {

  // The URL is the source of truth for which page is shown. Everything else in
  // the app still speaks in Sections, so `setSection` just navigates.
  const location = useLocation();
  const navigate = useNavigate();
  const matched = pathToSection(location.pathname);
  const section: Section = matched ?? "home";
  const setSection = (s: Section) => navigate(sectionToPath(s));

  // Unknown URL — replace it with home so the address bar never shows a dead path.
  useEffect(() => {
    if (matched === null) navigate("/", { replace: true });
  }, [matched, navigate]);

  const [regModalOpen, setRegModalOpen] = useState(false);
  // Competition preselected from a Competitions-page card ("Participate")
  const [regCompetition, setRegCompetition] = useState<Competition>(null);
  // Explains why the modal opened, when it was not opened by the user directly
  // — e.g. an activity sign-up that needs a conference registration first.
  const [regNotice, setRegNotice] = useState<string | undefined>(undefined);

  const openRegistration = (competition: Competition = null, notice?: string) => {
    setRegCompetition(competition);
    setRegNotice(notice);
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

  const handleViewAgendaDay = (day: number) => {
  navigate(day === 1 ? "/agenda" : `/agenda?day=${day}`);
};
  const pages: Record<Section, React.ReactNode> = {
    home: <HomePage setSection={setSection} onRegisterClick={() => openRegistration()} onViewAgendaDay={handleViewAgendaDay} />,
    competitions: <CompetitionsPage onParticipate={openRegistration} user={currentUser} />,
    // Agenda hidden until the schedule is public — set AGENDA_LIVE = true to restore.
      agenda: AGENDA_LIVE ? <AgendaPage /> : <AgendaComingSoon />,
    partnership: <PartnershipPage goToContactForm={goToContactForm} />,
    faq: <FAQPage goToContactForm={goToContactForm} />,
    contact: <ContactPage focusForm={contactFocus} onFocusHandled={() => setContactFocus(false)} />,
    //attendance: <AttendancePage user={currentUser} onRegisterClick={() => openRegistration()} />,
    attendance: <AttendancePage />,
  };
  

  return (
    <div
      ref={mainRef}
      className="min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}
    >

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
        notice={regNotice}
      />

      <main>
        {pages[section]}
      </main>

      <Footer setSection={setSection} />
    </div>
  );
}
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, ChevronRight, Loader2, Mail, Trophy, X } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import type { Competition, RegType } from "@/app/types";
import { CTAButton } from "@/app/components/common";
import { submitRegistration } from "@/app/lib/firebase";
import { findUserByEmail, createUserIfNotExists, type AppUser } from "@/app/lib/users";
import { sendConfirmationEmail, emailConfigured } from "@/app/lib/email";

import {
  REG_TYPES, COMPETITIONS, TEAM_COMPETITIONS, INDIVIDUAL_COMPETITIONS, STEP_LABELS,
} from "./registration.data";

export function RegistrationModal({ open, onClose, onLoginSuccess, initialCompetition = null }: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  initialCompetition?: Competition;
}) {
  // "register" = the existing conference flow (unchanged).
  // "login"    = the modal body is swapped for the lightweight login screen.
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [regType, setRegType] = useState<RegType>(null);
  const [competition, setCompetition] = useState<Competition>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // null until a send has been attempted. Drives the success-screen wording so
  // the modal never claims an email went out when it did not.
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  // Incremented per submission and on reset, so a late-resolving email or user
  // write can tell whether the modal it started in is still the one on screen.
  const submissionRef = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => {
        setStep(0);
        setRegType(null);
        setCompetition(null);
        setFormData({});
        setSubmitted(false);
        setSubmitting(false);
        setSubmitError(null);
        setEmailSent(null);
        submissionRef.current++; // orphan any in-flight follow-up work
        setMode("register");
        setLoginName("");
        setLoginEmail("");
        setLoginError(null);
        setLoggingIn(false);
      }, 300);
      return () => clearTimeout(id); // reopening cancels the pending reset
    }
  }, [open]);

  // Deep link from the Competitions page — jump straight to the team form
  // with the chosen competition preselected (user can still hit "Change").
  useEffect(() => {
    if (open && initialCompetition) {
      setMode("register");
      setSubmitted(false);
      setRegType("team");
      setCompetition(initialCompetition);
      setStep(1);
    }
  }, [open, initialCompetition]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const setField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleTypeSelect = (type: RegType) => {
    setRegType(type);
    setStep(1);
  };

  const goBack = () => {
    if (step === 2) { setStep(1); return; }
    if (step === 1) {
      if (regType === "team" && competition) { setCompetition(null); return; }
      setStep(0); setRegType(null);
    }
  };

  const handleSubmit = async () => {
    if (!regType || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    // The registration write is the only thing the user waits on. Everything
    // after it — the user record, the confirmation email — is follow-up work
    // that must not hold the success screen hostage, because neither has a
    // guaranteed deadline the way submitRegistration's 10s race does.
    try {
      await submitRegistration({
        type: regType,
        competition: regType === "team" ? competition : null,
        data: formData,
      });
    } catch (e: any) {
      console.error("Firestore submit error:", e);
      setSubmitError(e?.message || "Submission failed. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    // Safely stored. Show the success screen now.
    setSubmitted(true);
    setSubmitting(false);

    const newUserEmail = (formData.email ?? "").trim();
    if (!newUserEmail) return;

    const newUserName = (formData.fullName ?? formData.contactPerson ?? formData.teamName ?? "").trim();
    const regTypeLabel = getRegTypeLabel();
    const competitionLabel = regType === "team" ? getCompetitionLabel() : null;

    // Stamp this submission so a slow response cannot write into a modal that
    // has since been closed and reset, or into someone else's registration.
    const ticket = ++submissionRef.current;
    const stillCurrent = () => submissionRef.current === ticket;

    try {
      const user = await createUserIfNotExists(newUserName, newUserEmail);
      if (!user?.profileToken) {
        if (stillCurrent()) setEmailSent(false);
        return;
      }

      const sent = await sendConfirmationEmail({
        fullName: user.fullName || newUserName,
        email: user.email,
        registrationType: regTypeLabel,
        competition: competitionLabel,
        profileToken: user.profileToken,
      });
      if (stillCurrent()) setEmailSent(sent);
    } catch (userErr) {
      // Logged only — the registration itself already succeeded.
      console.error("User record error:", userErr);
      if (stillCurrent()) setEmailSent(false);
    }
  };

  // Lightweight login — Firestore lookup by email only. No auth, no passwords.
  const handleLogin = async () => {
    const email = loginEmail.trim();
    const name = loginName.trim();
    if (!email || !name || loggingIn) return;

    setLoggingIn(true);
    setLoginError(null);
    try {
      const found = await findUserByEmail(email);
      if (!found) {
        setLoginError("This email is not registered.");
        return;
      }
      onLoginSuccess(found);
      onClose();
    } catch (e: any) {
      console.error("Firestore login error:", e);
      setLoginError(e?.message || "Login failed. Please check your connection and try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const getFields = (): { key: string; label: string; type?: string; required?: boolean; options?: string[]; max?: number }[] => {
    switch (regType) {
      case "participant": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "organization", label: "Organization / Company / University", required: true },
        { key: "position", label: "Position / Job Title", required: true },
        { key: "country", label: "Country", required: true },
      ];
      case "team": {
        if (competition === "technical-presentation") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Presenter Name", required: true },
            { key: "email", label: "Presenter Email", type: "email", required: true },
            { key: "phone", label: "Presenter Phone Number", required: true },
            { key: "major", label: "Major", required: true },
            { key: "topic", label: "General Presentation Topic", required: true },
            { key: "aicheConfirm", label: "I confirm I am an active AIChE Student Member", type: "checkbox", required: true },
          ];
        }

        if (competition === "poster-competition") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Lead Participant Name", required: true },
            { key: "email", label: "Lead Participant Email", type: "email", required: true },
            { key: "phone", label: "Lead Participant Phone Number", required: true },
            { key: "major", label: "Major", required: true },
            { key: "topic", label: "General Research Topic (e.g. Water Treatment, Renewable Energy)", required: true },
            { key: "coAuthors", label: "Co-Authors / Additional Team Members (Names & Majors)", type: "textarea", required: false },
            { key: "aicheConfirm", label: "I confirm all participants are active AIChE Student Members", type: "checkbox", required: true },
          ];
        }

        if (competition === "cheme-jeopardy") {
          return [
            { key: "university", label: "University Name", required: true },
            { key: "fullName", label: "Team Captain Name", required: true },
            { key: "email", label: "Team Captain Email", type: "email", required: true },
            { key: "phone", label: "Team Captain Phone Number", required: true },
            { key: "member1", label: "Member 1 Name & Major (Captain)", required: true },
            { key: "member2", label: "Member 2 Name & Major", required: true },
            { key: "member3", label: "Member 3 Name & Major", required: true },
            { key: "member4", label: "Member 4 Name & Major", required: true },
            { key: "aicheConfirm", label: "I confirm all 4 members are active AIChE Student Members", type: "checkbox", required: true },
          ];
        }

        // Fallback for Chem-E-Car
        return [
          { key: "university", label: "University Name", required: true },
          { key: "fullName", label: "Team Leader Name", required: true },
          { key: "email", label: "Team Leader Email", type: "email", required: true },
          { key: "phone", label: "Phone Number", required: true },
          { key: "teamName", label: "Team Name", required: true },
          { key: "aicheConfirm", label: "I confirm all team members are active AIChE Student Members", type: "checkbox", required: true },
        ];
      }
      case "speaker": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "organization", label: "Organization", required: true },
        { key: "position", label: "Position", required: true },
        { key: "country", label: "Country", required: true },
        { key: "role", label: "Role", options: ["Speaker", "Judge", "Mentor"], required: true },
      ];
      case "volunteer": return [
        { key: "fullName", label: "Full Name", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "university", label: "University", required: true },
        { key: "major", label: "Major", required: true },
        { key: "country", label: "Country", required: true },
      ];
      case "partner": return [
        { key: "companyName", label: "Company Name", required: true },
        { key: "contactPerson", label: "Contact Person", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "position", label: "Position", required: true },
        { key: "country", label: "Country", required: true },
        { key: "partnershipInterest", label: "Partnership Interest", required: true },
      ];
      default: return [];
    }
  };

  const isFormValid = () => {
    if (regType === "team" && !competition) return false;
    const fields = getFields();
    for (const f of fields) {
      const val = (formData[f.key] ?? "").trim();
      if (f.required && !val) return false;
      if (f.type === "checkbox" && f.required && val !== "true") return false;
      if (val && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
    }
    return true;
  };

  const getRegTypeLabel = () => REG_TYPES.find(r => r.id === regType)?.title ?? "";
  const getCompetitionLabel = () => COMPETITIONS.find(c => c.id === competition)?.title ?? "";

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: "rgba(4, 10, 18, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "regOverlayIn 0.25s ease forwards",
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <style>{`
        @keyframes regOverlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes regModalIn { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes regStepIn { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: translateX(0) } }
        .reg-modal { animation: regModalIn 0.3s cubic-bezier(.16,.84,.44,1) forwards; }
        .reg-step { animation: regStepIn 0.3s cubic-bezier(.16,.84,.44,1) forwards; }
        .reg-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(12, 191, 206, 0.2);
          background: rgba(7, 17, 30, 0.6);
          color: #E8EDF5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .reg-input:focus { border-color: #0CBFCE; box-shadow: 0 0 0 3px rgba(12,191,206,0.12); }
        .reg-select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(12, 191, 206, 0.2);
          background: rgba(7, 17, 30, 0.6);
          color: #E8EDF5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
          font-family: inherit;
          cursor: pointer;
        }
        .reg-select:focus { border-color: #0CBFCE; box-shadow: 0 0 0 3px rgba(12,191,206,0.12); }
        .reg-select option { background: #0D1E30; color: #E8EDF5; }
        .reg-card-type {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(12, 191, 206, 0.18);
          background: rgba(13, 30, 48, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .reg-card-type:hover {
          border-color: rgba(12, 191, 206, 0.5);
          background: rgba(12, 191, 206, 0.07);
          transform: translateY(-1px);
        }
        .reg-card-type-lg { flex-direction: column; align-items: flex-start; gap: 14px; padding: 22px 20px; }
        .reg-card-comp {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(12, 191, 206, 0.18);
          background: rgba(13, 30, 48, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .reg-card-comp:hover {
          border-color: rgba(12, 191, 206, 0.5);
          background: rgba(12, 191, 206, 0.07);
          transform: translateY(-1px);
        }
        .reg-progress-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600;
        }
        .reg-progress-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .reg-progress-line {
          flex: 1; height: 1px;
          transition: background 0.3s;
        }
        .reg-review-row {
          display: flex;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
          gap: 12px;
        }
        .reg-review-row:last-child { border-bottom: none; }
      `}</style>

      <div
        className="reg-modal relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(9, 20, 34, 0.95)",
          border: `1px solid ${TEAL}30`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${TEAL}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Ambient glow top-right */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 0%, ${TEAL}15 0%, transparent 60%)`, borderRadius: "0 1rem 0 0" }} />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <div>
            <p className="text-xs font-mono tracking-[0.2em] uppercase mb-0.5" style={{ color: TEAL }}>SRC 2026</p>
            <h2 className="font-display text-xl font-bold text-white">
              {mode === "login"
                ? "Welcome Back"
                : submitted ? "Registration Submitted" : step === 0 ? "Register" : step === 1 ? getRegTypeLabel() : "Review & Submit"}
            </h2>
            {mode === "register" && !submitted && step === 0 && (
              <button
                type="button"
                onClick={() => { setMode("login"); setLoginError(null); }}
                className="mt-1.5 text-xs text-left transition-opacity hover:opacity-75"
                style={{ color: "var(--muted-foreground)" }}
              >
                Already registered?{" "}
                <span className="font-semibold underline" style={{ color: TEAL }}>Log in here</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        {mode === "register" && !submitted && (
          <div className="relative z-10 px-6 pb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="reg-progress-step">
                    <div
                      className="reg-progress-dot"
                      style={
                        i < step
                          ? { background: TEAL, color: "#07111E" }
                          : i === step
                          ? { background: `${TEAL}20`, border: `2px solid ${TEAL}`, color: TEAL }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--muted-foreground)" }
                      }
                    >
                      {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className="hidden sm:block text-xs" style={{ color: i <= step ? TEAL : "var(--muted-foreground)" }}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="reg-progress-line flex-1" style={{ background: i < step ? TEAL : "rgba(255,255,255,0.1)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex-shrink-0 mx-6" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">

          {/* LOGIN — replaces the modal body. No router, no second modal. */}
          {mode === "login" && (
            <div className="reg-step">
              <p className="text-muted-foreground text-sm mb-5">
                Enter the name and email you used when registering for SRC 2026.
              </p>
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    Full Name<span style={{ color: TEAL }}> *</span>
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    value={loginName}
                    onChange={e => setLoginName(e.target.value)}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    Email<span style={{ color: TEAL }}> *</span>
                  </label>
                  <input
                    className="reg-input"
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(null); }}
                    onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs mt-3" style={{ color: "#ff8a8a" }}>{loginError}</p>
              )}

              <div className="mt-7 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setMode("register"); setLoginError(null); }}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  ← Back to registration
                </button>
                <CTAButton
                  primary
                  onClick={handleLogin}
                  className={(!loginName.trim() || !loginEmail.trim() || loggingIn) ? "opacity-40 pointer-events-none" : ""}
                >
                  {loggingIn ? "Logging in…" : "Login"} <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {mode === "register" && submitted && (
            <div className="reg-step text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}>
                <CheckCircle className="w-8 h-8" style={{ color: TEAL }} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">You're registered!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                Your registration as a <span className="text-white font-semibold">{getRegTypeLabel()}</span>
                {regType === "team" && competition && <> for <span className="text-white font-semibold">{getCompetitionLabel()}</span></>} has been submitted. We'll be in touch at your provided email address.
              </p>
              {emailSent === null ? (
                <div className="max-w-sm mx-auto">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                    style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25`, color: TEAL }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending your confirmation…
                  </div>
                </div>
              ) : emailSent === true ? (
                <div className="max-w-sm mx-auto">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                    style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25`, color: TEAL }}
                  >
                    <Mail className="w-4 h-4" /> Confirmation sent to {formData.email}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Open it to confirm the name on your badge and add a photo. If it
                    hasn't arrived in a minute or two, check your spam folder.
                  </p>
                </div>
              ) : (
                <div className="max-w-sm mx-auto">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                    style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}25`, color: ORANGE }}
                  >
                    <Mail className="w-4 h-4" /> Confirmation email pending
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {emailConfigured
                      ? "Your registration is saved, but we couldn't send the confirmation email just now. Our team will follow up at "
                      : "Your registration is saved. Our team will follow up at "}
                    <span className="text-white">{formData.email}</span>.
                  </p>
                </div>
              )}
              <div className="mt-8">
                <CTAButton primary onClick={onClose}>Close</CTAButton>
              </div>
            </div>
          )}

          {/* STEP 0 — TYPE SELECTION */}
          {mode === "register" && !submitted && step === 0 && (
            <div className="reg-step">
              <p className="text-muted-foreground text-sm mb-4">How would you like to participate in SRC 2026?</p>
              <div className="flex flex-wrap justify-center gap-4">
                {REG_TYPES.map((type) => (
                  <button key={type.id} className="reg-card-type reg-card-type-lg w-full sm:w-[calc(50%-0.5rem)] max-w-sm" onClick={() => handleTypeSelect(type.id)}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${type.color}15`, color: type.color }}>
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-white text-base mb-1">{type.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{type.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — FORM */}
          {mode === "register" && !submitted && step === 1 && (
            <div className="reg-step">
              {/* Team: competition picker first */}
              {regType === "team" && !competition && (
                <div>
                  <p className="text-muted-foreground text-sm mb-4">Which competition would you like to register for?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMPETITIONS.map((comp) => (
                      <button key={comp.id} className="reg-card-comp" onClick={() => setCompetition(comp.id)}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${comp.color}15`, color: comp.color }}>
                          {comp.icon}
                        </div>
                        <div>
                          <div className="font-display font-bold text-white text-sm">{comp.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{comp.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form fields */}
              {(regType !== "team" || competition) && (
                <div>
                  {regType === "team" && competition && (
                    <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg" style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}30` }}>
                      <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: ORANGE }} />
                      <span className="text-sm font-semibold" style={{ color: ORANGE }}>{getCompetitionLabel()}</span>
                      <button onClick={() => setCompetition(null)} className="ml-auto text-xs text-muted-foreground hover:text-white transition-colors">Change</button>
                    </div>
                  )}
                  <div className="grid gap-4">
                    {getFields().map((field) => (
                      <div key={field.key}>
                        {field.type !== "checkbox" && (
                          <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                            {field.label}{field.required && <span style={{ color: TEAL }}> *</span>}
                          </label>
                        )}
                        {field.type === "checkbox" ? (
                          <label className="flex items-center gap-3 cursor-pointer mt-1">
                            <input
                              type="checkbox"
                              checked={formData[field.key] === "true"}
                              onChange={e => setField(field.key, e.target.checked ? "true" : "")}
                              className="w-4 h-4 rounded accent-[#0CBFCE] cursor-pointer"
                            />
                            <span className="text-xs text-white leading-tight">{field.label}. To become an active member, join <a href="https://www2.aiche.org/membership" className="text-blue-500 hover:underline">here</a></span>
                          </label>
                        ) : field.type === "textarea" ? (
                          <textarea
                            className="reg-input"
                            rows={3}
                            value={formData[field.key] ?? ""}
                            onChange={e => setField(field.key, e.target.value)}
                            placeholder={field.label}
                          />
                        ) : field.options ? (
                          <select
                            className="reg-select"
                            value={formData[field.key] ?? ""}
                            onChange={e => setField(field.key, e.target.value)}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <>
                            <input
                              className="reg-input"
                              type={field.type ?? "text"}
                              value={formData[field.key] ?? ""}
                              onChange={e => setField(field.key, e.target.value)}
                              placeholder={field.label}
                            />
                            {field.type === "email" && (formData[field.key] ?? "").trim() !== "" &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData[field.key] ?? "").trim()) && (
                                <p className="text-xs mt-1.5" style={{ color: "#ff8a8a" }}>Please enter a valid email address.</p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — REVIEW */}
          {mode === "register" && !submitted && step === 2 && (
            <div className="reg-step">
              <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(12,191,206,0.05)", border: `1px solid ${TEAL}20` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${TEAL}15`, color: TEAL }}>
                    {REG_TYPES.find(r => r.id === regType)?.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">{getRegTypeLabel()}</div>
                    {regType === "team" && competition && (
                      <div className="text-xs" style={{ color: ORANGE }}>{getCompetitionLabel()}</div>
                    )}
                  </div>
                </div>
                <div>
                  {getFields().map(field => (
                    formData[field.key] ? (
                      <div key={field.key} className="reg-review-row">
                        <span className="text-muted-foreground">{field.label}</span>
                        <span className="text-white font-medium text-right">{formData[field.key]}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Please review your information before submitting.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === "register" && !submitted && step > 0 && (
          <div className="relative z-10 flex-shrink-0 px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </button>

            {step === 1 && (regType !== "team" || competition) && (
              <CTAButton primary onClick={() => setStep(2)} className={isFormValid() ? "" : "opacity-40 pointer-events-none"}>
                Review <ChevronRight className="w-4 h-4" />
              </CTAButton>
            )}
            {step === 2 && (
              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <p className="text-xs text-right" style={{ color: "#ff8a8a" }}>{submitError}</p>
                )}
                <CTAButton
                  primary
                  onClick={handleSubmit}
                  className={submitting ? "opacity-60 pointer-events-none" : ""}
                >
                  {submitting ? "Submitting…" : "Submit Registration"} <ArrowRight className="w-4 h-4" />
                </CTAButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Floating "Do you need help?" button ─────────────────────────────────────

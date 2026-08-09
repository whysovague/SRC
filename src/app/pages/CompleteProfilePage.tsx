import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, Camera, CheckCircle, Loader2, Trash2, User } from "lucide-react";

import { TEAL, ORANGE } from "@/app/theme";
import type { Section } from "@/app/types";
import { EVENT, EVENT_LOCATION } from "@/app/lib/event";
import { CTAButton } from "@/app/components/common";
import { findUserByToken, saveProfile, type AppUser } from "@/app/lib/users";
import { fileToSquareDataUrl, ImageError, ACCEPT_ATTRIBUTE } from "@/app/lib/image";

// ─── Complete your profile ────────────────────────────────────────────────────
// The destination of the button in the confirmation email. Reached as
//   /complete-profile?t=<profileToken>
// The token identifies the registrant, so the page works without a login —
// which is the point: they click straight through from their inbox.
//
// A logged-in visitor with no token in the URL edits their own profile instead,
// so the page doubles as "my badge" for anyone who lost the email.

type LoadState = "loading" | "ready" | "notfound" | "noaccess";

export function CompleteProfilePage({ currentUser, onProfileSaved, setSection }: {
  currentUser: AppUser | null;
  onProfileSaved: (user: AppUser) => void;
  setSection: (s: Section) => void;
}) {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("t")?.trim() ?? "";

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [user, setUser] = useState<AppUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  // While false, the save passes `undefined` for the photo so saveProfile
  // leaves whatever is already stored alone. Only an explicit upload or
  // removal writes the field.
  const [photoTouched, setPhotoTouched] = useState(false);

  const [photoError, setPhotoError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Resolve who this page is for: the token first, then the local session ──
  //
  // Keyed on currentUser?.id, not the object. App creates a fresh AppUser on
  // every login and after every profile save, and re-running on that identity
  // change would refetch and overwrite whatever the visitor had already typed.
  const sessionUserId = currentUser?.id;
  const loadedUserId = user?.id;

  useEffect(() => {
    let cancelled = false;

    const applyUser = (u: AppUser) => {
      if (cancelled) return;
      setUser(u);
      setFullName(u.fullName ?? "");
      setPhoto(u.photoDataUrl || null);
      setLoadState("ready");
    };

    const load = async () => {
      if (token) {
        // Already showing this person — do not clobber their edits.
        if (loadedUserId) return;
        try {
          const found = await findUserByToken(token);
          if (cancelled) return;
          if (!found) { setLoadState("notfound"); return; }
          applyUser(found);
        } catch (e) {
          console.error("Profile lookup failed:", e);
          if (!cancelled) setLoadState("notfound");
        }
        return;
      }

      if (!currentUser) { setLoadState("noaccess"); return; }
      if (loadedUserId === currentUser.id) return; // same person, keep edits
      applyUser(currentUser);
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, sessionUserId, loadedUserId]);

  // ── Photo ───────────────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await fileToSquareDataUrl(file);
      setPhoto(dataUrl);
      setPhotoTouched(true);
    } catch (e) {
      setPhotoError(
        e instanceof ImageError ? e.message : "That photo could not be processed. Please try another."
      );
    } finally {
      // A file input fires no change event when the same path is picked again,
      // so clear it — otherwise "shrink the file and re-select it" does nothing.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const removePhoto = () => {
    setPhoto(null);
    setPhotoTouched(true);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const nameValid = fullName.trim().length >= 2;

  const handleSave = async () => {
    if (!user || !nameValid || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(user.id, {
        fullName: fullName.trim(),
        photoDataUrl: photoTouched ? photo : undefined,
      });

      const updated: AppUser = {
        ...user,
        fullName: fullName.trim(),
        profileComplete: true,
        ...(photoTouched ? { photoDataUrl: photo ?? undefined } : {}),
      };
      setUser(updated);
      onProfileSaved(updated);
      setSaved(true);
    } catch (e: any) {
      console.error("Profile save failed:", e);
      setSaveError(e?.message || "Could not save. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Shell ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 pt-32 pb-24">
      <style>{`
        .cp-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(12, 191, 206, 0.2);
          background: rgba(7, 17, 30, 0.6);
          color: #E8EDF5;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .cp-input:focus { border-color: #0CBFCE; box-shadow: 0 0 0 3px rgba(12,191,206,0.12); }
        .cp-avatar {
          width: 128px; height: 128px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px dashed rgba(12,191,206,0.35);
          background: rgba(7,17,30,0.6);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .cp-avatar:hover { border-color: #0CBFCE; background: rgba(12,191,206,0.07); }
        .cp-avatar-filled { border-style: solid; border-color: rgba(12,191,206,0.55); }
        .cp-fact { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cp-fact:last-child { border-bottom: none; }
      `}</style>

      <div className="max-w-xl mx-auto">
        {loadState === "loading" && (
          <div className="flex flex-col items-center py-24 gap-4">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: TEAL }} />
            <p className="text-sm text-muted-foreground">Loading your registration…</p>
          </div>
        )}

        {(loadState === "notfound" || loadState === "noaccess") && (
          <Panel>
            <div className="text-center py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${ORANGE}15`, border: `2px solid ${ORANGE}40` }}
              >
                <AlertCircle className="w-7 h-7" style={{ color: ORANGE }} />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-3">
                {loadState === "notfound" ? "This link isn't valid" : "Open the link from your email"}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-7">
                {loadState === "notfound"
                  ? "The profile link has expired or was mistyped. Check that you copied the whole address from your confirmation email."
                  : "Your confirmation email contains a personal link to this page. Open it from there, or log in first and come back."}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <CTAButton primary onClick={() => setSection("home")}>Back to home</CTAButton>
                <CTAButton ghost onClick={() => setSection("contact")}>Contact us</CTAButton>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Still stuck? Email{" "}
                <a href={`mailto:${EVENT.supportEmail}`} className="underline" style={{ color: TEAL }}>
                  {EVENT.supportEmail}
                </a>
              </p>
            </div>
          </Panel>
        )}

        {loadState === "ready" && saved && (
          <Panel>
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: TEAL }} />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-3">You're all set</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
                Your badge will read <span className="text-white font-semibold">{fullName.trim()}</span>.
                See you at {EVENT.venueShort} on {EVENT.datesShort}.
              </p>
              {photo && (
                <img
                  src={photo}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-7"
                  style={{ border: `2px solid ${TEAL}55` }}
                />
              )}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <CTAButton primary onClick={() => setSection("home")}>Back to home</CTAButton>
                <CTAButton ghost onClick={() => setSaved(false)}>Edit again</CTAButton>
              </div>
            </div>
          </Panel>
        )}

        {loadState === "ready" && !saved && (
          <>
            <div className="text-center mb-8">
              <p className="text-xs font-mono tracking-[0.2em] uppercase mb-2" style={{ color: TEAL }}>
                {EVENT.name} · Registration confirmed
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                Complete your profile
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                One last step. This is the name printed on your conference badge, so
                please check the spelling.
              </p>
            </div>

            <Panel>
              {/* Their details, so they know which registration this is */}
              <div className="mb-7">
                <div className="cp-fact">
                  <span className="text-muted-foreground">Registered email</span>
                  <span className="text-white font-medium text-right break-all">{user?.email}</span>
                </div>
                <div className="cp-fact">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="text-white font-medium text-right">{EVENT.dates}</span>
                </div>
                <div className="cp-fact">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-white font-medium text-right">{EVENT_LOCATION}</span>
                </div>
              </div>

              {/* Name — required */}
              <label
                className="block text-xs font-semibold mb-2 tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
                htmlFor="cp-name"
              >
                Name on your badge<span style={{ color: TEAL }}> *</span>
              </label>
              <input
                id="cp-name"
                className="cp-input"
                type="text"
                value={fullName}
                onChange={e => { setFullName(e.target.value); setSaveError(null); }}
                placeholder="Your full name"
                autoComplete="name"
              />
              {fullName.trim() !== "" && !nameValid && (
                <p className="text-xs mt-2" style={{ color: "#ff8a8a" }}>
                  Please enter your full name.
                </p>
              )}

              {/* Photo — optional */}
              <div className="mt-8">
                <label
                  className="block text-xs font-semibold mb-1 tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Badge photo <span className="font-normal opacity-70">(optional)</span>
                </label>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  A clear headshot helps our team recognise you at the desk. JPG, PNG or
                  WEBP — we crop it to a square and shrink it for you.
                </p>

                <div className="flex items-center gap-5 flex-wrap">
                  <div
                    className={`cp-avatar ${photo ? "cp-avatar-filled" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                    aria-label="Choose a badge photo"
                  >
                    {photo
                      ? <img src={photo} alt="" className="w-full h-full object-cover" />
                      : <User className="w-10 h-10" style={{ color: `${TEAL}70` }} />}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                      style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35` }}
                    >
                      <Camera className="w-4 h-4" style={{ color: TEAL }} />
                      {photo ? "Change photo" : "Upload photo"}
                    </button>

                    {photo && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_ATTRIBUTE}
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])}
                />

                {photoError && (
                  <p className="text-xs mt-3" style={{ color: "#ff8a8a" }}>{photoError}</p>
                )}
              </div>

              {/* Save */}
              <div className="mt-9 flex flex-col items-end gap-2">
                {saveError && (
                  <p className="text-xs text-right" style={{ color: "#ff8a8a" }}>{saveError}</p>
                )}
                <CTAButton
                  primary
                  onClick={handleSave}
                  className={!nameValid || saving ? "opacity-40 pointer-events-none" : ""}
                >
                  {saving ? "Saving…" : "Save my profile"}
                  {saving
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle className="w-4 h-4" />}
                </CTAButton>
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}

/** The glass card the page content sits on — matches the registration modal. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 sm:p-8 overflow-hidden"
      style={{
        background: "rgba(9, 20, 34, 0.95)",
        border: `1px solid ${TEAL}30`,
        boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px ${TEAL}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: `radial-gradient(circle at 80% 0%, ${TEAL}15 0%, transparent 60%)` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

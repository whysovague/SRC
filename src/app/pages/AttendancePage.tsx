import { useState } from "react";
import { CheckCircle, Clock, Printer, Users } from "lucide-react";
import { TEAL, ORANGE } from "@/app/theme";
import { MoleculeNetwork, GradientEyebrow, Divider } from "@/app/components/common";

// ── Firestore ──────────────────────────────────────────────────────────────
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { isValidEmail, MAX_NAME_CHARS, MAX_EMAIL_CHARS } from "../lib/workshops"; // نفس الملف اللي تستخدمه صفحة تسجيل الدخول

type AttendanceRecord = {
  time: string;
  date: string;
  /** "" on records written before check-in started asking for identity. */
  fullName: string;
  email: string;
};

// ── Tabaqat 3D printing workshop ────────────────────────────────────────────
// A second, independent check-in that lives on this same page. It writes to its
// own collection so the workshop roster never has to be untangled from the main
// conference attendance list.
//
// IMPORTANT: this collection needs its own block in the Firestore rules. The
// deployed rules name each collection explicitly and have no catch-all, so
// until a `match /tabaqatWorkshop/{document}` rule is published, every write
// here fails with permission-denied.
const TABAQAT_COLLECTION = "tabaqatWorkshop";
const TABAQAT_LABEL = "Tabaqat 3D printing workshop";

// ── Date formatting ─────────────────────────────────────────────────────────
// Check-ins are stamped on the attendee's own phone, and a plain "en-SA"
// resolves to the Islamic (Umm al-Qura) calendar on a device configured for
// Saudi Arabia — which is why the existing records mix "August 31, 2026" with
// "18 Rabi' I 1448 AH" in the same list, depending on who checked in.
//
// Pinning the calendar and the numbering system makes every device agree. On a
// device that was already producing Gregorian this is a no-op: the output is
// byte-identical. Note this only fixes records written from now on — rows
// already stored keep whatever string their phone produced. The `timestamp`
// field is a serverTimestamp and stays authoritative either way.
const DATE_LOCALE = "en-SA-u-ca-gregory-nu-latn";
const TIME_OPTS = { hour: "2-digit", minute: "2-digit", hour12: true } as const;
const DATE_OPTS = { year: "numeric", month: "long", day: "numeric" } as const;

export function AttendancePage() {
  // ── Who is checking in ──────────────────────────────────────────────────
  // Shared by both check-ins on this page rather than duplicated per form:
  // someone attending the conference *and* the workshop is one person, and
  // making them type their name twice on one screen invites typos that split
  // them across two rows in the export.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const nameOk = fullName.trim().length >= 2;
  const emailOk = isValidEmail(email);
  const identityOk = nameOk && emailOk;

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // The workshop check-in tracks its own state end to end. Sharing `submitted`
  // with the main button would mean confirming one hides the other, and plenty
  // of people will want to do both.
  const [tabaqatConfirmed, setTabaqatConfirmed] = useState(false);
  const [tabaqatSubmitting, setTabaqatSubmitting] = useState(false);
  const [tabaqatDone, setTabaqatDone] = useState(false);
  const [tabaqatError, setTabaqatError] = useState("");

  // ── Admin view (visit /attend?admin=1) ─────────────────────────────────────
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [tabaqatRecords, setTabaqatRecords] = useState<AttendanceRecord[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminLoaded, setAdminLoaded] = useState(false);

  const loadAdmin = async () => {
    setLoadingAdmin(true);
    try {
      const read = async (name: string) => {
        const snap = await getDocs(collection(db, name));
        const data: AttendanceRecord[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          data.push({
            time: d.time,
            date: d.date,
            fullName: String(d.fullName ?? ""),
            email: String(d.email ?? ""),
          });
        });
        return data;
      };

      // Fetched together so one slow collection does not stall the other. The
      // workshop roster is allowed to fail on its own: if its Firestore rule
      // has not been published yet, the main attendance list still loads.
      const [attendance, tabaqat] = await Promise.all([
        read("attendance"),
        read(TABAQAT_COLLECTION).catch(() => {
          setTabaqatError(
            `Could not read ${TABAQAT_COLLECTION} — check that its Firestore rule is published.`
          );
          return [] as AttendanceRecord[];
        }),
      ]);

      setRecords(attendance);
      setTabaqatRecords(tabaqat);
      setAdminLoaded(true);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const downloadCSV = (rows: AttendanceRecord[], label: string) => {
    // Escaped rather than joined raw: a name may contain a comma, which would
    // otherwise shift every following column on that row. The BOM stops Excel
    // on Windows mangling Arabic names.
    const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const header = ["Name", "Email", "Time", "Date"].map(cell).join(",");
    const body = rows.map((r) => [r.fullName, r.email, r.time, r.date].map(cell).join(","));
    const csv = "﻿" + [header, ...body].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SRC2026_${label}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Submit workshop attendance ─────────────────────────────────────────────
  // Independent of the main check-in: no checkbox to tick, and it does not
  // switch the page over to the success screen. Confirming the workshop leaves
  // the main form exactly where it was.
  const handleTabaqat = async () => {
    // Guarded here as well as on the button's `disabled`, so the write cannot
    // happen without the box ticked even if the button is reached some other
    // way (keyboard, a stale render, devtools).
    if (!identityOk || !tabaqatConfirmed || tabaqatSubmitting || tabaqatDone) return;
    setTabaqatSubmitting(true);
    setTabaqatError("");

    const now = new Date();
    const time = now.toLocaleTimeString(DATE_LOCALE, TIME_OPTS);
    const date = now.toLocaleDateString(DATE_LOCALE, DATE_OPTS);

    try {
      await addDoc(collection(db, TABAQAT_COLLECTION), {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        time,
        date,
        workshop: TABAQAT_LABEL,
        timestamp: serverTimestamp(),
      });
      setTabaqatDone(true);
    } catch {
      setTabaqatError("Something went wrong. Please try again.");
    } finally {
      setTabaqatSubmitting(false);
    }
  };

  // Rendered in both the form and the success screen, so confirming the main
  // attendance never puts the workshop check-in out of reach.
  const tabaqatButton = (
    <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Small heading, so the block below is obviously a separate question and
          not a second button for the conference check-in above. */}
      <p className="text-center text-xs font-mono tracking-[0.18em] uppercase mb-3" style={{ color: ORANGE }}>
        هل تحضر الورشة؟ · Attending the workshop?
      </p>

      {/* Tick-then-submit, same as the main check-in above — the workshop roster
          is a real headcount, so a stray tap must not land in it. */}
      <label
        className="flex items-center justify-center gap-4 rounded-xl p-5 mb-4 cursor-pointer transition-all w-full"
        style={{
          background: tabaqatConfirmed ? `${ORANGE}08` : "rgba(255,255,255,0.03)",
          border: `1px solid ${tabaqatConfirmed ? ORANGE + "40" : "rgba(255,255,255,0.08)"}`,
          cursor: tabaqatDone ? "default" : "pointer",
        }}
      >
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            className="sr-only"
            checked={tabaqatConfirmed}
            disabled={tabaqatDone}
            onChange={(e) => setTabaqatConfirmed(e.target.checked)}
          />
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{
              background: tabaqatConfirmed ? ORANGE : "rgba(255,255,255,0.06)",
              border: `2px solid ${tabaqatConfirmed ? ORANGE : "rgba(255,255,255,0.2)"}`,
            }}
          >
            {tabaqatConfirmed && <CheckCircle className="w-4 h-4 text-[#07111E]" />}
          </div>
        </div>

        <div className="text-center">
          <p className="font-semibold text-white text-sm mb-1 text-center">
            أؤكد حضوري لورشة طبقات للطباعة ثلاثية الأبعاد
          </p>
          <p className="text-muted-foreground text-xs text-center">
            I confirm my attendance at the {TABAQAT_LABEL}
          </p>
        </div>
      </label>

      <button
        type="button"
        onClick={handleTabaqat}
        disabled={!identityOk || !tabaqatConfirmed || tabaqatSubmitting || tabaqatDone}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all disabled:cursor-not-allowed"
        // Opacity is set inline rather than via `disabled:opacity-40`: an inline
        // opacity always beats the utility class, so mixing the two would dim
        // the confirmed state and leave the un-ticked state at full strength —
        // exactly backwards.
        style={
          tabaqatDone
            ? { background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}40`, opacity: 1 }
            : {
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                border: `1px solid ${ORANGE}40`,
                opacity: tabaqatSubmitting ? 0.6 : (tabaqatConfirmed && identityOk) ? 1 : 0.4,
              }
        }
      >
        {tabaqatDone ? (
          <span className="inline-flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            تم التسجيل في الورشة / Workshop confirmed
          </span>
        ) : tabaqatSubmitting ? (
          "جاري التسليم..."
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" style={{ color: ORANGE }} />
            تأكيد حضور ورشة طبقات / Confirm Workshop
          </span>
        )}
      </button>

      {tabaqatError && (
        <p className="text-xs text-center mt-3" style={{ color: ORANGE }}>{tabaqatError}</p>
      )}
    </div>
  );

  // ── Submit attendance ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed || !identityOk) return;
    setSubmitting(true);
    setError("");

    const now = new Date();
    const time = now.toLocaleTimeString(DATE_LOCALE, TIME_OPTS);
    const date = now.toLocaleDateString(DATE_LOCALE, DATE_OPTS);

    try {
      await addDoc(collection(db, "attendance"), {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        time,
        date,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Admin view ─────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="relative overflow-hidden pt-24 pb-28 min-h-screen">
        <MoleculeNetwork />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="mb-7"><GradientEyebrow>Admin View</GradientEyebrow></div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-2">Attendance Records</h2>
          <Divider />

          {!adminLoaded ? (
            <button
              onClick={loadAdmin}
              disabled={loadingAdmin}
              className="mt-8 px-6 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`, color: "#07111E" }}
            >
              {loadingAdmin ? "Loading..." : "Load Records"}
            </button>
          ) : (
            <div className="mt-8">
              {/* Summary */}
              <div className="rounded-xl p-5 mb-6 flex items-center gap-4"
                style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${TEAL}20`, color: TEAL }}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Attendance</p>
                  <p className="font-display text-4xl font-black" style={{ color: TEAL }}>{records.length}</p>
                </div>
                <button
                  onClick={() => downloadCSV(records, "Attendance")}
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: `${ORANGE}15`, color: ORANGE, border: `1px solid ${ORANGE}30` }}
                >
                  Download Excel ↓
                </button>
              </div>

              {/* Records list */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${TEAL}20` }}>
                <div className="px-4 py-2 text-xs font-mono grid grid-cols-4 gap-3"
                  style={{ background: `${TEAL}10`, color: `${TEAL}` }}>
                  <span>Name</span><span>Email</span><span>Time</span><span>Date</span>
                </div>
                {records.map((r, i) => (
                  <div key={i} className="px-4 py-3 grid grid-cols-4 gap-3 text-sm border-t"
                    style={{ borderColor: `${TEAL}10`, background: i % 2 === 0 ? "transparent" : `${TEAL}04` }}>
                    <span className="text-muted-foreground truncate" title={r.fullName}>{r.fullName || "—"}</span>
                    <span className="text-muted-foreground truncate" title={r.email}>{r.email || "—"}</span>
                    <span className="text-muted-foreground font-mono">{r.time}</span>
                    <span className="text-muted-foreground">{r.date}</span>
                  </div>
                ))}
                {records.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">No records yet.</div>
                )}
              </div>

              {/* ── Tabaqat workshop ── its own count and export, below the main
                  attendance block rather than beside it, so the two rosters are
                  never mistaken for one another. */}
              <div className="mt-10">
                <div className="rounded-xl p-5 mb-6 flex items-center gap-4"
                  style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}30` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${ORANGE}20`, color: ORANGE }}>
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      Tabaqat Workshop
                    </p>
                    <p className="font-display text-4xl font-black" style={{ color: ORANGE }}>
                      {tabaqatRecords.length}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadCSV(tabaqatRecords, "TabaqatWorkshop")}
                    className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}30` }}
                  >
                    Download Excel ↓
                  </button>
                </div>

                {tabaqatError && (
                  <p className="text-xs mb-4" style={{ color: ORANGE }}>{tabaqatError}</p>
                )}

                <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${ORANGE}20` }}>
                  <div className="px-4 py-2 text-xs font-mono grid grid-cols-4 gap-3"
                    style={{ background: `${ORANGE}10`, color: ORANGE }}>
                    <span>Name</span><span>Email</span><span>Time</span><span>Date</span>
                  </div>
                  {tabaqatRecords.map((r, i) => (
                    <div key={i} className="px-4 py-3 grid grid-cols-4 gap-3 text-sm border-t"
                      style={{ borderColor: `${ORANGE}10`, background: i % 2 === 0 ? "transparent" : `${ORANGE}04` }}>
                      <span className="text-muted-foreground truncate" title={r.fullName}>{r.fullName || "—"}</span>
                      <span className="text-muted-foreground truncate" title={r.email}>{r.email || "—"}</span>
                      <span className="text-muted-foreground font-mono">{r.time}</span>
                      <span className="text-muted-foreground">{r.date}</span>
                    </div>
                  ))}
                  {tabaqatRecords.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted-foreground text-sm">No records yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Attendee view ──────────────────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <MoleculeNetwork />

      {/* Glow orbs */}
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)" }} />

      <div className="relative w-full max-w-md mx-auto px-6 py-16">
        {submitted ? (
          // ── Success state ──
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}40` }}>
              <CheckCircle className="w-10 h-10" style={{ color: TEAL }} />
            </div>
            <h2 className="font-display text-3xl font-black text-white mb-2">
              تم التسجيل! / Registered!
            </h2>
            <p className="text-muted-foreground mb-1">تم تأكيد حضورك بنجاح</p>
            <p className="text-muted-foreground text-sm">Your attendance has been confirmed.</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono"
              style={{ color: `${TEAL}80` }}>
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString(DATE_LOCALE, TIME_OPTS)}
              {" · "}
              {new Date().toLocaleDateString(DATE_LOCALE, { month: "short", day: "numeric", year: "numeric" })}
            </div>

            {/* Still offered after the main check-in succeeds — otherwise
                confirming attendance would hide the workshop button for good. */}
            <div className="text-left">{tabaqatButton}</div>
          </div>
        ) : (
          // ── Form ──
          <div>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="mb-4"><GradientEyebrow>SRC 2026 · KFUPM</GradientEyebrow></div>
              <h1 className="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                تسجيل الحضور
                <br />
                <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  Attendance Check-In
                </span>
              </h1>
              <p className="text-muted-foreground text-sm">
                أكد حضورك
                <br />
                Confirm your attendance
              </p>
            </div>

            {/* Identity first — nobody may confirm anything on this page
                without it, so it sits above both check-ins rather than inside
                either one. */}
            <div className="mb-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  الاسم / Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value.slice(0, MAX_NAME_CHARS))}
                  autoComplete="name"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  الإيميل / Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL_CHARS))}
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                />
                {email.length > 0 && !emailOk && (
                  <p className="text-[11px] mt-1.5" style={{ color: ORANGE }}>
                    Please enter a valid email address.
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
  {/* Confirmation checkbox */}
  <label
    className="flex items-center justify-center gap-4 rounded-xl p-5 cursor-pointer transition-all w-full" // 👈 تم تعديل items-center وإضافة justify-center لتوسيط كل شيء أفقياً وعمودياً
    style={{
      background: confirmed ? `${TEAL}08` : "rgba(255,255,255,0.03)",
      border: `1px solid ${confirmed ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
    }}
  >
    {/* تم إزالة mt-0.5 لكي لا ينزل المربع لأسفل ويصبح متناسقاً عمودياً مع النصين */}
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        className="sr-only"
        checked={confirmed}
        onChange={(e) => setConfirmed(e.target.checked)}
      />
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
        style={{
          background: confirmed ? TEAL : "rgba(255,255,255,0.06)",
          border: `2px solid ${confirmed ? TEAL : "rgba(255,255,255,0.2)"}`,
        }}
      >
        {confirmed && <CheckCircle className="w-4 h-4 text-[#07111E]" />}
      </div>
    </div>
    
    {/* تم تعديل محاذاة النصوص إلى text-center وتم إزالة dir="rtl" ليتوسط النص العربي والإنجليزي معاً */}
    <div className="text-center">
      <p className="font-semibold text-white text-sm mb-1 text-center">
       SRC 2026 أؤكد حضوري لفعالية 
      </p>
      <p className="text-muted-foreground text-xs text-center">
        I confirm my attendance at SRC 2026
      </p>
    </div>
  </label>

  {/* Error */}
  {error && (
    <p className="text-xs text-center" style={{ color: ORANGE }}>{error}</p>
  )}

  {/* Submit */}
  <button
    type="submit"
    disabled={!confirmed || !identityOk || submitting}
    className="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    style={{
      background: `linear-gradient(135deg, ${TEAL}, #08A8B8)`,
      color: "#07111E",
      boxShadow: !confirmed ? "none" : `0 0 30px -8px ${TEAL}`,
    }}
  >
    {submitting ? "جاري التسليم..." : "تأكيد الحضور / Confirm Attendance"}
  </button>
</form>

            {/* Workshop check-in — below the main button, outside the form, so
                it never submits the attendance form by accident. */}
            {tabaqatButton}

          </div>
        )}
      </div>
    </div>
  );
}

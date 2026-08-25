import { useState } from "react";
import { CheckCircle, Clock, Users } from "lucide-react";
import { TEAL, ORANGE } from "@/app/theme";
import { MoleculeNetwork, GradientEyebrow, Divider } from "@/app/components/common";

// ── Firestore ──────────────────────────────────────────────────────────────
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // نفس الملف اللي تستخدمه صفحة تسجيل الدخول

type AttendanceRecord = { time: string; date: string };

export function AttendancePage() {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ── Admin view (visit /attend?admin=1) ─────────────────────────────────────
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminLoaded, setAdminLoaded] = useState(false);

  const loadAdmin = async () => {
    setLoadingAdmin(true);
    try {
      const snap = await getDocs(collection(db, "attendance"));
      const data: AttendanceRecord[] = [];
      snap.forEach((doc) => {
        const d = doc.data();
        data.push({ time: d.time, date: d.date });
      });
      setRecords(data);
      setAdminLoaded(true);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const downloadCSV = () => {
    const header = "Time,Date";
    const rows = records.map((r) => `${r.time},${r.date}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SRC2026_Attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ── Submit attendance ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setSubmitting(true);
    setError("");

    const now = new Date();
    const time = now.toLocaleTimeString("en-SA", { hour: "2-digit", minute: "2-digit", hour12: true });
    const date = now.toLocaleDateString("en-SA", { year: "numeric", month: "long", day: "numeric" });

    try {
      await addDoc(collection(db, "attendance"), {
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
                  onClick={downloadCSV}
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: `${ORANGE}15`, color: ORANGE, border: `1px solid ${ORANGE}30` }}
                >
                  Download Excel ↓
                </button>
              </div>

              {/* Records list */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: `${TEAL}20` }}>
                <div className="px-4 py-2 text-xs font-mono grid grid-cols-2 gap-4"
                  style={{ background: `${TEAL}10`, color: `${TEAL}` }}>
                  <span>Time</span><span>Date</span>
                </div>
                {records.map((r, i) => (
                  <div key={i} className="px-4 py-3 grid grid-cols-2 gap-4 text-sm border-t"
                    style={{ borderColor: `${TEAL}10`, background: i % 2 === 0 ? "transparent" : `${TEAL}04` }}>
                    <span className="text-muted-foreground font-mono">{r.time}</span>
                    <span className="text-muted-foreground">{r.date}</span>
                  </div>
                ))}
                {records.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">No records yet.</div>
                )}
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
              {new Date().toLocaleTimeString("en-SA", { hour: "2-digit", minute: "2-digit", hour12: true })}
              {" · "}
              {new Date().toLocaleDateString("en-SA", { month: "short", day: "numeric", year: "numeric" })}
            </div>
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
    disabled={!confirmed || submitting}
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

          </div>
        )}
      </div>
    </div>
  );
}

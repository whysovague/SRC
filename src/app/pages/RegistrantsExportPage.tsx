import { useEffect, useState } from "react";
import { Download, Loader2, ShieldAlert, Users, Wrench } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, GlassCard, MoleculeNetwork } from "@/app/components/common";
import { db } from "../lib/firebase";
import { getAllWorkshopSignups, WORKSHOPS, type WorkshopId, type WorkshopSignup } from "../lib/workshops";

// ─── Registrant export ────────────────────────────────────────────────────────
// An unlisted page for the organising team: it downloads the `users` collection
// as a spreadsheet. Reached only by its URL — it is absent from the navbar, the
// footer and sitemap.xml, and carries a noindex tag so a crawler that finds the
// link anyway will not list it.
//
// The URL is the only thing guarding this. That is a deliberate choice, not an
// oversight, and it is worth understanding why it is defensible here: the
// `users` collection is already world-readable (`allow read: if true` in
// docs/firestore.rules), because login looks a registrant up by email straight
// from the browser. Anyone with the site's public Firebase config can already
// read these records. This page adds convenience, not exposure. If that rule is
// ever tightened, revisit this page too.
//
// Note what is NOT here: no registrant is rendered on screen. The page holds the
// rows in memory and writes them to a file. A shoulder-surfer, or a screenshot
// pasted into a group chat, gets a count and a button.

type Row = {
  fullName: string;
  email: string;
  createdAt: string;
  hasPhoto: boolean;
};

/** RFC 4180 escaping — a field containing a comma, quote or newline must be
 *  quoted, and any embedded quote doubled. Names and emails are user-supplied,
 *  so this cannot be skipped the way a fixed date/time column could. */
function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CRLF line endings and a UTF-8 BOM: without the BOM, Excel on Windows opens
 *  the file in the system codepage and mangles every non-Latin name. */
function buildCsv(header: string[], rows: string[][]): string {
  const lines = [header, ...rows].map((cells) => cells.map(csvCell).join(","));
  return "﻿" + lines.join("\r\n");
}

function toCsv(rows: Row[]): string {
  return buildCsv(
    ["Full Name", "Email", "Registered At", "Has Badge Photo"],
    rows.map((r) => [r.fullName, r.email, r.createdAt, r.hasPhoto ? "Yes" : "No"])
  );
}

/** Shared by both download buttons — building a Blob and clicking a temporary
 *  anchor is the only way to hand the browser a file we generated in memory. */
function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function RegistrantsExportPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  // Workshop registrations — a separate collection from `users`, loaded
  // independently so a failure on one does not blank the other.
  const [workshops, setWorkshops] = useState<Record<WorkshopId, WorkshopSignup[]> | null>(null);
  const [workshopError, setWorkshopError] = useState("");

  // Keep this page out of search results. index.html ships a site-wide
  // `<meta name="robots" content="index, follow, …">`, so this overwrites that
  // tag rather than appending a second one — two robots tags with opposite
  // values is ambiguous, and which one a crawler honours is not worth betting
  // 1,000 people's email addresses on. The original value is restored on the
  // way out, or every later route would inherit the noindex.
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = existing?.content ?? null;

    const meta = existing ?? document.createElement("meta");
    if (!existing) {
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";

    return () => {
      if (previous === null) meta.remove();
      else meta.content = previous;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const out: Row[] = [];

        snap.forEach((doc) => {
          const d = doc.data() as Record<string, unknown>;

          // createdAt is a Firestore Timestamp on every record written by the
          // registration flow, but older rows predate the field — fall back to
          // an empty cell rather than printing "Invalid Date".
          let created = "";
          const raw = d.createdAt as { toDate?: () => Date } | undefined;
          if (raw?.toDate) {
            const dt = raw.toDate();
            // YYYY-MM-DD HH:MM — sorts correctly as text in a spreadsheet.
            const pad = (n: number) => String(n).padStart(2, "0");
            created =
              `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ` +
              `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
          }

          out.push({
            fullName: String(d.fullName ?? "").trim(),
            email: String(d.email ?? "").trim(),
            createdAt: created,
            // The photo itself is a base64 data URL running to hundreds of
            // kilobytes. Only whether one exists goes in the spreadsheet.
            hasPhoto: Boolean(d.photoDataUrl),
          });
        });

        out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        if (!cancelled) setRows(out);
      } catch (e) {
        if (!cancelled) {
          setError(
            "Could not load the registrant list. Check the network connection, " +
            "or whether the Firestore rules for `users` have changed."
          );
          console.error("Registrant export failed:", e);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Loaded separately from the registrant list above: this collection is tiny,
  // so it resolves almost immediately rather than waiting on 1,000+ documents.
  useEffect(() => {
    let cancelled = false;
    getAllWorkshopSignups()
      .then((w) => { if (!cancelled) setWorkshops(w); })
      .catch((e) => {
        if (cancelled) return;
        console.error("Workshop registrations failed to load:", e);
        setWorkshopError(
          "Could not load workshop registrations — check that the `workshopSignups` Firestore rule is published."
        );
      });
    return () => { cancelled = true; };
  }, []);

  const today = () => new Date().toISOString().slice(0, 10);

  const download = () => {
    if (!rows) return;
    downloadCsv(toCsv(rows), `SRC2026_Registrants_${today()}.csv`);
  };

  const downloadWorkshop = (id: WorkshopId) => {
    const list = workshops?.[id] ?? [];
    const csv = buildCsv(
      ["Full Name", "Email", "Day", "Registered At"],
      list.map((r) => [r.fullName, r.email, r.sessionLabel, r.createdAt])
    );
    downloadCsv(csv, `SRC2026_${WORKSHOPS[id].replace(/\s+/g, "")}_${today()}.csv`);
  };

  const withPhoto = rows?.filter((r) => r.hasPhoto).length ?? 0;

  return (
    <div
      className="relative overflow-hidden pt-24 pb-28"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(12,191,206,0.03) 45%, transparent 100%)" }}
    >
      {/* Background — identical to Agenda/FAQ/Competitions */}
      <MoleculeNetwork />
      <div className="absolute -left-32 top-10 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${TEAL}2E 0%, transparent 65%)`, filter: "blur(60px)", animation: "faqFloat 14s ease-in-out infinite, faqGlow 9s ease-in-out infinite" }} />
      <div className="absolute right-[-9rem] bottom-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 65%)`, filter: "blur(70px)", animation: "faqDrift 18s ease-in-out infinite, faqGlow 11s ease-in-out infinite" }} />

      <div className="relative max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="faq-pop text-center">
          <div className="mb-7">
            <GradientEyebrow>Organising Team</GradientEyebrow>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            <span className="text-white">Registrant </span>
            <span style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Export</span>
          </h2>
          <div className="flex justify-center"><Divider /></div>
        </div>

        <GlassCard className="mt-10 p-8 md:p-10" delay={120}>
          <div className="relative text-center">

            {error ? (
              <p className="text-sm leading-relaxed" style={{ color: ORANGE }}>{error}</p>
            ) : rows === null ? (
              <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: TEAL }} />
                <span className="text-sm">Loading registrants…</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}2A` }}>
                    <Users className="w-6 h-6" style={{ color: TEAL }} />
                  </div>
                </div>

                <div className="font-display text-5xl font-extrabold leading-none mb-2"
                  style={{ background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {rows.length.toLocaleString()}
                </div>
                <div className="text-xs font-mono tracking-[0.24em] uppercase mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Registrants
                </div>
                <div className="text-sm text-muted-foreground mb-8">
                  {withPhoto.toLocaleString()} with a badge photo
                </div>

                <button
                  onClick={download}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-transform duration-200 hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(120deg, ${TEAL}, ${ORANGE})`,
                    boxShadow: `0 18px 40px -18px ${TEAL}`,
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download spreadsheet (.csv)
                </button>

                <p className="text-xs text-muted-foreground mt-5 leading-relaxed">
                  Opens directly in Excel, Numbers or Google Sheets.
                </p>
              </>
            )}
          </div>
        </GlassCard>

        {/* ── Workshop registrations ── one block per workshop, each with its
            own count and its own CSV, kept clearly apart from the conference
            registrant list above. */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-4 h-4" style={{ color: ORANGE }} />
            <span className="text-xs font-mono tracking-[0.28em] uppercase" style={{ color: ORANGE }}>
              Workshop Registrations
            </span>
          </div>

          {workshopError ? (
            <p className="text-sm leading-relaxed" style={{ color: ORANGE }}>{workshopError}</p>
          ) : workshops === null ? (
            <div className="flex items-center gap-3 py-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: ORANGE }} />
              <span className="text-sm">Loading workshop registrations…</span>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {(Object.keys(WORKSHOPS) as WorkshopId[]).map((id) => {
                const list = workshops[id];
                return (
                  <div key={id} className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ORANGE}2A` }}>
                    <div className="text-xs font-mono tracking-[0.18em] uppercase mb-2"
                      style={{ color: "var(--muted-foreground)" }}>
                      {WORKSHOPS[id]}
                    </div>
                    <div className="font-display text-4xl font-extrabold leading-none mb-4"
                      style={{ color: ORANGE }}>
                      {list.length.toLocaleString()}
                    </div>
                    <button
                      onClick={() => downloadWorkshop(id)}
                      disabled={list.length === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: `${ORANGE}15`,
                        color: ORANGE,
                        border: `1px solid ${ORANGE}35`,
                        opacity: list.length === 0 ? 0.4 : 1,
                        cursor: list.length === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download .csv
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Handling notice — the people in this file did not consent to it being
            passed around, so say so where whoever downloads it will read it. */}
        <div className="mt-6 flex items-start gap-3 rounded-xl px-5 py-4"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ORANGE}2A` }}>
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ORANGE }} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            This file holds every registrant's name and email address.
          </p>
        </div>

      </div>
    </div>
  );
}

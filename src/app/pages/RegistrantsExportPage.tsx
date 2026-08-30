import { useEffect, useState } from "react";
import { Download, Loader2, ShieldAlert, Users } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";

import { TEAL, ORANGE } from "@/app/theme";
import { Divider, GradientEyebrow, GlassCard, MoleculeNetwork } from "@/app/components/common";
import { db } from "../lib/firebase";

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

function toCsv(rows: Row[]): string {
  const header = ["Full Name", "Email", "Registered At", "Has Badge Photo"];
  const body = rows.map((r) =>
    [r.fullName, r.email, r.createdAt, r.hasPhoto ? "Yes" : "No"].map(csvCell).join(",")
  );
  // CRLF line endings and a UTF-8 BOM: without the BOM, Excel on Windows opens
  // the file in the system codepage and mangles every non-Latin name.
  return "﻿" + [header.map(csvCell).join(","), ...body].join("\r\n");
}

export function RegistrantsExportPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

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

  const download = () => {
    if (!rows) return;
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SRC2026_Registrants_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

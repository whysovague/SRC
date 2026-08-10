// ─── Confirmation email ───────────────────────────────────────────────────────
// Firebase cannot send email from the browser, and Cloud Functions / the
// Trigger Email extension both require the Blaze billing plan. EmailJS sends
// straight from the client on the free plan, so that is what this uses.
//
// The email body itself lives in the EmailJS dashboard, not in this repo —
// see docs/email-template.html for the HTML to paste in, and
// docs/EMAIL_SETUP.md for the full setup.
//
// IMPORTANT: like lib/firebase.ts, nothing here ever throws at module scope or
// out of the send call. A registration must never fail because email did not go
// out — the row is already safely in Firestore by the time we get here.

import emailjs from "@emailjs/browser";

import { EVENT, EVENT_LOCATION, EVENT_VENUE_LINE } from "./event";
import { withTimeout } from "./async";

/** EmailJS posts with a plain fetch and no AbortSignal, so a stalled
 *  connection would otherwise hang until the browser gives up (minutes). */
const SEND_TIMEOUT_MS = 15_000;

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/** False when the VITE_EMAILJS_* variables are missing — the UI uses this to
 *  avoid promising an email that cannot be sent. */
export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

if (!emailConfigured) {
  console.warn(
    "EmailJS is not configured: missing VITE_EMAILJS_* environment variables " +
    "(see .env.example and docs/EMAIL_SETUP.md). Registration still works, but " +
    "no confirmation email will be sent."
  );
}

/** Public origin of the deployed site, e.g. "https://srcsa26.com".
 *
 *  Set VITE_SITE_URL and emailed links always point at production, even when
 *  the email is triggered from a dev server. Without it we fall back to
 *  whatever origin the browser is on — which means testing on localhost sends
 *  people a http://localhost:5173 link that only works on your own machine.
 */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");

/** Public origin of the site, used for links in the email body. */
export function siteUrl(): string {
  return SITE_URL || (typeof window !== "undefined" ? window.location.origin : "https://srcsa26.com");
}

/**
 * Parameter name of the badge attachment.
 *
 * This string has to match three places or the send fails:
 *   1. this template parameter,
 *   2. the "Parameter Name" of the Variable Attachment in the EmailJS
 *      template's Attachments tab,
 *   3. the CID in the template HTML — `<img src="cid:badge">`.
 *
 * If it does not match, EmailJS treats the base64 as ordinary text and rejects
 * the send with "maximum allowed variables size is 50Kb" — which reads like a
 * size problem but is really a naming one.
 */
export const BADGE_PARAM = "badge";

export type ConfirmationInput = {
  fullName: string;
  email: string;
  /** "Visitor" / "Competition Participant" — shown in the email. */
  registrationType: string;
  /** Competition title, or null for a plain visitor registration. */
  competition?: string | null;
  /** Badge as a JPEG data URL. Omitted if rendering failed — the email still
   *  goes out, just without the attachment. */
  badgeDataUrl?: string | null;
  /** Filename the recipient sees on the attachment. */
  badgeFilename?: string;
};

/**
 * Send the registration confirmation. Resolves to true when EmailJS accepted
 * the message, false on any failure — never rejects.
 */
export async function sendConfirmationEmail(input: ConfirmationInput): Promise<boolean> {
  if (!emailConfigured) return false;

  const params: Record<string, string> = {
    // Recipient — the EmailJS template's "To Email" field must be {{to_email}}.
    to_email: input.email,
    to_name: input.fullName || input.email,

    // Their details, echoed back so the email is self-contained.
    reg_email: input.email,
    // One combined line: EmailJS templates substitute variables but cannot
    // do conditionals, so an empty competition would leave a stray blank
    // row. Joining them here keeps the template dumb.
    reg_type: input.competition
      ? `${input.registrationType} — ${input.competition}`
      : input.registrationType,

    // Event details.
    event_name: EVENT.name,
    event_full_name: EVENT.fullName,
    event_dates: EVENT.dates,
    event_location: EVENT_LOCATION,
    event_venue: EVENT.venue,
    event_venue_line: EVENT_VENUE_LINE,
    event_doors: EVENT.doorsOpen,
    support_email: EVENT.supportEmail,
    site_url: siteUrl(),
    badge_filename: input.badgeFilename ?? "src-2026-badge.jpg",
  };

  // The badge rides along as a Variable Attachment. The template embeds it
  // inline with <img src="cid:badge"> and the recipient also gets it as a
  // downloadable file. Omitted entirely when rendering failed, so the email
  // still sends rather than erroring on a missing parameter.
  if (input.badgeDataUrl) {
    params[BADGE_PARAM] = input.badgeDataUrl;
  }

  try {
    await withTimeout(
      emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY }),
      SEND_TIMEOUT_MS
    );
    return true;
  } catch (e) {
    // Logged, not surfaced: the registration itself already succeeded.
    console.error("Confirmation email failed to send:", e);
    return false;
  }
}

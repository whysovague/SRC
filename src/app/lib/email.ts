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

import { EVENT, EVENT_LOCATION } from "./event";
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

/** Absolute URL of the "complete your profile" page for one registrant. */
export function profileUrl(token: string): string {
  const origin =
    SITE_URL || (typeof window !== "undefined" ? window.location.origin : "https://srcsa26.com");
  return `${origin}/complete-profile?t=${encodeURIComponent(token)}`;
}

export type ConfirmationInput = {
  fullName: string;
  email: string;
  /** "Visitor" / "Competition Participant" — shown in the email. */
  registrationType: string;
  /** Competition title, or null for a plain visitor registration. */
  competition?: string | null;
  /** Token that lets the recipient open their profile page from the email. */
  profileToken: string;
};

/**
 * Send the registration confirmation. Resolves to true when EmailJS accepted
 * the message, false on any failure — never rejects.
 */
export async function sendConfirmationEmail(input: ConfirmationInput): Promise<boolean> {
  if (!emailConfigured) return false;

  try {
    await withTimeout(
      emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
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
          event_doors: EVENT.doorsOpen,
          support_email: EVENT.supportEmail,

          // The call to action.
          profile_url: profileUrl(input.profileToken),
        },
        { publicKey: PUBLIC_KEY }
      ),
      SEND_TIMEOUT_MS
    );
    return true;
  } catch (e) {
    // Logged, not surfaced: the registration itself already succeeded.
    console.error("Confirmation email failed to send:", e);
    return false;
  }
}

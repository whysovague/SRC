# Confirmation email & shareable badge — setup

When someone submits the registration form they get a confirmation email
containing the event dates, the location, their own name and email, and a
personalised **"See you in Dhahran" badge** — shown inline in the email body and
attached as a JPEG they can download and post.

The badge is drawn in the browser at submit time. If they uploaded a photo it
goes in the circle; if not, their name is set large in the panel instead.

---

## Why EmailJS

Firebase cannot send email from the browser. The two Firebase-native options —
Cloud Functions and the *Trigger Email from Firestore* extension — both require
the **Blaze** (pay-as-you-go) billing plan. This project is on **Spark**, so the
email is sent client-side through EmailJS instead.

### ⚠️ The Personal plan is required

**Attachments are not available on the EmailJS free tier.** Without them the
email still sends, but with no badge — which is most of the point. The Personal
plan is **$9/month** and allows attachments up to **500 KB**.

The quota matters too. Free is 200 emails/month and the account's window
**resets on 9 September** — *after* the conference (31 Aug – 2 Sep). Personal
raises that to 2,000. Since you only need it for one billing cycle, the whole
thing costs $9–18 and can be cancelled afterwards.

**Upgrade before registration is announced publicly.** Running out mid-surge
fails gracefully — the registration still saves and the modal says "Confirmation
email pending" rather than lying — but you would be hand-emailing the overflow.

---

## 1. The EmailJS service

| | |
|---|---|
| Service | Gmail, connected as `aiche.kfupm@gmail.com` |
| Service ID | in the EmailJS dashboard → Email Services |
| Template ID | in the EmailJS dashboard → Email Templates |
| Template name | SRC 2026 Confirmation |

> The actual IDs and public key are deliberately **not** written down here.
> They are already readable in the production JS bundle — that is unavoidable
> with client-side EmailJS — but there is no reason to also commit them to git,
> where they would stay in the history forever even if deleted later.
>
> Get them from the EmailJS dashboard, or from Vercel → Settings →
> Environment Variables. What actually protects the account is **Allowed
> Origins**, not keeping the key out of sight. Set it to `https://srcsa26.com`,
> `https://www.srcsa26.com` and `http://localhost:5173`.

### Why not aiche@kfupm.edu.sa

That was the first choice and it does not work. KFUPM runs its own mail
infrastructure — `kfupm.edu.sa` MX points at `mx3–mx6.kfupm.edu.sa`, and
`autodiscover.kfupm.edu.sa` resolves, which means on-premises Exchange. So:

- **Gmail service** — rejected, the address is not a Google account.
- **Outlook service** — rejected, that is for outlook.com / Microsoft 365 cloud
  mailboxes, not on-prem Exchange.
- **SMTP service** — the connection to `smtp.kfupm.edu.sa:587` *succeeded*, so
  the network path is open, but authentication returned `535 5.7.3`. Retrying
  then produced `Greeting never received`, which looks like the firewall
  temporarily blocking the IP after failed logins.

The likely cause is SMTP AUTH being disabled on that mailbox (Exchange default,
and automatic if the account has MFA). Reviving it needs KFUPM IT:

> We need to send automated registration confirmations for SRC 2026 from
> `aiche@kfupm.edu.sa` through an external service. Can you enable
> authenticated SMTP submission (SMTP AUTH) for that mailbox on
> `smtp.kfupm.edu.sa:587`, and confirm the expected username format?

**If IT enables it, switching costs one line:** add the SMTP service in EmailJS
and change `VITE_EMAILJS_SERVICE_ID`. No code change.

Meanwhile `Reply To` on the template is `aiche@kfupm.edu.sa`, so registrants who
hit reply still reach the chapter inbox even though the visible sender is Gmail.

---

## 2. The template

Rebuilding it from scratch, if you ever need to:

1. **Email Templates → Create New Template** (any starter — it all gets replaced).
2. **Edit Content** → the editor is already raw HTML. Select all, and paste in
   [`emailjs-paste-this.html`](./emailjs-paste-this.html) — that is
   `email-template.html` with the wrapper and comments stripped, ready to paste.
3. In the right-hand panel of the **Content** tab:

   | Field | Value |
   |---|---|
   | To Email | `{{to_email}}` |
   | Subject | `You're registered for SRC 2026 — here's your badge` |
   | From Name | `SRC 2026` |
   | From Email | leave "Use Default Email Address" ticked |
   | Reply To | `aiche@kfupm.edu.sa` |
   | Bcc / Cc | empty |

4. In the **Attachments** tab, add one **Variable Attachment**:

   | Field | Value |
   |---|---|
   | Parameter Name | `badge` |
   | Filename | `{{badge_filename}}` |
   | Content Type | Image (JPEG) |

5. **Account → General** for the Public Key.

> ### Two things that silently break this
>
> **`To Email` must be `{{to_email}}`.** The starter template puts a fixed
> address there. Leave it and every confirmation goes to that one inbox instead
> of the registrant.
>
> **The attachment parameter must be exactly `badge`.** That string appears in
> three places and they have to agree: the Attachments tab, the `cid:badge` in
> the template HTML, and `BADGE_PARAM` in `src/app/lib/email.ts`. If they don't
> match, EmailJS treats the base64 as an ordinary text variable and rejects the
> send with **"maximum allowed variables size is 50Kb"** — which reads like a
> size problem but is really a naming one.

---

## 3. Environment variables

These live in **`.env.local`**, alongside the existing `VITE_FIREBASE_*` values.
That file is gitignored, so every teammate has to add them to their own copy,
and they must also be set in Vercel → Settings → Environment Variables.

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
VITE_SITE_URL=https://srcsa26.com
```

**Restart the dev server afterwards** — Vite reads env files only at startup.

**Vercel bakes them in at build time, not runtime.** Adding a variable does
nothing to an existing deployment; you must redeploy after saving.

### The host must rewrite deep URLs to index.html

The site is a single-page app with real URLs. React Router resolves `/faq` in
the browser, but the host is asked for a file at that path first, finds none,
and 404s. `vercel.json` in the repo root fixes this. Verify after deploying by
opening `https://srcsa26.com/faq` directly in a fresh tab — if it loads the FAQ
rather than a 404, the rewrite is working.

---

## 4. Firestore rules

Publish [`firestore.rules`](./firestore.rules) from the Firebase console.
`registrations` is unchanged from the original; `users` gains a narrow `update`
permission so a repeat registration can fill in a missing name or store a new
badge photo.

> ### ⚠️ Read this before the conference
>
> `allow read: if true` on `users` means **anyone can download every
> registrant's name and email address** by querying the collection from a
> browser console. That is not something these rules introduced — the existing
> login flow already requires it, because looking a user up by email happens
> client-side with no authentication.
>
> It is a real data-protection problem for a live event with hundreds of
> attendees. The fix is to move lookups behind Firebase Auth (`lib/auth.ts` is
> already written for this) or behind a Cloud Function. Both need decisions
> beyond the scope of this change, so it is flagged here rather than silently
> changed.

---

## How the pieces fit

| File | Role |
|---|---|
| `src/app/lib/event.ts` | Dates, venue, city, support address — the only place to edit them. |
| `src/app/lib/badge.ts` | Draws the badge on a canvas. All geometry constants live here. |
| `src/assets/badge-plate.jpg` | The Canva artwork with the name and photo removed. |
| `src/app/lib/email.ts` | Builds the template variables, attaches the badge, calls EmailJS. Never throws. |
| `src/app/lib/image.ts` | Crops and shrinks the uploaded photo in the browser. |
| `src/app/lib/async.ts` | `withTimeout` — Firestore writes never reject when offline, so everything the user waits on gets a deadline. |
| `src/app/lib/users.ts` | One `users` document per email; stores the photo. |
| `docs/email-template.html` | Source of the email, with setup notes in the header comment. |
| `docs/emailjs-paste-this.html` | The same thing, stripped and ready to paste. |

### Changing the badge artwork

Re-export the Canva design **with the name text and photo circle deleted**, save
it over `src/assets/badge-plate.jpg`, and check the geometry constants at the
top of `lib/badge.ts` still line up. They are in the plate's own 2100 × 1200
coordinate space and were measured by diffing the finished Canva variants
against the empty plate.

If you move the name or the photo circle in Canva, those constants must move
with it — nothing detects the change automatically.

---

## Note for the npm/pnpm split

This work added two dependencies: `@emailjs/browser` and `@fontsource/anton`
(the badge's headline face, self-hosted so the canvas never races a CDN). They
were installed with **npm**, so only `package-lock.json` is updated. Whoever on
the team uses pnpm needs to run `pnpm install` once, otherwise their install
will not have the packages and the build will fail on the missing imports.

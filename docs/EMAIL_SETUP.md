# Confirmation email & profile completion — setup

When someone submits the registration form they now get a confirmation email
containing the event dates, the location, their own name and email, and a button
that opens `/complete-profile?t=<token>` where they confirm the name on their
badge and optionally upload a photo.

Nothing here is automatic. Until the four steps below are done, registration
still works exactly as before and the app just logs a console warning instead of
sending anything.

---

## Why EmailJS

Firebase cannot send email from the browser. The two Firebase-native options —
Cloud Functions and the *Trigger Email from Firestore* extension — both require
the **Blaze** (pay-as-you-go) billing plan. This project is on **Spark**, so the
email is sent client-side through EmailJS instead.

### ⚠️ The quota is the thing to watch

The free tier is **200 emails per month**, and the account's window **resets on
9 September** — *after* the conference (31 Aug – 2 Sep). So those 200 have to
cover every registration from now through the event itself. There is no
mid-conference reset to rescue you.

The **Personal** plan is $9/month for 2,000 requests, which is far more headroom
than this event needs. Since you only need it for one billing cycle, the whole
thing costs $9–18 and can be cancelled afterwards.

**Upgrade before registration is announced publicly, not after.** Running out
mid-surge fails gracefully — the registration still saves and the modal says
"Confirmation email pending" rather than lying — but you would be hand-emailing
the overflow.

Note that "requests" is one shared pool. Today that is one confirmation per
registration. Adding a reminder email, a Bcc to the chapter inbox, or a
"resend my link" button would each draw from the same allowance.

---

## 1. Create the EmailJS service — done

Already configured, recorded here so it can be rebuilt if the account is lost.

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
> Origins** (see below), not keeping the key out of sight.

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

The likely cause is SMTP AUTH being disabled on that mailbox (Exchange
default, and automatic if the account has MFA). Reviving it needs KFUPM IT:

> We need to send automated registration confirmations for SRC 2026 from
> `aiche@kfupm.edu.sa` through an external service. Can you enable
> authenticated SMTP submission (SMTP AUTH) for that mailbox on
> `smtp.kfupm.edu.sa:587`, and confirm the expected username format?

**If IT enables it, switching costs one line:** add the SMTP service in
EmailJS and change `VITE_EMAILJS_SERVICE_ID` in `.env.local`. No code change.

Until then, `Reply To` on the template is set to `aiche@kfupm.edu.sa`, so
registrants who hit reply still reach the chapter inbox even though the visible
sender is the Gmail address.

### Rebuilding the template from scratch

1. **Email Templates → Create New Template** (any starter — it all gets replaced).
2. **Edit Content** → the editor is already raw HTML. Select all, and paste in
   [`emailjs-paste-this.html`](./emailjs-paste-this.html) — that is
   `email-template.html` with the wrapper and comments stripped, ready to paste.
3. In the right-hand panel of the **Content** tab set:

   | Field | Value |
   |---|---|
   | To Email | `{{to_email}}` |
   | Subject | `You're registered for SRC 2026 — confirm your badge` |
   | From Name | `SRC 2026` |
   | From Email | leave "Use Default Email Address" ticked |
   | Reply To | `aiche@kfupm.edu.sa` |
   | Bcc / Cc | empty |

4. **Account → General** for the Public Key.

> `To Email` **must** be `{{to_email}}`. The starter template puts a fixed
> address there, and if it is left alone every confirmation goes to that one
> inbox instead of the registrant. This is the single easiest thing to get
> wrong.

---

## 2. Environment variables — done locally

These live in **`.env.local`**, alongside the existing `VITE_FIREBASE_*` values.
That file is gitignored, so every teammate has to add them to their own copy,
and they must also go into the host's build environment when you deploy
(Netlify and Vercel both have a variables panel).

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
VITE_SITE_URL=https://srcsa26.com
```

Real values: EmailJS dashboard, or Vercel → Settings → Environment Variables
(the EmailJS ones are marked Sensitive there, so read them from EmailJS).

`VITE_SITE_URL` is what the "Complete my profile" button in the email points
at. Without it the link is built from whatever origin the browser is on, so an
email triggered from a dev server sends the recipient a `http://localhost:5173`
link that only works on the machine that sent it. Set it and emailed links
always point at production, wherever the send happened.

### The host must rewrite deep URLs to index.html

This is not optional and it is currently broken in production: as of this
writing `https://srcsa26.com/faq` and `https://srcsa26.com/complete-profile`
both return **404**, while `https://srcsa26.com/` loads fine.

The site is a single-page app with real URLs. React Router resolves `/faq` in
the browser, but the host is asked for a file at that path first, finds none,
and 404s. That breaks refreshing on any page, sharing a link to any page, and —
critically — the button in every confirmation email, which opens a deep URL
straight from the inbox.

Two config files are in the repo; use whichever matches your host and delete
the other:

| Host | File |
|---|---|
| Netlify / Cloudflare Pages | `public/_redirects` (Vite copies it to `dist/`) |
| Vercel | `vercel.json` |
| Nginx | `try_files $uri $uri/ /index.html;` |
| Apache | `.htaccess` with `FallbackResource /index.html` |
| GitHub Pages | copy `dist/index.html` to `dist/404.html` after build |

Verify after deploying by opening `https://srcsa26.com/faq` directly in a fresh
tab. If it loads the FAQ page rather than a 404, the rewrite is working and the
email button will work too.

**Restart the dev server afterwards** — Vite reads env files only at startup,
so editing while `npm run dev` is running changes nothing.

The public key is not a secret; EmailJS is designed for it to ship in the
frontend bundle. Protect it by turning on **Account → Security → Allowed
Origins** and listing only your real domain plus `http://localhost:5173`.
Without that, anyone who reads your bundle can send email through your quota.

---

## 3. Update the Firestore security rules

The profile page reads a user document by token and writes back to it, so the
rules must allow that. In **Firebase Console → Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /registrations/{id} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    match /users/{id} {
      // The app has no Firebase Auth, so email- and token-lookups are
      // unauthenticated queries. See the warning below.
      allow read: if true;
      allow create: if true;
      allow delete: if false;

      // Only these fields may ever change, and each is validated only when it
      // is actually being written — a token backfill on a legacy document must
      // not be rejected because that document has no fullName.
      allow update: if
        request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['fullName', 'photoDataUrl', 'profileComplete',
                      'profileUpdatedAt', 'profileToken'])
        && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['fullName'])
            || (request.resource.data.fullName is string
                && request.resource.data.fullName.size() > 1
                && request.resource.data.fullName.size() <= 120))
        && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['photoDataUrl'])
            || (request.resource.data.photoDataUrl is string
                && request.resource.data.photoDataUrl.size() <= 700000));
    }
  }
}
```

> ### ⚠️ Read this before the conference
>
> `allow read: if true` on `users` means **anyone can download every
> registrant's name and email address** by querying the collection from a
> browser console. That is not something these rules introduced — the existing
> login flow already requires it, because looking a user up by email happens
> client-side with no authentication.
>
> It is a real data-protection problem for a live event with hundreds of
> attendees, and it is worth fixing before you launch. The fix is to move
> lookups behind Firebase Auth (`lib/auth.ts` is already written for this) or
> behind a Cloud Function. Both need decisions beyond the scope of this change,
> so it is flagged here rather than silently changed.

---

## 4. Test it

1. `npm run dev`
2. Register with an address you can check.
3. You should see **"Confirmation sent to …"** on the success screen. If it says
   **"Confirmation email pending"** instead, open the browser console — the
   reason is logged there.
4. Open the email, click **Complete my profile**, set a name, upload a photo,
   save.
5. In Firestore, the `users` document should now have `fullName`,
   `profileComplete: true` and a `photoDataUrl` starting with
   `data:image/jpeg;base64,`.

### If the email doesn't arrive

| Symptom | Cause |
|---|---|
| Console: `EmailJS is not configured` | The `VITE_EMAILJS_*` variables aren't set, or the dev server wasn't restarted. |
| Console: `The Public Key is invalid` | Wrong key, or the current origin isn't in EmailJS's Allowed Origins list. |
| Sent, but never arrives | Check spam. Gmail-connected services often land there until the address has some sending history. |
| `Request had insufficient authentication` on save | The Firestore rules from step 3 haven't been published. |

---

## How the pieces fit

| File | Role |
|---|---|
| `src/app/lib/event.ts` | Dates, venue, city, support address — the only place to edit them. |
| `src/app/lib/email.ts` | Builds the template variables and calls EmailJS. Never throws. |
| `src/app/lib/image.ts` | Crops and shrinks the photo to a 400×400 JPEG in the browser. |
| `src/app/lib/users.ts` | Mints the `profileToken`, looks users up by it, saves the profile. |
| `src/app/pages/CompleteProfilePage.tsx` | The page the email button opens. |
| `docs/email-template.html` | The HTML you paste into EmailJS. |

### About the token

Each `users` document gets a random 128-bit `profileToken` when it is created.
The emailed link is the only credential the profile page accepts — it is a
**bearer token**, so whoever holds the link can edit that one profile. That is
the standard trade-off for a "click straight through from your inbox" flow, and
it is why the email footer asks people not to forward it. Nothing else in the
app is reachable with the token.

Registrants who signed up before this change have no token. `createUserIfNotExists`
backfills one the next time they register, and `ensureProfileToken()` in
`lib/users.ts` can be called directly if you need to email the existing list.

---

## Note for the npm/pnpm split

This change adds one dependency, `@emailjs/browser`. It was installed with
**npm**, so only `package-lock.json` is updated. Whoever on the team uses pnpm
needs to run `pnpm install` once to refresh `pnpm-lock.yaml`, otherwise their
install will not have the package.

# Test plan — confirmation email & shareable badge

Work through these in order. Tests 1–4 are the ones that matter; the rest are
edge cases that are quick to check and each one has bitten a real project before.

Before starting:

- EmailJS on the **Personal plan** (attachments do not exist on free)
- The template's **Attachments** tab has a Variable Attachment named `badge`
- Firestore rules published (`docs/firestore.rules`)
- `.env.local` has the four `VITE_*` values from `EMAIL_SETUP.md`
- Dev server **restarted** since editing `.env.local`
- Browser console open (F12) — most failures announce themselves there

Have two email addresses ready: your own, and any second one you can open
(a `+tag` alias works: `you+src1@gmail.com`, `you+src2@gmail.com`).

---

## 1. Happy path — Visitor, no photo

**Register** → Visitor → fill in:

| Field | Value |
|---|---|
| Full Name | `Faisal Alqahtani` |
| Email | `you+src1@gmail.com` |
| Organization | `KFUPM` |
| Position | `Student` |
| Country | `Saudi Arabia` |

Leave the badge photo empty. Review → Submit.

**Expect:**

1. "You're registered!" appears **immediately** — it must not wait on the email
2. The badge renders on the success screen within a second or two, showing
   **FAISAL** on one line and **ALQAHTANI** on the next, with the light streak
   beneath
3. **Download badge** saves `src-2026-badge-faisal-alqahtani.jpg`
4. The pill changes from "Sending your confirmation…" to "Confirmation sent to…"
5. Email arrives (check spam) with the badge **visible inline in the body**
6. The same badge is **attached** as a downloadable `.jpg`
7. No literal `{{...}}` anywhere in the email

---

## 2. Happy path — with a photo

Register as `you+src2@gmail.com`, this time uploading a clear headshot.

**Expect:** the badge uses the photo layout — face in the circle with the blue
glow ring, and **FAISAL ALQAHTANI** on one line beneath it. Not the two-line
name layout.

Check the photo is **centre-cropped, not squashed**. Try a portrait phone photo
(taller than wide) — the crop should take the middle, not letterbox it.

---

## 3. Competition Participant

**Register** → Competition Participant → **ChemE Jeopardy** → fill in the team
captain fields.

**Expect:** the email's **Type** row reads

```
Competition Participant — ChemE Jeopardy
```

and the badge uses the **Team Captain Name**, since that's where the name lives
for this form.

---

## 4. Repeat registration

Register **again** with `you+src1@gmail.com` — same address as test 1 — this
time for **Poster Competition**, and upload a photo.

**Expect:**

- The email sends, and the badge now has the photo
- Firestore has **one** `users` doc for that address, not two
- That doc's `photoDataUrl` has been **updated** to the new photo
- Its `fullName` is unchanged — a repeat registration must not overwrite a name
  that is already set

---

## 5. Long and short names

On the success screen, check the badge for:

| Name | Expect |
|---|---|
| `Abdulrahman Mohammed Al-Otaibi` | Shrinks to fit — smaller, but nothing clipped or overflowing |
| `Zayd` | Single line, vertically centred between where the two lines would be |
| `محمد` or any non-Latin name | See below |

Anton has no Arabic glyphs, so an Arabic name falls back to a system font and
may look inconsistent. If registrants are likely to enter Arabic names, that
needs a second font — raise it rather than discovering it on the day.

---

## 6. Photo rejection paths

In the registration form, click Upload photo and try:

| File | Expect |
|---|---|
| A `.pdf` or `.txt` | Not selectable, or "That file type isn't supported." |
| An `.svg` | Rejected — this one silently stored a broken image before it was fixed |
| A photo over 10 MB | "That image is larger than 10 MB." |
| A normal phone photo (3–8 MB) | Accepted, appears in the circle within a second |

Then **re-select the exact same file you were just rejected for**. It must
respond — if nothing happens at all, the file input isn't clearing.

---

## 7. Attachment size

In Firestore, check a `photoDataUrl` after a photo registration: a 400×400 JPEG
should be roughly **30,000–80,000 characters**. If it is 6 characters
(`data:,`) something is broken.

The badge itself lands around **260–300 KB base64**, well under EmailJS's
500 KB. If you ever change the plate artwork to something busier, re-check —
`lib/badge.ts` steps the JPEG quality down automatically, but a much heavier
image would come out visibly softer.

---

## 8. Badge failure must not lose the email

Simulate a broken badge: in DevTools → Network, block the request for
`badge-plate*.jpg`, then register.

**Expect:** the registration saves, the email still sends (without the
attachment), and the success screen simply shows no badge. A badge failure must
never cost someone their confirmation.

---

## 9. Existing login still works

- Modal → "Already registered? Log in here"
- Enter the name and email from test 1
- **Expect:** logs in, navbar shows "Welcome, Faisal Alqahtani 👋"
- Log out, then try an email that was never registered → "This email is not
  registered."

**No email should be sent by logging in.** If one arrives, something is wrong.

---

## 10. Slow / offline behaviour

DevTools → Network → **Offline**, then submit a registration.

**Expect:** an error message within about 10 seconds — *not* a button stuck on
"Submitting…" forever.

Set it back to **Online** afterwards.

---

## 11. Deployed routes

After deploying, in a fresh tab:

- `https://srcsa26.com/faq` → loads the FAQ, **not** a 404
- `https://srcsa26.com/competitions` → loads, and survives a refresh

If either 404s, `vercel.json` isn't in the deployed commit.

---

## Watch the quota

Every test above burns one of your monthly emails. A full pass costs roughly
8–10. Check the counter at the top of the EmailJS dashboard as you go.

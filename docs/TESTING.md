# Test plan — confirmation email & badge profile

Work through these in order. Tests 1–3 are the ones that matter; 4–10 are edge
cases that are quick to check and each one has bitten a real project before.

Before starting:

- Firestore rules published (`docs/firestore.rules`)
- `.env.local` has the three `VITE_EMAILJS_*` values
- Dev server **restarted** since editing `.env.local`
- Browser console open (F12) — most failures announce themselves there

Have two email addresses ready: your own, and any second one you can open
(a `+tag` alias works: `you+src1@gmail.com`, `you+src2@gmail.com`).

---

## 1. Happy path — Visitor

The main flow. If this works, the feature works.

**Register** → Visitor → fill in:

| Field | Value |
|---|---|
| Full Name | `Test Visitor One` |
| Email | `you+src1@gmail.com` |
| Organization | `KFUPM` |
| Position | `Student` |
| Country | `Saudi Arabia` |

Review → Submit.

**Expect:**

1. "You're registered!" appears **immediately** — it must not wait on the email
2. A teal "Sending your confirmation…" pill, which becomes "Confirmation sent to you+src1@gmail.com"
3. Email arrives (check spam) from **SRC 2026**, dark background, teal header
4. It shows `Test Visitor One`, `you+src1@gmail.com`, `Visitor`,
   `31 August – 2 September 2026`, `King Fahd University of Petroleum & Minerals`,
   `KFUPM, Dhahran, Saudi Arabia`, `8:30 AM (AST), Monday 31 August`
5. No literal `{{...}}` anywhere in the email
6. Firestore `users` has one new doc with `profileToken` and `profileComplete: false`

**Then click "Complete my profile":**

7. Lands on `/complete-profile?t=<32 hex chars>`
8. Shows your email, the dates, the location; name prefilled with `Test Visitor One`
9. Change the name to `Test Visitor Won`, upload a photo, Save
10. "You're all set" with the photo shown as a circle
11. Firestore doc now has `fullName: Test Visitor Won`, `profileComplete: true`,
    `photoDataUrl` starting `data:image/jpeg;base64,`, and a `profileUpdatedAt`

> The name **changed** between registration and profile — that is the point of
> the page. The badge should read what they typed in step 9, not step 1.

---

## 2. Happy path — Competition Participant

Checks that the competition name reaches the email, and that a different form
shape still finds the name and email fields.

**Register** → Competition Participant → **ChemE Jeopardy** → fill in:

| Field | Value |
|---|---|
| University Name | `KFUPM` |
| Team Captain Name | `Test Captain` |
| Team Captain Email | `you+src2@gmail.com` |
| Team Captain Phone | `0500000000` |
| Members 1–4 | `A ChemE`, `B ChemE`, `C ChemE`, `D ChemE` |
| AIChE confirmation | ticked |

**Expect:** the email's **Type** row reads

```
Competition Participant — ChemE Jeopardy
```

not just "Competition Participant", and not with a trailing dash.

---

## 3. Repeat registration — the one the old rules broke

This is the important regression test. Under the previous rules
(`allow update: if false`) this case silently sent no email at all.

Register **again** with `you+src1@gmail.com` — same address as test 1, this
time as a Competition Participant for **Poster Competition**.

**Expect:**

- The confirmation email still sends
- Firestore has **one** `users` doc for that address, not two
- Its `profileToken` is **unchanged** from test 1 — so the older emailed link
  still works
- `fullName` is still `Test Visitor Won` — a repeat registration must not
  overwrite a name the person deliberately set on their profile page

### 3b. A pre-existing user

If your `users` collection has documents from before today, they have no
`profileToken` at all. Register with one of those addresses.

**Expect:** the email sends, and the document gains a `profileToken`. This is
the backfill path — it is what most of your existing registrants will hit.

---

## 4. Badge name is mandatory

On the profile page, clear the name field.

**Expect:** "Save my profile" greys out and cannot be clicked. Type one
character `A` — still greyed, with "Please enter your full name." underneath.
Two characters enables it.

---

## 5. Photo is genuinely optional

Fresh registration, open the profile link, set only a name, Save.

**Expect:** saves fine. Firestore has `profileComplete: true` and no
`photoDataUrl` (or an empty one). Nothing errors.

---

## 6. Photo rejection paths

On the profile page, click Upload photo and try:

| File | Expect |
|---|---|
| A `.pdf` or `.txt` | Not selectable, or "That file type isn't supported." |
| An `.svg` | Rejected — this one silently stored a broken image before it was fixed |
| A photo over 10 MB | "That image is larger than 10 MB." |
| A normal phone photo (3–8 MB) | Accepted, appears in the circle within a second or two |

Then **re-select the exact same file you were just rejected for**. It must
respond — if nothing happens at all, the file input isn't clearing.

After a successful upload, check the Firestore `photoDataUrl` length: a 400×400
JPEG should be roughly **30,000–80,000 characters**. If it is 6 characters
(`data:,`) something is broken. If it is over 700,000 the write will fail.

---

## 7. Bad token

Take a working profile URL and change the last character of the token:

```
/complete-profile?t=a1b2c3...cX      <- was ...c7
```

**Expect:** "This link isn't valid" with Back to home / Contact us buttons.
Not a crash, not a blank page, not an infinite spinner.

---

## 8. No token at all

Visit `/complete-profile` with no query string, while logged out.

**Expect:** "Open the link from your email."

Then log in through the modal and revisit the same URL — it should now load
**your own** profile for editing.

---

## 9. Existing login still works

The feature must not have regressed anything.

- Modal → "Already registered? Log in here"
- Enter the name and email from test 1
- **Expect:** logs in, navbar shows "Welcome, Test Visitor Won 👋"
- Log out, then try an email that was never registered → "This email is not
  registered."

---

## 10. Slow / offline behaviour

Open DevTools → Network → set throttling to **Offline**, then submit a
registration.

**Expect:** an error message within about 10 seconds — *not* a button stuck on
"Submitting…" forever. Do the same on the profile page's Save.

Set it back to **Online** afterwards.

---

## Watch the quota

Every test above burns one of your **200** free emails, and the window does not
reset until **9 September** — after the conference. A full pass through this
plan costs roughly 6–8. Budget accordingly, and upgrade to the $9 Personal plan
before registration opens publicly.

Check the counter at the top of the EmailJS dashboard as you go.

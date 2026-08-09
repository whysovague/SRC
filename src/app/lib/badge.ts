// ─── "See you in Dhahran" badge renderer ──────────────────────────────────────
// Draws the shareable badge attached to every confirmation email.
//
// The artwork is a flat plate exported from Canva with the name and photo
// removed (assets/badge-plate.jpg). Everything else — logos, headline, dates,
// venue — is already painted into it, so this module only composites two
// things on top: the registrant's name, and optionally their photo.
//
// Coordinates below are in PLATE space (2100 × 1200) and were measured by
// diffing the finished Canva variants against the empty plate, so the drawn
// elements land exactly where the designer put them.

import plateUrl from "@/assets/badge-plate.jpg";

/** Native plate size. All geometry constants are in this coordinate space. */
const W = 2100;
const H = 1200;

// Name-only layout (matches the Canva variant with no glass panel).
const NAME_CX = 1525;
const LINE1_BOTTOM = 599;
const LINE2_BOTTOM = 782;
const NAME_CAP = 121;          // cap height of each big name line
const NAME_MAX_W = 700;        // shrink to fit inside this
const STREAK_Y = 821;

// Photo layout.
const PHOTO_CX = 1523;
const PHOTO_CY = 636;
const PHOTO_R = 274;
const RING_R = 298;
const SMALL_CX = 1520;
const SMALL_BOTTOM = 1012;
const SMALL_CAP = 59;
const SMALL_MAX_W = 640;

/** Attachment budget. EmailJS allows 500 KB on the Personal plan; base64
 *  inflates by ~33%, so the encoded string is what actually has to fit. */
const MAX_BASE64_CHARS = 460_000;

let platePromise: Promise<HTMLImageElement> | null = null;
let fontsPromise: Promise<void> | null = null;

function loadPlate(): Promise<HTMLImageElement> {
  if (!platePromise) {
    platePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Badge artwork failed to load."));
      img.src = plateUrl;
    });
  }
  return platePromise;
}

/**
 * Canvas silently substitutes a fallback face if the font isn't ready, and
 * there is no error — you just get Arial. Anton is self-hosted via
 * @fontsource/anton (imported in main.tsx), so this only has to wait for it.
 */
function ensureFonts(): Promise<void> {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      if (typeof document === "undefined" || !document.fonts) return;
      try {
        await document.fonts.load(`${NAME_CAP * 1.4}px Anton`);
        await document.fonts.ready;
      } catch {
        // Fall through — a fallback face is better than no badge at all.
      }
    })();
  }
  return fontsPromise;
}

/** Font size whose rendered cap height matches `capPx`, shrunk to fit maxW. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, capPx: number, maxW: number): number {
  let size = Math.round(capPx * 1.4);

  for (let i = 0; i < 8; i++) {
    ctx.font = `${size}px Anton, Impact, sans-serif`;
    const m = ctx.measureText(text);
    const cap = (m.actualBoundingBoxAscent ?? capPx) - Math.min(0, m.actualBoundingBoxDescent ?? 0);
    if (!cap) break;
    const next = Math.round((size * capPx) / cap);
    if (next === size) break;
    size = Math.max(8, next);
  }

  // Shrink to fit the available width — long names get smaller, never clipped.
  ctx.font = `${size}px Anton, Impact, sans-serif`;
  while (size > 12 && ctx.measureText(text).width > maxW) {
    size = Math.round(size * 0.94);
    ctx.font = `${size}px Anton, Impact, sans-serif`;
  }
  return size;
}

/** White text with the soft warm halo used on the Canva original. */
function glowText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  bottom: number,
  size: number,
  blur: number
) {
  ctx.font = `${size}px Anton, Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.save();
  ctx.shadowColor = "rgba(255, 150, 60, 0.55)";
  ctx.shadowBlur = blur;
  ctx.fillStyle = "#ffffff";
  // Two passes: the first lays down the halo, the second a crisp edge on top.
  ctx.fillText(text, cx, bottom);
  ctx.shadowBlur = blur * 0.4;
  ctx.fillText(text, cx, bottom);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, cx, bottom);
}

/** The thin horizontal light flare under the name: a soft wide bloom with a
 *  bright hairline through it, matching the Canva original. */
function streak(ctx: CanvasRenderingContext2D, cx: number, cy: number, halfW = 300) {
  ctx.save();

  // Wide, low bloom.
  const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, halfW);
  bloom.addColorStop(0, "rgba(140,195,255,0.55)");
  bloom.addColorStop(0.4, "rgba(120,180,255,0.22)");
  bloom.addColorStop(1, "rgba(100,160,255,0)");
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, 0.10);          // flatten the radial into a lens flare
  ctx.translate(-cx, -cy);
  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.arc(cx, cy, halfW, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bright hairline core.
  const core = ctx.createLinearGradient(cx - halfW, cy, cx + halfW, cy);
  core.addColorStop(0, "rgba(160,205,255,0)");
  core.addColorStop(0.35, "rgba(200,230,255,0.75)");
  core.addColorStop(0.5, "rgba(255,255,255,0.98)");
  core.addColorStop(0.65, "rgba(200,230,255,0.75)");
  core.addColorStop(1, "rgba(160,205,255,0)");
  ctx.shadowColor = "rgba(120,180,255,0.95)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = core;
  ctx.fillRect(cx - halfW, cy - 1.75, halfW * 2, 3.5);

  ctx.restore();
}

/** Split a name across the two big lines: first word, then the rest. */
function splitName(name: string): string[] {
  const parts = name.trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts;
  return [parts[0], parts.slice(1).join(" ")];
}

function decode(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Photo could not be decoded."));
    img.src = dataUrl;
  });
}

export type BadgeInput = {
  fullName: string;
  /** `data:image/jpeg;base64,…` from lib/image.ts, or null for the name-only badge. */
  photoDataUrl?: string | null;
};

/**
 * Render the badge and return it as a JPEG data URL, compressed until it fits
 * the attachment budget. Never rejects on a bad photo — falls back to the
 * name-only badge, because a missing photo must not cost someone their email.
 */
export async function renderBadge({ fullName, photoDataUrl }: BadgeInput): Promise<string> {
  const [plate] = await Promise.all([loadPlate(), ensureFonts()]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");

  ctx.drawImage(plate, 0, 0, W, H);

  let photo: HTMLImageElement | null = null;
  if (photoDataUrl) {
    try {
      photo = await decode(photoDataUrl);
    } catch {
      photo = null; // name-only badge rather than no badge
    }
  }

  if (photo) {
    // Blue bloom behind the disc.
    ctx.save();
    const bloom = ctx.createRadialGradient(
      PHOTO_CX, PHOTO_CY, PHOTO_R * 0.85,
      PHOTO_CX, PHOTO_CY, RING_R * 1.12
    );
    bloom.addColorStop(0, "rgba(60,140,255,0.75)");
    bloom.addColorStop(0.55, "rgba(60,140,255,0.35)");
    bloom.addColorStop(1, "rgba(60,140,255,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(PHOTO_CX, PHOTO_CY, RING_R * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // The photo, centre-cropped into the circle.
    ctx.save();
    ctx.beginPath();
    ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2);
    ctx.clip();
    const edge = Math.min(photo.width, photo.height);
    ctx.drawImage(
      photo,
      (photo.width - edge) / 2, (photo.height - edge) / 2, edge, edge,
      PHOTO_CX - PHOTO_R, PHOTO_CY - PHOTO_R, PHOTO_R * 2, PHOTO_R * 2
    );
    ctx.restore();

    // Crisp rim.
    ctx.save();
    ctx.strokeStyle = "rgba(160,205,255,0.9)";
    ctx.lineWidth = 6;
    ctx.shadowColor = "rgba(90,170,255,0.9)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const text = fullName.trim().toUpperCase();
    const size = fitFont(ctx, text, SMALL_CAP, SMALL_MAX_W);
    glowText(ctx, text, SMALL_CX, SMALL_BOTTOM, size, 22);
  } else {
    const lines = splitName(fullName);
    if (lines.length === 1) {
      const size = fitFont(ctx, lines[0], NAME_CAP, NAME_MAX_W);
      glowText(ctx, lines[0], NAME_CX, Math.round((LINE1_BOTTOM + LINE2_BOTTOM) / 2), size, 34);
    } else {
      // One size for both lines, so they read as a single block.
      const size = Math.min(
        fitFont(ctx, lines[0], NAME_CAP, NAME_MAX_W),
        fitFont(ctx, lines[1], NAME_CAP, NAME_MAX_W)
      );
      glowText(ctx, lines[0], NAME_CX, LINE1_BOTTOM, size, 34);
      glowText(ctx, lines[1], NAME_CX, LINE2_BOTTOM, size, 34);
    }
    streak(ctx, NAME_CX, STREAK_Y);
  }

  // Step quality down until the encoded string fits the attachment budget.
  for (const q of [0.85, 0.78, 0.7, 0.62]) {
    const url = canvas.toDataURL("image/jpeg", q);
    if (url.length <= MAX_BASE64_CHARS) return url;
  }
  return canvas.toDataURL("image/jpeg", 0.55);
}

/** Filename used for the email attachment and the download button. */
export function badgeFilename(fullName: string): string {
  const slug = fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `src-2026-badge${slug ? `-${slug}` : ""}.jpg`;
}

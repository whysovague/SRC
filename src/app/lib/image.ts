// ─── Client-side image downscaling ────────────────────────────────────────────
// Profile photos are stored as base64 strings on the user's Firestore document
// rather than in Cloud Storage, which requires the Blaze billing plan. That
// makes size the binding constraint: a Firestore document is capped at 1 MiB
// total, and base64 inflates bytes by ~33%.
//
// Downscaling to a 400×400 JPEG at quality 0.82 lands around 25–45 KB
// (≈35–60 KB once encoded) — comfortable for a badge headshot and far under
// the cap, with room left for the rest of the document.

/** Longest edge of the stored image, in pixels. */
const MAX_EDGE = 400;
const JPEG_QUALITY = 0.82;

/** Hard ceiling on the encoded string. Well under Firestore's 1 MiB limit. */
export const MAX_STORED_CHARS = 700_000;

/** Reject obviously-too-large uploads before decoding them. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Formats we will actually rasterise. Deliberately an allow-list rather than a
 * plain `image/*` check: an SVG has no intrinsic pixel size, so it decodes to a
 * 0×0 canvas and `toDataURL` then returns the literal string "data:," — a
 * six-character non-image that would sail past every size check and be stored
 * as somebody's badge photo.
 *
 * Some browsers report an empty type for HEIC/HEIF; those are let through to
 * the decoder, which rejects them cleanly if it cannot read them.
 */
export const ACCEPTED_TYPES = [
  "image/jpeg", "image/jpg", "image/pjpeg",
  "image/png", "image/webp", "image/avif",
  "image/heic", "image/heif",
];

/** Mirrors ACCEPTED_TYPES for the file input's `accept` attribute. */
export const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,.avif,.heic,.heif,image/jpeg,image/png,image/webp,image/avif";

export class ImageError extends Error {}

/**
 * Read an image file, crop it to a centred square, scale it down and return a
 * `data:image/jpeg;base64,…` string ready to write to Firestore.
 *
 * Throws ImageError with a message safe to show the user.
 */
export async function fileToSquareDataUrl(file: File): Promise<string> {
  // An empty type means the browser could not identify the file; let the
  // decoder be the judge. Anything it does name must be on the allow-list.
  if (file.type !== "" && !ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
    throw new ImageError("That file type isn't supported. Please choose a JPG, PNG or WEBP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageError("That image is larger than 10 MB. Please choose a smaller one.");
  }

  const bitmap = await loadImage(file);

  // Centre-crop to a square so the badge photo is never stretched.
  const edge = Math.min(bitmap.width, bitmap.height);

  // A vector or corrupt file can decode with a zero intrinsic dimension.
  // Caught here, because a 0×0 canvas silently yields the string "data:,".
  if (!edge) {
    throw new ImageError("That image has no readable size. Please choose a different photo.");
  }

  const sx = (bitmap.width - edge) / 2;
  const sy = (bitmap.height - edge) / 2;
  const size = Math.min(edge, MAX_EDGE);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("Your browser could not process that image.");

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, edge, edge, 0, 0, size, size);

  // Release the decoded bitmap as soon as it is painted.
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

  if (dataUrl.length > MAX_STORED_CHARS) {
    throw new ImageError("That image is too detailed to store. Please try a different photo.");
  }

  return dataUrl;
}

/**
 * Decode a File into something drawable. Prefers createImageBitmap (off the
 * main thread, handles EXIF orientation) and falls back to an <img> element
 * for browsers that lack it.
 */
async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Safari < 15 and HEIC files land here — fall through to the <img> path.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new ImageError("That image could not be opened."));
      img.src = url;
    });
  } finally {
    // Safe to revoke once decoding has settled; the element keeps its pixels.
    URL.revokeObjectURL(url);
  }
}

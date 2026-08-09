// ─── Async helpers ────────────────────────────────────────────────────────────

export class TimeoutError extends Error {}

/**
 * Reject if `promise` has not settled within `ms`.
 *
 * Firestore write promises resolve only on server acknowledgement and do NOT
 * reject while offline — the mutation is queued instead. EmailJS posts with a
 * plain fetch and no AbortSignal. Either can therefore hang for minutes, which
 * leaves a button stuck on "Saving…" with no way out. Every user-facing call
 * that awaits the network should be wrapped in this.
 *
 * Note this races rather than cancels: the underlying request keeps running and
 * may still land. That is fine for our writes, which are idempotent patches.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = "This is taking longer than expected — check your connection and try again."
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(message)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

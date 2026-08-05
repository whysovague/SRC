import { useEffect, useRef, type ReactNode } from "react";

// Auto-scrolling, drag-to-scroll strip. The scroll is driven in JS (below) —
// the only CSS it needs is `.src-edge-fade`, which masks the two ends. That
// rule lives in src/styles/theme.css so the fade applies on every page that
// uses this component, not just the home page.
export function Marquee({ children, reverse = false, speed = 55 }: { children: ReactNode; reverse?: boolean; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false); // hover-pause for auto-scroll

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let offset = 0;      // scroll position in px
    let dragging = false;
    let lastX = 0;

    const halfWidth = () => track.scrollWidth / 2;

    // wrap offset into one copy's width (keeps the loop seamless), then paint
    const render = () => {
      const half = halfWidth();
      if (half <= 0) return;
      offset = ((offset % half) + half) % half;
      const x = reverse ? offset - half : -offset;
      track.style.transform = `translateX(${x}px)`;
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current && !dragging) {
        offset += speed * dt;
        render();
      }
      raf = requestAnimationFrame(step);
    };

    // ── Drag / swipe to scroll manually ──────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      container.setPointerCapture?.(e.pointerId);
      container.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      // drag right → content moves right, in both directions
      offset += reverse ? dx : -dx;
      render();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      container.releasePointerCapture?.(e.pointerId);
      container.style.cursor = "grab";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    if (reduceMotion) render();          // static, but drag still works
    else raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reverse, speed]);

  return (
    <div
      ref={containerRef}
      className="src-edge-fade overflow-hidden select-none"
      style={{ cursor: "grab", touchAction: "pan-y" }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div ref={trackRef} className="flex" style={{ width: "max-content", willChange: "transform" }}>
        <div className="flex gap-5 pr-5">{children}</div>
        <div className="flex gap-5 pr-5" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

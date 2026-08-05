import { useEffect, useRef } from "react";

import { ORBIT_CYAN, ORBIT_ORANGE } from "@/app/theme";

// Ambient particle field drawn behind most page headers.
export function MoleculeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0, height = 0, raf = 0;
    const parent = canvas.parentElement!;

    type P = { x: number; y: number; vx: number; vy: number; r: number; color: string };
    let nodes: P[] = [];

    const build = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.min(46, Math.round((width * height) / 28000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 1.2,
        color: Math.random() < 0.22 ? ORBIT_ORANGE : ORBIT_CYAN, // ~1 in 5 nodes is orange
      }));
    };

    const LINK = 150;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.5;
            ctx.strokeStyle = `rgba(12,191,206,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color},0.10)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color},0.9)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    if (reduce) { draw(); cancelAnimationFrame(raf); }
    else draw();

    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.55,
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 35%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, black 35%, transparent 85%)",
      }}
      aria-hidden="true"
    />
  );
}

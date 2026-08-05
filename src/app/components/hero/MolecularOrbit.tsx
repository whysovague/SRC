import { useEffect, useRef } from "react";

import { ORBIT_CYAN, ORBIT_ORANGE, ORBIT_WHITE } from "@/app/theme";

// Interactive 3D electron-orbit field drawn over the hero logo. Grab and drag
// to spin the whole system freely in 360 degrees; releasing keeps the momentum.
export function MolecularOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, cx = 0, cy = 0, S = 0, raf = 0, drive = 0;
    let held = false;         // true while the pointer is pressed down on the logo
    let px = 0, py = 0;       // last pointer position
    let vRotX = 0, vRotY = 0; // angular velocity (rad/frame) around the screen X/Y axes

    // ── 3×3 matrix helpers (row-major) — free 360° trackball rotation ────────
    type M3 = number[];
    const mul = (a: M3, b: M3): M3 => [
      a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
      a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
      a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8],
    ];
    const rotX = (a: number): M3 => [1,0,0, 0,Math.cos(a),-Math.sin(a), 0,Math.sin(a),Math.cos(a)];
    const rotY = (a: number): M3 => [Math.cos(a),0,Math.sin(a), 0,1,0, -Math.sin(a),0,Math.cos(a)];
    const rotZ = (a: number): M3 => [Math.cos(a),-Math.sin(a),0, Math.sin(a),Math.cos(a),0, 0,0,1];
    const apply = (m: M3, x: number, y: number, z: number) =>
      ({ x: m[0]*x+m[1]*y+m[2]*z, y: m[3]*x+m[4]*y+m[5]*z, z: m[6]*x+m[7]*y+m[8]*z });

    // Orientation of the whole orbit system — spun freely by the user
    let R: M3 = mul(rotX(-0.35), rotY(0.4));

    type Electron = { angle: number; speed: number; color: string; trail: { x: number; y: number }[] };
    type Orbit = { rF: number; basis: M3; color: string; electrons: Electron[] };

    // Each orbit is a circle living in its own tilted 3D plane
    const orbits: Orbit[] = [
    { rF: 0.44, basis: mul(rotZ(-0.32), rotX(1.35)), color: ORBIT_WHITE, electrons: [] },
      { rF: 0.41, basis: mul(rotZ(0.60),  rotX(0.35)), color: ORBIT_CYAN, electrons: [] },
      { rF: 0.44, basis: mul(rotZ(1.25),  rotX(1.05)), color: ORBIT_ORANGE, electrons: [] },
    ];

    const seed = () => {
      orbits.forEach((o, i) => {
        const count = 4;
        o.electrons = Array.from({ length: count }, (_, k) => ({
          angle: (Math.PI * 2 * k) / count + i,
          speed: (0.003 + Math.random() * 0.002) * (i % 2 ? -1 : 1),
          color: o.color, trail: [],
        }));
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height; cx = W / 2; cy = H / 2; S = Math.min(W, H);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Rotate a point on an orbit by the global orientation, then project with perspective
    const project = (basis: M3, rF: number, a: number) => {
      const r = rF * S;
      const l = apply(basis, Math.cos(a) * r, Math.sin(a) * r, 0);
      const p = apply(R, l.x, l.y, l.z);
      const persp = 2.4 * S;
      const sc = persp / (persp - p.z);
      return { x: cx + p.x * sc, y: cy + p.y * sc, depth: p.z / r }; // depth ∈ [-1, 1]
    };

    const drawPath = (o: Orbit) => {
      const c = o.color;
      const N = 72;
      let prev = project(o.basis, o.rF, 0);
      for (let i = 1; i <= N; i++) {
        const p = project(o.basis, o.rF, (Math.PI * 2 * i) / N);
        const d = ((prev.depth + p.depth) / 2 + 1) / 2; // fade the far side of the ring
        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${c},${0.04 + d * 0.16})`; ctx.lineWidth = 1; ctx.stroke();
        prev = p;
      }
    };

    const drawBenzene = (x: number, y: number, size: number, spin: number, alpha: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = Math.cos(a) * size, py = Math.sin(a) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(232,124,42,${0.7 * alpha})`; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(232,124,42,${0.4 * alpha})`; ctx.lineWidth = 1; ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        ctx.beginPath(); ctx.arc(Math.cos(a) * size, Math.sin(a) * size, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,170,${0.9 * alpha})`; ctx.fill();
      }
      ctx.restore();
    };

    const frame = () => {
      drive += ((held ? 1 : 0) - drive) * 0.07;
      ctx.clearRect(0, 0, W, H);

      // Released: let the user's momentum carry the spin briefly, then rest
      if (!held) {
        vRotX *= 0.95; vRotY *= 0.95;
        R = mul(mul(rotX(vRotX), rotY(vRotY)), R);
      }

      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 900);
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.22);
      ng.addColorStop(0, `rgba(12,191,206,${0.16 + pulse * 0.10 + drive * 0.10})`);
      ng.addColorStop(1, "rgba(12,191,206,0)");
      ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);

      orbits.forEach(drawPath);

      orbits.forEach((o) => {
        o.electrons.forEach((e) => {
          e.angle += e.speed * drive * 1.7;
          const p = project(o.basis, o.rF, e.angle);
          const x = p.x, y = p.y;
          const depth = (p.depth + 1) / 2;
          const size = 1.6 + depth * 2.2;
          const alpha = 0.45 + depth * 0.55;
          const c = e.color;

          e.trail.push({ x, y }); if (e.trail.length > 14) e.trail.shift();
          for (let i = 0; i < e.trail.length; i++) {
            const t = i / e.trail.length;
            ctx.beginPath(); ctx.arc(e.trail[i].x, e.trail[i].y, size * t * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c},${alpha * t * 0.35})`; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${alpha * 0.12})`; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(${c},${alpha * 0.06})`; ctx.lineWidth = 1; ctx.stroke();
        });
      });


      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const ROT_DRAG = 0.0065; // radians per px while grabbing — 1:1 trackball feel

    const press = (e: PointerEvent) => {
      held = true; px = e.clientX; py = e.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!held) return; // rotation is grab-only — hovering does nothing
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      // Direct trackball rotation; remember velocity so release keeps momentum
      R = mul(mul(rotX(-dy * ROT_DRAG), rotY(dx * ROT_DRAG)), R);
      vRotX = -dy * ROT_DRAG * 0.55; vRotY = dx * ROT_DRAG * 0.55;
      if (reduce) frame();
    };
    const release = () => { held = false; canvas.style.cursor = "grab"; };

    canvas.addEventListener("pointerdown", press);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", release);
    window.addEventListener("resize", resize);

    resize(); seed(); frame();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      canvas.removeEventListener("pointerleave", release);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{ top: "-12%", left: "-12%", width: "124%", height: "124%", cursor: "grab", touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
}

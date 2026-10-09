"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { LOGO_HEIGHT, LOGO_WIDTH, logoDataUrl } from "@/src/lib/logo";

const DPR_CAP = 2;
const DAMPING = 0.965;
const REFRACTION = 2.4;
const RIPPLE_STRENGTH = 1.6;
const DROP_INTERVAL_MS = 45;
const DROP_MIN_DISTANCE = 5;
const SLEEP_THRESHOLD = 0.002;

type Engine = {
  ctx: CanvasRenderingContext2D;
  source: Uint8ClampedArray;
  prev: Float32Array;
  curr: Float32Array;
  output: ImageData;
  width: number;
  height: number;
  raf: number;
  running: boolean;
  pointerInside: boolean;
  lastX: number;
  lastY: number;
  lastDropTime: number;
};

export default function LiquidLogo() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const [active, setActive] = useState(false);

  const resetBuffers = useCallback((engine: Engine) => {
    engine.prev.fill(0);
    engine.curr.fill(0);
  }, []);

  const drop = useCallback((engine: Engine, x: number, y: number) => {
    const { width: w, height: h } = engine;
    const now = performance.now();
    const moved = Math.hypot(x - engine.lastX, y - engine.lastY);
    if (now - engine.lastDropTime < DROP_INTERVAL_MS && moved < DROP_MIN_DISTANCE) {
      return;
    }
    engine.lastDropTime = now;
    engine.lastX = x;
    engine.lastY = y;

    const cx = Math.max(2, Math.min(w - 3, Math.round(x)));
    const cy = Math.max(2, Math.min(h - 3, Math.round(y)));
    for (let oy = -2; oy <= 2; oy += 1) {
      for (let ox = -2; ox <= 2; ox += 1) {
        const i = (cy + oy) * w + (cx + ox);
        if (i < 0 || i >= engine.curr.length) continue;
        const falloff = 1 - (Math.abs(ox) + Math.abs(oy)) / 4;
        if (falloff <= 0) continue;
        engine.curr[i] = RIPPLE_STRENGTH * falloff;
        engine.prev[i] = RIPPLE_STRENGTH * falloff;
      }
    }
  }, []);

  const frame = useCallback(
    function run() {
      const engine = engineRef.current;
      if (!engine) return;

      const { width: w, height: h, source, output } = engine;
      const prev = engine.prev;
      const curr = engine.curr;
      const data = output.data;
      let energy = 0;

      for (let y = 1; y < h - 1; y += 1) {
        const row = y * w;
        for (let x = 1; x < w - 1; x += 1) {
          const i = row + x;
          let v = (prev[i - 1] + prev[i + 1] + prev[i - w] + prev[i + w]) / 2 - curr[i];
          v *= DAMPING;
          curr[i] = v;
          const mag = Math.abs(v);
          if (mag > energy) energy = mag;

          const dx = curr[i - 1] - curr[i + 1];
          const dy = curr[i - w] - curr[i + w];
          let sx = x + Math.round(dx * REFRACTION);
          let sy = y + Math.round(dy * REFRACTION);
          if (sx < 0) sx = 0;
          else if (sx >= w) sx = w - 1;
          if (sy < 0) sy = 0;
          else if (sy >= h) sy = h - 1;

          const si = (sy * w + sx) * 4;
          const di = i * 4;
          data[di] = source[si];
          data[di + 1] = source[si + 1];
          data[di + 2] = source[si + 2];
          data[di + 3] = source[si + 3];
        }
      }

      engine.ctx.putImageData(output, 0, 0);
      engine.prev = curr;
      engine.curr = prev;

      if (energy > SLEEP_THRESHOLD || engine.pointerInside) {
        engine.raf = requestAnimationFrame(run);
      } else {
        engine.running = false;
        resetBuffers(engine);
        setActive(false);
      }
    },
    [resetBuffers],
  );

  const ensureRunning = useCallback(
    (engine: Engine) => {
      if (engine.running) return;
      engine.running = true;
      setActive(true);
      engine.raf = requestAnimationFrame(frame);
    },
    [frame],
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    const url = logoDataUrl();
    const img = new Image();
    let engine: Engine | null = null;
    let observer: ResizeObserver | null = null;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
      if (!sourceCtx) return false;
      sourceCtx.clearRect(0, 0, w, h);
      sourceCtx.drawImage(img, 0, 0, w, h);
      const source = sourceCtx.getImageData(0, 0, w, h).data;

      canvas.width = w;
      canvas.height = h;
      engine = {
        ctx,
        source,
        prev: new Float32Array(w * h),
        curr: new Float32Array(w * h),
        output: ctx.createImageData(w, h),
        width: w,
        height: h,
        raf: 0,
        running: false,
        pointerInside: false,
        lastX: -100,
        lastY: -100,
        lastDropTime: 0,
      };
      engineRef.current = engine;
      return true;
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = engine!.width / rect.width;
      const scaleY = engine!.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const onEnter = (e: PointerEvent) => {
      if (!engine) return;
      engine.pointerInside = true;
      const { x, y } = toLocal(e);
      drop(engine, x, y);
      ensureRunning(engine);
    };

    const onMove = (e: PointerEvent) => {
      if (!engine) return;
      const { x, y } = toLocal(e);
      drop(engine, x, y);
      ensureRunning(engine);
    };

    const onLeave = () => {
      if (engine) engine.pointerInside = false;
    };

    img.onload = () => {
      if (disposed) return;
      let ok = false;
      try {
        ok = build();
      } catch {
        ok = false;
      }
      if (!ok) return;
      observer = new ResizeObserver(() => {
        if (disposed) return;
        try {
          build();
        } catch {
          /* 光栅化失败时保持静态 logo */
        }
      });
      observer.observe(wrap);
      wrap.addEventListener("pointerenter", onEnter);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    };
    img.src = url;

    return () => {
      disposed = true;
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      observer?.disconnect();
      if (engineRef.current?.raf) cancelAnimationFrame(engineRef.current.raf);
      engineRef.current = null;
    };
  }, [drop, ensureRunning]);

  return (
    <div
      ref={wrapRef}
      className="relative select-none px-3 py-2"
      style={{ height: LOGO_HEIGHT + 16 }}
    >
      <img
        src={logoDataUrl()}
        alt="AI Chat"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="absolute left-3 top-2 transition-opacity duration-300"
        style={{ opacity: active ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-2 transition-opacity duration-300"
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, opacity: active ? 1 : 0 }}
      />
    </div>
  );
}

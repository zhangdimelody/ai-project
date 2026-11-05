"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { LOGO_HEIGHT, LOGO_WIDTH, logoDataUrl } from "@/src/lib/logo";
import {
  createWaterSurface,
  dropRipple,
  stepWater,
  type WaterSurface,
} from "@/src/lib/water-surface";

const DPR_CAP = 2;
const SLEEP_THRESHOLD = 0.002;

export default function LiquidLogo() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<WaterSurface | null>(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const insideRef = useRef(false);
  const [active, setActive] = useState(false);

  const ensureRunning = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    setActive(true);
    const loop = () => {
      const surface = surfaceRef.current;
      if (!surface) {
        runningRef.current = false;
        return;
      }
      const energy = stepWater(surface);
      if (energy > SLEEP_THRESHOLD || insideRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        runningRef.current = false;
        setActive(false);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

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
    const img = new Image();
    let observer: ResizeObserver | null = null;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      const sourceCtx = sourceCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!sourceCtx) return false;
      sourceCtx.clearRect(0, 0, w, h);
      sourceCtx.drawImage(img, 0, 0, w, h);
      const source = sourceCtx.getImageData(0, 0, w, h).data;

      canvas.width = w;
      canvas.height = h;
      surfaceRef.current = createWaterSurface(ctx, source, w, h);
      return true;
    };

    const toLocal = (e: PointerEvent) => {
      const surface = surfaceRef.current;
      if (!surface) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (surface.width / rect.width),
        y: (e.clientY - rect.top) * (surface.height / rect.height),
      };
    };

    const onEnter = (e: PointerEvent) => {
      if (!surfaceRef.current) return;
      insideRef.current = true;
      const { x, y } = toLocal(e);
      dropRipple(surfaceRef.current, x, y, performance.now());
      ensureRunning();
    };

    const onMove = (e: PointerEvent) => {
      if (!surfaceRef.current) return;
      const { x, y } = toLocal(e);
      dropRipple(surfaceRef.current, x, y, performance.now());
      ensureRunning();
    };

    const onLeave = () => {
      insideRef.current = false;
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
    img.src = logoDataUrl();

    return () => {
      disposed = true;
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      observer?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      surfaceRef.current = null;
    };
  }, [ensureRunning]);

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

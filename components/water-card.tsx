"use client";

import { useCallback, useEffect, useRef } from "react";
import { logoDataUrl } from "@/src/lib/logo";
import { drawStripeTexture } from "@/src/lib/stripes";
import {
  createWaterSurface,
  dropRipple,
  stepWater,
  type WaterSurface,
} from "@/src/lib/water-surface";

const DPR_CAP = 2;
const SLEEP_THRESHOLD = 0.002;

export default function WaterCard({ title = "水波纹" }: { title?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<WaterSurface | null>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const insideRef = useRef(false);

  const blitClean = useCallback(() => {
    const surface = surfaceRef.current;
    const src = sourceRef.current;
    if (!surface || !src) return;
    surface.ctx.clearRect(0, 0, surface.width, surface.height);
    surface.ctx.drawImage(src, 0, 0);
  }, []);

  const ensureRunning = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
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
        blitClean();
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [blitClean]);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    const logo = new Image();
    let observer: ResizeObserver | null = null;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));

      const src = document.createElement("canvas");
      src.width = w;
      src.height = h;
      const sctx = src.getContext("2d", { willReadFrequently: true });
      if (!sctx) return false;
      drawStripeTexture(sctx, w, h);

      if (logo.complete && logo.naturalWidth > 0) {
        const logoW = Math.min(w * 0.62, 360);
        const logoH = (logoW * 40) / 216;
        sctx.drawImage(logo, (w - logoW) / 2, (h - logoH) / 2, logoW, logoH);
      }

      const source = sctx.getImageData(0, 0, w, h).data;
      canvas.width = w;
      canvas.height = h;
      sourceRef.current = src;
      surfaceRef.current = createWaterSurface(ctx, source, w, h);
      blitClean();
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

    const setup = () => {
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
          /* 保持上一帧 */
        }
      });
      observer.observe(card);
      if (!reduced) {
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
      }
    };

    logo.onload = setup;
    logo.onerror = setup;
    logo.src = logoDataUrl();

    return () => {
      disposed = true;
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      observer?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      surfaceRef.current = null;
      sourceRef.current = null;
    };
  }, [blitClean, ensureRunning]);

  return (
    <section className="lab-card">
      <div className="lab-card-stage" ref={cardRef}>
        <canvas ref={canvasRef} aria-hidden="true" className="lab-card-canvas" />
      </div>
      <h2 className="lab-card-title">{title}</h2>
    </section>
  );
}

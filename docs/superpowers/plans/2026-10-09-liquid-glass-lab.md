# Liquid Glass Comparison Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `/lab` 对比页，左右同一张卡片分别展示 Canvas 水波纹与交互式液态玻璃，并把水面引擎抽出供两处共用。

**Architecture:** 把 `liquid-logo.tsx` 内的水面算法抽为框架无关的 `src/lib/water-surface.ts`，logo 与新的 `water-card.tsx` 共用。`liquid-glass.tsx` 用 CSS 分层（backdrop 磨砂 + SVG `feDisplacementMap` 边缘折射 + 跟随光标高光 + bezel）实现液态玻璃。`/lab` 页面用条纹背景让折射可见。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript 7、Tailwind CSS 4、原生 Canvas 2D、SVG 滤镜、CSS。零新增依赖。

## Global Constraints

- 不引入任何第三方动画/WebGL 库，只用原生 Canvas 2D、SVG 滤镜与 CSS。
- 水面默认参数沿用现有组件：`damping = 0.965`、`refraction = 2.4`、`rippleStrength = 1.6`、`dropIntervalMs = 45`、`dropMinDistance = 5`。
- 帧调度参数：`DPR_CAP = 2`、`SLEEP_THRESHOLD = 0.002`。
- 必须尊重 `prefers-reduced-motion: reduce`：水波纹不启动；玻璃不跟随光标（`--strength` 恒为 `0`）。
- 组件卸载时取消 `requestAnimationFrame`、断开 `ResizeObserver`、置空引擎引用。
- 对 `components/liquid-logo.tsx` 的改动仅限于改用共享引擎，对外渲染与行为不变。
- 本目录不是 git 仓库，提交步骤仅在你自行 `git init` 后执行；否则跳过，用类型检查与构建作为验证。
- 项目无测试框架，本次不引入。验证用 `npx tsc --noEmit`、`npm run build` 与浏览器实测。

---

## File Structure

- Create: `src/lib/water-surface.ts` — 框架无关的水面引擎（创建/注入/推进/采样）。
- Modify: `components/liquid-logo.tsx` — 改为消费共享引擎，行为不变。
- Create: `src/lib/stripes.ts` — Canvas 条纹纹理绘制助手。
- Create: `components/water-card.tsx` — 通用 Canvas 水波纹卡片。
- Create: `src/lib/displacement.ts` — 生成 SVG 折射位移贴图 data URL。
- Create: `components/liquid-glass.tsx` — 液态玻璃卡片。
- Create: `app/lab/page.tsx` — 对比页。
- Create: `app/lab/lab.css` — 对比页与两种卡片的样式。
- Modify: `components/sidebar.tsx` — 加 `/lab` 入口。

---

### Task 1: 抽出水面引擎

**Files:**
- Create: `src/lib/water-surface.ts`

**Interfaces:**
- Consumes: 无。
- Produces:
  - `type WaterSurface = { ctx: CanvasRenderingContext2D; width: number; height: number; source: Uint8ClampedArray; prev: Float32Array; curr: Float32Array; output: ImageData; lastX: number; lastY: number; lastDropTime: number }`
  - `type WaterOptions = { damping?: number; refraction?: number; rippleStrength?: number; dropIntervalMs?: number; dropMinDistance?: number }`
  - `createWaterSurface(ctx, source, width, height, options?): WaterSurface`
  - `dropRipple(surface, x, y, now, options?): void`
  - `stepWater(surface, options?): number`（返回本帧最大能量，并完成双缓冲交换与 `putImageData`）

- [ ] **Step 1: 创建 `src/lib/water-surface.ts`**

```ts
export type WaterSurface = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  source: Uint8ClampedArray;
  prev: Float32Array;
  curr: Float32Array;
  output: ImageData;
  lastX: number;
  lastY: number;
  lastDropTime: number;
};

export type WaterOptions = {
  damping?: number;
  refraction?: number;
  rippleStrength?: number;
  dropIntervalMs?: number;
  dropMinDistance?: number;
};

const DEFAULT_OPTIONS: Required<WaterOptions> = {
  damping: 0.965,
  refraction: 2.4,
  rippleStrength: 1.6,
  dropIntervalMs: 45,
  dropMinDistance: 5,
};

function resolve(options?: WaterOptions): Required<WaterOptions> {
  return { ...DEFAULT_OPTIONS, ...options };
}

export function createWaterSurface(
  ctx: CanvasRenderingContext2D,
  source: Uint8ClampedArray,
  width: number,
  height: number,
  _options?: WaterOptions,
): WaterSurface {
  return {
    ctx,
    width,
    height,
    source,
    prev: new Float32Array(width * height),
    curr: new Float32Array(width * height),
    output: ctx.createImageData(width, height),
    lastX: -100,
    lastY: -100,
    lastDropTime: 0,
  };
}

export function dropRipple(
  surface: WaterSurface,
  x: number,
  y: number,
  now: number,
  options?: WaterOptions,
): void {
  const opts = resolve(options);
  const moved = Math.hypot(x - surface.lastX, y - surface.lastY);
  if (now - surface.lastDropTime < opts.dropIntervalMs && moved < opts.dropMinDistance) {
    return;
  }
  surface.lastDropTime = now;
  surface.lastX = x;
  surface.lastY = y;

  const w = surface.width;
  const h = surface.height;
  const cx = Math.max(2, Math.min(w - 3, Math.round(x)));
  const cy = Math.max(2, Math.min(h - 3, Math.round(y)));
  for (let oy = -2; oy <= 2; oy += 1) {
    for (let ox = -2; ox <= 2; ox += 1) {
      const i = (cy + oy) * w + (cx + ox);
      if (i < 0 || i >= surface.curr.length) continue;
      const falloff = 1 - (Math.abs(ox) + Math.abs(oy)) / 4;
      if (falloff <= 0) continue;
      surface.curr[i] = opts.rippleStrength * falloff;
      surface.prev[i] = opts.rippleStrength * falloff;
    }
  }
}

export function stepWater(surface: WaterSurface, options?: WaterOptions): number {
  const opts = resolve(options);
  const w = surface.width;
  const h = surface.height;
  const prev = surface.prev;
  const curr = surface.curr;
  const source = surface.source;
  const data = surface.output.data;
  let energy = 0;

  for (let y = 1; y < h - 1; y += 1) {
    const row = y * w;
    for (let x = 1; x < w - 1; x += 1) {
      const i = row + x;
      let v = (prev[i - 1] + prev[i + 1] + prev[i - w] + prev[i + w]) / 2 - curr[i];
      v *= opts.damping;
      curr[i] = v;
      const mag = Math.abs(v);
      if (mag > energy) energy = mag;

      const dx = curr[i - 1] - curr[i + 1];
      const dy = curr[i - w] - curr[i + w];
      let sx = x + Math.round(dx * opts.refraction);
      let sy = y + Math.round(dy * opts.refraction);
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

  surface.ctx.putImageData(surface.output, 0, 0);
  surface.prev = curr;
  surface.curr = prev;
  return energy;
}
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 3: 提交（仅当已 `git init`）**

```bash
git add src/lib/water-surface.ts
git commit -m "refactor: extract framework-agnostic water surface engine"
```

---

### Task 2: 让 liquid-logo 使用共享引擎

**Files:**
- Modify: `components/liquid-logo.tsx`（整体替换）

**Interfaces:**
- Consumes: `createWaterSurface` / `dropRipple` / `stepWater` / `WaterSurface`（Task 1）。
- Produces: `default export LiquidLogo`（渲染与行为不变）。

- [ ] **Step 1: 用下面内容替换 `components/liquid-logo.tsx`**

```tsx
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
      const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
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
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 3: 构建**

Run: `npm run build`
Expected: PASS。

- [ ] **Step 4: 提交（仅当已 `git init`）**

```bash
git add components/liquid-logo.tsx
git commit -m "refactor: liquid-logo consumes shared water surface engine"
```

---

### Task 3: 条纹助手与水波纹卡片

**Files:**
- Create: `src/lib/stripes.ts`
- Create: `components/water-card.tsx`

**Interfaces:**
- Consumes: `createWaterSurface` / `dropRipple` / `stepWater`（Task 1）、`logoDataUrl`（已有 `src/lib/logo.ts`）。
- Produces:
  - `drawStripeTexture(ctx, width, height): void`
  - `default export WaterCard({ title?: string }): JSX.Element`

- [ ] **Step 1: 创建 `src/lib/stripes.ts`**

```ts
const STRIPE_COLORS = ["#ff5f6d", "#ffc371", "#3ad6a2", "#2f80ed", "#9b5de5"];

/**
 * 把多色斜条纹纹理画到 canvas，作为水波纹卡片的折射源图。
 * stripe 宽度按画布尺寸自适应，保证不同 DPR 下观感一致。
 */
export function drawStripeTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  const stripe = Math.max(18, Math.round(Math.min(width, height) / 8));
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-Math.PI * 30) / 180);
  const span = Math.ceil((width + height) / stripe) + 2;
  for (let i = -span; i <= span; i += 1) {
    const idx = ((i % STRIPE_COLORS.length) + STRIPE_COLORS.length) % STRIPE_COLORS.length;
    ctx.fillStyle = STRIPE_COLORS[idx];
    ctx.fillRect(i * stripe, -height, stripe, height * 3);
  }
  ctx.restore();
}
```

- [ ] **Step 2: 创建 `components/water-card.tsx`**

```tsx
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 4: 提交（仅当已 `git init`）**

```bash
git add src/lib/stripes.ts components/water-card.tsx
git commit -m "feat: add stripe texture helper and water ripple card"
```

---

### Task 4: 液态玻璃卡片

**Files:**
- Create: `src/lib/displacement.ts`
- Create: `components/liquid-glass.tsx`

**Interfaces:**
- Consumes: `logoDataUrl`（已有）。
- Produces:
  - `displacementMapDataUrl(size?: number): string`（返回 PNG data URL；R 通道编码 x 偏移、G 通道编码 y 偏移，中心 128 中性）
  - `default export LiquidGlass({ title?: string }): JSX.Element`

- [ ] **Step 1: 创建 `src/lib/displacement.ts`**

```ts
/**
 * 生成液态玻璃的边缘透镜位移贴图。
 * R 通道 -> x 偏移，G 通道 -> y 偏移，128 为中性（不偏移）。
 * 位移强度在半径约 0.82 处出现峰值（模拟玻璃边缘的折射环）。
 */
export function displacementMapDataUrl(size = 256): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(size, size);
  const c = (size - 1) / 2;
  const max = c;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x - c) / max;
      const ny = (y - c) / max;
      const d = Math.hypot(nx, ny) || 1e-6;
      const edge = Math.max(0, 1 - Math.abs(d - 0.82) / 0.3);
      const vx = (nx / d) * edge;
      const vy = (ny / d) * edge;
      const i = (y * size + x) * 4;
      img.data[i] = Math.round(128 + vx * 127);
      img.data[i + 1] = Math.round(128 + vy * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
```

- [ ] **Step 2: 创建 `components/liquid-glass.tsx`**

```tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { logoDataUrl } from "@/src/lib/logo";
import { displacementMapDataUrl } from "@/src/lib/displacement";

export default function LiquidGlass({ title = "液态玻璃" }: { title?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    setMapUrl(displacementMapDataUrl(256));
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const onEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cardRef.current?.style.setProperty("--strength", "1");
  };

  const onLeave = () => {
    cardRef.current?.style.setProperty("--strength", "0");
  };

  return (
    <section className="lab-card">
      <div className="lab-card-stage">
        <div
          ref={cardRef}
          className="glass-card"
          onPointerMove={onMove}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <svg
            className="glass-filter-defs"
            aria-hidden="true"
            width="0"
            height="0"
          >
            <defs>
              <filter
                id="lg-displace"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                {mapUrl ? (
                  <feImage
                    href={mapUrl}
                    result="map"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  />
                ) : null}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="map"
                  scale="12"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
          <div className="glass-refract" aria-hidden="true" />
          <div className="glass-tint" aria-hidden="true" />
          <div className="glass-highlight" aria-hidden="true" />
          <div className="glass-bezel" aria-hidden="true" />
          <div className="glass-content">
            <img
              src={logoDataUrl()}
              alt=""
              width={216}
              height={40}
              className="glass-logo"
            />
          </div>
        </div>
      </div>
      <h2 className="lab-card-title">{title}</h2>
    </section>
  );
}
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 4: 提交（仅当已 `git init`）**

```bash
git add src/lib/displacement.ts components/liquid-glass.tsx
git commit -m "feat: add liquid glass card with svg edge refraction"
```

---

### Task 5: 对比页、样式与侧边栏入口

**Files:**
- Create: `app/lab/page.tsx`
- Create: `app/lab/lab.css`
- Modify: `components/sidebar.tsx:1-9`（import）、`components/sidebar.tsx:45-58`（入口）

**Interfaces:**
- Consumes: `WaterCard`（Task 3）、`LiquidGlass`（Task 4）。
- Produces: `/lab` 路由页面；侧边栏入口链接。

- [ ] **Step 1: 创建 `app/lab/page.tsx`**

```tsx
import WaterCard from "@/components/water-card";
import LiquidGlass from "@/components/liquid-glass";
import "./lab.css";

export default function LabPage() {
  return (
    <div className="lab-page">
      <header className="lab-header">
        <h1>效果对比</h1>
        <p>把鼠标移到两张卡片上，对比水波纹与液态玻璃的观感。</p>
      </header>
      <div className="lab-grid">
        <WaterCard title="水波纹" />
        <LiquidGlass title="液态玻璃" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `app/lab/lab.css`**

```css
.lab-page {
  min-height: 100%;
  padding: 32px;
  background-color: #0f172a;
  background-image: repeating-linear-gradient(
    120deg,
    #ff5f6d 0 56px,
    #ffc371 56px 112px,
    #3ad6a2 112px 168px,
    #2f80ed 168px 224px,
    #9b5de5 224px 280px
  );
  background-attachment: fixed;
}

.lab-header {
  max-width: 1100px;
  margin: 0 auto 24px;
  color: #ffffff;
}

.lab-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.lab-header p {
  margin-top: 6px;
  font-size: 0.875rem;
  opacity: 0.85;
}

.lab-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .lab-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.lab-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lab-card-stage {
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: 220px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
}

.lab-card-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.lab-card-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0;
}

/* ---- 液态玻璃 ---- */

.glass-card {
  --mx: 50%;
  --my: 0%;
  --strength: 0;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 24px;
  isolation: isolate;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px) saturate(1.6);
  -webkit-backdrop-filter: blur(6px) saturate(1.6);
}

.glass-filter-defs {
  position: absolute;
}

.glass-refract {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    120deg,
    #ff5f6d 0 56px,
    #ffc371 56px 112px,
    #3ad6a2 112px 168px,
    #2f80ed 168px 224px,
    #9b5de5 224px 280px
  );
  background-attachment: fixed;
  filter: url(#lg-displace);
  opacity: 0.9;
}

.glass-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.06)
  );
  pointer-events: none;
}

.glass-highlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx) var(--my),
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0) 45%
  );
  opacity: var(--strength);
  mix-blend-mode: screen;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glass-bezel {
  position: absolute;
  inset: 0;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3),
    inset 0 0 48px rgba(255, 255, 255, 0.16);
  pointer-events: none;
}

.glass-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: transform 0.3s ease;
}

.glass-card:hover .glass-content {
  transform: translateY(-2px) scale(1.02);
}

.glass-logo {
  width: min(70%, 300px);
  height: auto;
}

@media (prefers-reduced-motion: reduce) {
  .glass-highlight,
  .glass-content {
    transition: none;
  }

  .glass-card:hover .glass-content {
    transform: none;
  }
}
```

- [ ] **Step 3: 在 `components/sidebar.tsx` 加 `/lab` 入口**

把 import 区的 lucide 行改为包含 `Sparkles`：

```tsx
import { MessageSquare, Plus, Sparkles, Trash2 } from "lucide-react";
```

在"新建会话"按钮所在的 `<div className="p-3">...</div>` 之后、`<nav ...>` 之前插入：

```tsx
      <div className="px-3 pb-1">
        <Link
          href="/lab"
          className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent hover:text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          效果对比
        </Link>
      </div>
```

- [ ] **Step 4: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 5: 构建**

Run: `npm run build`
Expected: 构建成功，路由列表出现 `/lab`。

- [ ] **Step 6: 提交（仅当已 `git init`）**

```bash
git add app/lab/page.tsx app/lab/lab.css components/sidebar.tsx
git commit -m "feat: add liquid glass comparison lab page"
```

---

### Task 6: 端到端验证

**Files:**
- Create: `C:\Users\melod\AppData\Local\Temp\tianxicode\verify-lab.mjs`（临时验证脚本，不纳入项目）

**Interfaces:**
- Consumes: Task 1–5 全部产出。
- Produces: 验证结论。

- [ ] **Step 1: 类型检查与构建**

Run: `npx tsc --noEmit; if ($?) { npm run build }`
Expected: 均 PASS。

- [ ] **Step 2: 启动/复用开发服务器**

先检查 6006 是否已有本项目的 dev server：`Invoke-WebRequest http://localhost:6006`。若返回 200 则复用之（Next 会热重载）；否则用 `npx next dev --port 6011` 启动。

- [ ] **Step 3: 写临时 CDP 验证脚本 `verify-lab.mjs`**

```js
const CDP_HTTP = "http://localhost:9222";
const PAGE_URL = "http://localhost:6006/lab";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let target = null;
  for (let i = 0; i < 20; i++) {
    const list = await (await fetch(`${CDP_HTTP}/json/list`)).json();
    target = list.find((t) => t.type === "page" && t.url.includes("localhost:6006"));
    if (target) break;
    await sleep(250);
  }
  if (!target) throw new Error("page target not found");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const ev = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };

  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: PAGE_URL });
  await sleep(3500);

  const hasWater = await ev(`!!document.querySelector('.water-card, .lab-card-canvas')`);
  const hasGlass = await ev(`!!document.querySelector('.glass-card')`);
  const glassFilter = await ev(`(() => {
    const el = document.querySelector('.glass-refract');
    return el ? getComputedStyle(el).filter : 'none';
  })()`);

  // water ripple signature
  const canvasRect = await ev(`(() => { const c = document.querySelector('.lab-card-canvas'); const r = c.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()`);
  const waterSig = () => ev(`(() => {
    const c = document.querySelector('.lab-card-canvas');
    const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let hash = 0;
    for (let i=0;i<d.length;i+=17) hash = (hash*31 + d[i]) % 2147483647;
    return hash;
  })()`);
  const waterBefore = await waterSig();
  const cy = canvasRect.y + canvasRect.h / 2;
  for (const fx of [0.25, 0.5, 0.75]) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: canvasRect.x + canvasRect.w * fx, y: cy, buttons: 0 });
    await sleep(70);
  }
  await sleep(150);
  const waterDuring = await waterSig();

  // glass hover strength
  const glassRect = await ev(`(() => { const el = document.querySelector('.glass-card'); const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: glassRect.x + 20, y: glassRect.y + 20, buttons: 0 });
  await sleep(350);
  const glassStrength = await ev(`getComputedStyle(document.querySelector('.glass-card')).getPropertyValue('--strength').trim()`);
  const glassMx = await ev(`getComputedStyle(document.querySelector('.glass-card')).getPropertyValue('--mx').trim()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: glassRect.x + glassRect.w - 20, y: glassRect.y + glassRect.h - 20, buttons: 0 });
  await sleep(120);
  const glassMx2 = await ev(`getComputedStyle(document.querySelector('.glass-card')).getPropertyValue('--mx').trim()`);

  console.log(JSON.stringify({
    hasWater, hasGlass, glassFilter,
    waterBefore, waterDuring, waterAnimated: waterBefore !== waterDuring,
    glassStrength, glassMx, glassMx2, glassFollows: glassMx !== glassMx2,
  }, null, 2));

  ws.close();
}
main().catch((e) => { console.error("VERIFY FAILED:", e.message); process.exit(1); });
```

- [ ] **Step 4: 运行验证**

启动一个带调试端口的 headless Chrome，指向 `http://localhost:6006/lab`，然后运行脚本：

```powershell
$tmp="C:\Users\melod\AppData\Local\Temp\tianxicode\cprofile-lab"; New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--user-data-dir=$tmp","--remote-debugging-port=9222","--window-size=1280,900","http://localhost:6006/lab" -WindowStyle Hidden
Start-Sleep -Seconds 4
node "C:\Users\melod\AppData\Local\Temp\tianxicode\verify-lab.mjs"
```

Expected：`hasWater` 与 `hasGlass` 为 `true`；`glassFilter` 含 `url(#lg-displace)`；`waterAnimated` 为 `true`；`glassStrength` 为 `"1"`；`glassFollows` 为 `true`。

- [ ] **Step 5: 截图人工确认**

Run:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-first-run --user-data-dir="C:\Users\melod\AppData\Local\Temp\tianxicode\cprofile-lab2" --window-size=1280,900 --screenshot="C:\Users\melod\AppData\Local\Temp\tianxicode\lab.png" --virtual-time-budget=5000 "http://localhost:6006/lab" | Out-Null
```

检查截图：两张卡片并排、条纹背景可见、玻璃卡边缘有可见折射高光、文字不溢出。

- [ ] **Step 6: reduced-motion 验证**

在验证脚本基础上加 `Emulation.setEmulatedMedia` 设置 `prefers-reduced-motion: reduce` 后 reload，确认悬停水波纹 canvas 不变化、`--strength` 保持 `"0"`。

- [ ] **Step 7: 清理临时 Chrome 进程**

```powershell
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like '*cprofile-lab*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
```

- [ ] **Step 8: 记录结论**

在交付说明中写明：`tsc`/`build` 结果、CDP 各项实测值、截图确认结论、以及残余风险（如 `background-attachment: fixed` 在个别浏览器可能不完美对齐条纹）。

---

## Self-Review

**Spec coverage:**
- `/lab` 对比页 → Task 5。
- 水波纹卡（条纹 + logo + 涟漪）→ Task 3。
- 液态玻璃卡（磨砂 + 边缘折射 + 高光 + bezel）→ Task 4。
- 共享水面引擎、`liquid-logo` 行为不变 → Task 1 + Task 2。
- 侧边栏入口 → Task 5。
- reduced-motion 降级 → Task 3（不挂监听）、Task 4（`--strength` 保持 0）+ Task 6 Step 6。
- 无 context / 光栅化失败降级 → Task 3（`getContext` 判空、`img.onerror`）、Task 4（`mapUrl` 为空时只渲染其余层）。
- 无障碍（标题语义文本、canvas/装饰层 aria-hidden）→ Task 3 + Task 4。
- 验证（tsc / build / CDP / 截图 / reduced-motion）→ Task 6。

**Placeholder scan:** 无 TBD/TODO；每个代码步骤都给完整可粘贴内容。

**Type consistency:**
- `WaterSurface` / `WaterOptions` / `createWaterSurface` / `dropRipple` / `stepWater` 在 Task 1 定义，Task 2 与 Task 3 按同名同签名消费。
- `drawStripeTexture(ctx, width, height)` Task 3 定义并消费一致。
- `displacementMapDataUrl(size)` Task 4 定义并消费一致。
- `WaterCard` / `LiquidGlass` 均 `default export`，且接受 `{ title?: string }`，Task 5 按同名导入。
- 注意：spec 中 `WaterSurface` 示例未列出 `ctx`，本计划补入 `ctx: CanvasRenderingContext2D`，因为 `stepWater` 需要它提交像素。

# Liquid Logo Ripple Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在侧边栏顶部放一个「AI Chat」logo，悬停时光标处产生跟随扩散的 iOS 风格水波纹（真实像素位移），移开后衰减恢复清晰。

**Architecture:** 底层静态 `<img>`（清晰 logo、无障碍 alt）+ 上层 `<canvas>`（波纹像素渲染）绝对定位重合。组件内用经典双缓冲水面算法逐帧计算高度场，按梯度做折射位移采样源图。logo 的 SVG 由 `src/lib/logo.ts` 单点定义，显示与光栅化共用。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript 7、Tailwind CSS 4、原生 Canvas 2D API。零新增依赖。

## Global Constraints

- 不引入任何第三方动画/WebGL 库，只用原生 Canvas 2D 与 DOM API。
- logo 逻辑尺寸：宽 `216`、高 `40`（`LOGO_WIDTH` / `LOGO_HEIGHT`）。
- 图标为 lucide `brain-circuit`，路径数据以 `node_modules/lucide-react/dist/esm/icons/brain-circuit.mjs` 为准。
- 颜色取主题变量：图标 `#2563eb`（accent），字标 `#1a1d23`（foreground）。
- 必须尊重 `prefers-reduced-motion: reduce`：命中时只显示静态 `<img>`，不启动任何动画。
- 组件卸载时取消 `requestAnimationFrame`、断开 `ResizeObserver`、置空缓冲，避免泄漏。
- 本目录不是 git 仓库。计划中的提交步骤仅在你自行 `git init` 后执行；否则跳过，以类型检查与构建作为每步的验证手段。
- 项目无测试框架，且新增测试框架超出本次范围。每个任务的"验证"用 `npx tsc --noEmit`、`npm run build` 和手动浏览器检查完成，不写自动化单测。

---

## File Structure

- Create: `src/lib/logo.ts` — logo SVG 单一来源与 data URL 助手。
- Create: `components/liquid-logo.tsx` — client component，水波纹引擎 + 像素渲染。
- Modify: `components/sidebar.tsx:46` — 在 `<aside>` 顶部、`「新建会话」`按钮之上插入 `<LiquidLogo />`。

---

### Task 1: Logo 单一来源模块

**Files:**
- Create: `src/lib/logo.ts`

**Interfaces:**
- Consumes: 无。
- Produces:
  - `LOGO_WIDTH: 216`（number 常量）
  - `LOGO_HEIGHT: 40`（number 常量）
  - `LOGO_SVG: string`（完整 `<svg>` 标记）
  - `logoDataUrl(): string`（返回 `data:image/svg+xml,` + URI 编码的 `LOGO_SVG`）

- [ ] **Step 1: 创建 `src/lib/logo.ts`**

```ts
export const LOGO_WIDTH = 216;
export const LOGO_HEIGHT = 40;

/**
 * Logo 的单一来源：显示用的 <img> 与水波纹光栅化源图都由此派生。
 * 图标路径取自 lucide brain-circuit（24x24 viewBox）。
 */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" viewBox="0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}" fill="none">
  <g transform="translate(4 6) scale(0.92)" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M9 13a4.5 4.5 0 0 0 3-4"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M12 13h4"/>
    <path d="M12 18h6a2 2 0 0 1 2 2v1"/>
    <path d="M12 8h8"/>
    <path d="M16 8V5a2 2 0 0 1 2-2"/>
    <circle cx="16" cy="13" r=".5"/>
    <circle cx="18" cy="3" r=".5"/>
    <circle cx="20" cy="21" r=".5"/>
    <circle cx="20" cy="8" r=".5"/>
  </g>
  <text x="40" y="27" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="18" font-weight="600" fill="#1a1d23">AI Chat</text>
</svg>`;

export function logoDataUrl(): string {
  return `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;
}
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS，无新增错误。

- [ ] **Step 3: 提交（仅当已 `git init`）**

```bash
git add src/lib/logo.ts
git commit -m "feat: add logo svg single source"
```

---

### Task 2: 水波纹 logo 组件

**Files:**
- Create: `components/liquid-logo.tsx`

**Interfaces:**
- Consumes: `LOGO_WIDTH`, `LOGO_HEIGHT`, `logoDataUrl` from `@/src/lib/logo`（Task 1）。
- Produces: `default export function LiquidLogo(): JSX.Element`（无 props，可直接放入侧边栏）。

- [ ] **Step 1: 创建 `components/liquid-logo.tsx`**

```tsx
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

  const frame = useCallback(function run() {
    const engine = engineRef.current;
    if (!engine) return;

    const { width: w, height: h, source, output } = engine;
    let prev = engine.prev;
    let curr = engine.curr;
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
  }, [resetBuffers]);

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

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let disposed = false;
    const url = logoDataUrl();
    const img = new Image();
    let engine: Engine | null = null;
    let observer: ResizeObserver | null = null;

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(LOGO_HEIGHT * dpr));

      canvas.width = w;
      canvas.height = h;
      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      const sourceCtx = sourceCanvas.getContext("2d");
      if (!sourceCtx) return;
      sourceCtx.clearRect(0, 0, w, h);
      sourceCtx.drawImage(img, 0, 0, w, h);
      const source = sourceCtx.getImageData(0, 0, w, h).data;

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
    };

    const onEnter = (e: PointerEvent) => {
      if (!engine) return;
      engine.pointerInside = true;
      const rect = wrap.getBoundingClientRect();
      const scaleX = engine.width / rect.width;
      const scaleY = engine.height / rect.height;
      drop(engine, (e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      ensureRunning(engine);
    };

    const onMove = (e: PointerEvent) => {
      if (!engine) return;
      const rect = wrap.getBoundingClientRect();
      const scaleX = engine.width / rect.width;
      const scaleY = engine.height / rect.height;
      drop(engine, (e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      ensureRunning(engine);
    };

    const onLeave = () => {
      if (engine) engine.pointerInside = false;
    };

    img.onload = () => {
      if (disposed) return;
      build();
      observer = new ResizeObserver(() => {
        if (disposed) return;
        build();
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
      className="relative mb-1 select-none px-3 py-2"
      style={{ height: LOGO_HEIGHT + 16 }}
    >
      <img
        src={logoDataUrl()}
        alt="AI Chat"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="absolute inset-x-3 top-2 transition-opacity duration-300"
        style={{ opacity: active ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-2 transition-opacity duration-300"
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, opacity: active ? 1 : 0 }}
      />
    </div>
  );
}
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS，无新增错误。

- [ ] **Step 3: 构建**

Run: `npm run build`
Expected: 构建成功（若因既有代码报错，确认与本次改动无关）。

- [ ] **Step 4: 提交（仅当已 `git init`）**

```bash
git add components/liquid-logo.tsx
git commit -m "feat: add canvas water-ripple logo component"
```

---

### Task 3: 接入侧边栏顶部

**Files:**
- Modify: `components/sidebar.tsx:1-9`（新增 import）
- Modify: `components/sidebar.tsx:45-55`（在 `<aside>` 内、"新建会话"按钮上方插入组件）

**Interfaces:**
- Consumes: `LiquidLogo`（Task 2，default export）。
- Produces: 侧边栏顶部渲染 logo；不改变会话列表、删除、新建逻辑。

- [ ] **Step 1: 添加 import**

在 `components/sidebar.tsx` 顶部 import 区新增一行：

```tsx
import LiquidLogo from "@/components/liquid-logo";
```

- [ ] **Step 2: 在 `<aside>` 顶部插入 logo**

将 `<aside>` 开标签后的第一个子节点改为先渲染 `<LiquidLogo />`：

```tsx
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-panel">
      <LiquidLogo />
      <div className="p-3">
        <button
          onClick={newChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          新建会话
        </button>
      </div>
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 4: 提交（仅当已 `git init`）**

```bash
git add components/sidebar.tsx
git commit -m "feat: add liquid logo to sidebar header"
```

---

### Task 4: 端到端验证

**Files:**
- 无代码改动（仅验证）。

**Interfaces:**
- Consumes: Task 1–3 全部产出。
- Produces: 验证结论记录。

- [ ] **Step 1: 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS。

- [ ] **Step 2: 生产构建**

Run: `npm run build`
Expected: PASS。

- [ ] **Step 3: 启动开发服务器**

Run: `npm run dev`（端口 6006）
Expected: 启动成功，浏览器打开 http://localhost:6006 。

- [ ] **Step 4: 手动验证清单**

- [ ] 侧边栏顶部出现「图标 + AI Chat」logo，与「新建会话」按钮左对齐。
- [ ] 鼠标悬停并移动，光标处持续产生向外扩散的水波纹。
- [ ] 移开光标后波纹自然衰减，恢复为清晰 logo，文字无残留模糊。
- [ ] 侧边栏整体无布局位移，会话列表/新建/删除仍正常。
- [ ] 缩放窗口，canvas 与 `<img>` 始终对齐且清晰。
- [ ] 系统开启「减弱动态效果」后，悬停不产生波纹。

- [ ] **Step 5: 记录结论**

在交付说明中写明：`tsc` 与 `build` 的实际结果、手动验证通过项、以及任何未验证项或残余风险。

---

## Self-Review

**Spec coverage:**
- 侧边栏顶部 logo（图标 + 字标）→ Task 1（SVG）+ Task 3（放置）。
- 悬停跟随光标的水波纹 → Task 2（`drop` + `pointermove`）。
- 经典双缓冲水面算法 → Task 2（`frame`）。
- 移开衰减回清晰 → Task 2（`active` 状态 + CSS 淡出、能量阈值休眠）。
- DPR / ResizeObserver 跟随 → Task 2（`build` + `observer`）。
- 降级（无 context / reduced-motion / 光栅化失败）→ Task 2（`getContext` 判空、`matchMedia` 提前 return、`img.onload` 才装配）。
- 无障碍（alt / aria-hidden / 非交互）→ Task 2（`<img alt>`、`canvas aria-hidden`）。
- 验证（tsc / build / 手动清单）→ Task 4。

**Placeholder scan:** 无 TBD/TODO；所有步骤含可直接执行的命令或完整代码。

**Type consistency:** `LOGO_WIDTH`/`LOGO_HEIGHT`/`logoDataUrl` 在 Task 1 定义、Task 2 消费，名称一致；`LiquidLogo` 在 Task 2 default export、Task 3 按同名 import；`Engine` 类型字段在 `drop`/`frame`/`build` 间一致。

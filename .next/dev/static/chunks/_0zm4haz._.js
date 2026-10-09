(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/liquid-logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiquidLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* eslint-disable @next/next/no-img-element */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const DPR_CAP = 2;
const DAMPING = 0.965;
const REFRACTION = 2.4;
const RIPPLE_STRENGTH = 1.6;
const DROP_INTERVAL_MS = 45;
const DROP_MIN_DISTANCE = 5;
const SLEEP_THRESHOLD = 0.002;
function LiquidLogo() {
    _s();
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const engineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resetBuffers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiquidLogo.useCallback[resetBuffers]": (engine)=>{
            engine.prev.fill(0);
            engine.curr.fill(0);
        }
    }["LiquidLogo.useCallback[resetBuffers]"], []);
    const drop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiquidLogo.useCallback[drop]": (engine, x, y)=>{
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
            for(let oy = -2; oy <= 2; oy += 1){
                for(let ox = -2; ox <= 2; ox += 1){
                    const i = (cy + oy) * w + (cx + ox);
                    if (i < 0 || i >= engine.curr.length) continue;
                    const falloff = 1 - (Math.abs(ox) + Math.abs(oy)) / 4;
                    if (falloff <= 0) continue;
                    engine.curr[i] = RIPPLE_STRENGTH * falloff;
                    engine.prev[i] = RIPPLE_STRENGTH * falloff;
                }
            }
        }
    }["LiquidLogo.useCallback[drop]"], []);
    const frame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(function run() {
        const engine = engineRef.current;
        if (!engine) return;
        const { width: w, height: h, source, output } = engine;
        const prev = engine.prev;
        const curr = engine.curr;
        const data = output.data;
        let energy = 0;
        for(let y = 1; y < h - 1; y += 1){
            const row = y * w;
            for(let x = 1; x < w - 1; x += 1){
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
    }, [
        resetBuffers
    ]);
    const ensureRunning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LiquidLogo.useCallback[ensureRunning]": (engine)=>{
            if (engine.running) return;
            engine.running = true;
            setActive(true);
            engine.raf = requestAnimationFrame(frame);
        }
    }["LiquidLogo.useCallback[ensureRunning]"], [
        frame
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiquidLogo.useEffect": ()=>{
            const wrap = wrapRef.current;
            const canvas = canvasRef.current;
            if (!wrap || !canvas) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            let disposed = false;
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoDataUrl"])();
            const img = new Image();
            let engine = null;
            let observer = null;
            const build = {
                "LiquidLogo.useEffect.build": ()=>{
                    const rect = canvas.getBoundingClientRect();
                    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
                    const w = Math.max(1, Math.round(rect.width * dpr));
                    const h = Math.max(1, Math.round(rect.height * dpr));
                    const sourceCanvas = document.createElement("canvas");
                    sourceCanvas.width = w;
                    sourceCanvas.height = h;
                    const sourceCtx = sourceCanvas.getContext("2d", {
                        willReadFrequently: true
                    });
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
                        lastDropTime: 0
                    };
                    engineRef.current = engine;
                    return true;
                }
            }["LiquidLogo.useEffect.build"];
            const toLocal = {
                "LiquidLogo.useEffect.toLocal": (e)=>{
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = engine.width / rect.width;
                    const scaleY = engine.height / rect.height;
                    return {
                        x: (e.clientX - rect.left) * scaleX,
                        y: (e.clientY - rect.top) * scaleY
                    };
                }
            }["LiquidLogo.useEffect.toLocal"];
            const onEnter = {
                "LiquidLogo.useEffect.onEnter": (e)=>{
                    if (!engine) return;
                    engine.pointerInside = true;
                    const { x, y } = toLocal(e);
                    drop(engine, x, y);
                    ensureRunning(engine);
                }
            }["LiquidLogo.useEffect.onEnter"];
            const onMove = {
                "LiquidLogo.useEffect.onMove": (e)=>{
                    if (!engine) return;
                    const { x, y } = toLocal(e);
                    drop(engine, x, y);
                    ensureRunning(engine);
                }
            }["LiquidLogo.useEffect.onMove"];
            const onLeave = {
                "LiquidLogo.useEffect.onLeave": ()=>{
                    if (engine) engine.pointerInside = false;
                }
            }["LiquidLogo.useEffect.onLeave"];
            img.onload = ({
                "LiquidLogo.useEffect": ()=>{
                    if (disposed) return;
                    let ok = false;
                    try {
                        ok = build();
                    } catch  {
                        ok = false;
                    }
                    if (!ok) return;
                    observer = new ResizeObserver({
                        "LiquidLogo.useEffect": ()=>{
                            if (disposed) return;
                            try {
                                build();
                            } catch  {
                            /* 光栅化失败时保持静态 logo */ }
                        }
                    }["LiquidLogo.useEffect"]);
                    observer.observe(wrap);
                    wrap.addEventListener("pointerenter", onEnter);
                    wrap.addEventListener("pointermove", onMove);
                    wrap.addEventListener("pointerleave", onLeave);
                }
            })["LiquidLogo.useEffect"];
            img.src = url;
            return ({
                "LiquidLogo.useEffect": ()=>{
                    disposed = true;
                    wrap.removeEventListener("pointerenter", onEnter);
                    wrap.removeEventListener("pointermove", onMove);
                    wrap.removeEventListener("pointerleave", onLeave);
                    observer?.disconnect();
                    if (engineRef.current?.raf) cancelAnimationFrame(engineRef.current.raf);
                    engineRef.current = null;
                }
            })["LiquidLogo.useEffect"];
        }
    }["LiquidLogo.useEffect"], [
        drop,
        ensureRunning
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapRef,
        className: "relative select-none px-3 py-2",
        style: {
            height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_HEIGHT"] + 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoDataUrl"])(),
                alt: "AI Chat",
                width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_WIDTH"],
                height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_HEIGHT"],
                className: "absolute left-3 top-2 transition-opacity duration-300",
                style: {
                    opacity: active ? 0 : 1
                }
            }, void 0, false, {
                fileName: "[project]/components/liquid-logo.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                "aria-hidden": "true",
                className: "pointer-events-none absolute left-3 top-2 transition-opacity duration-300",
                style: {
                    width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_WIDTH"],
                    height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_HEIGHT"],
                    opacity: active ? 1 : 0
                }
            }, void 0, false, {
                fileName: "[project]/components/liquid-logo.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/liquid-logo.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
_s(LiquidLogo, "nxv3X26WNfcUnqawqRJHGlyCeIo=");
_c = LiquidLogo;
var _c;
__turbopack_context__.k.register(_c, "LiquidLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$liquid$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/liquid-logo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Sidebar() {
    _s();
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.useCallback[load]": async ()=>{
            try {
                const res = await fetch("/api/conversations");
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data.conversations ?? []);
                }
            } finally{
                setLoading(false);
            }
        }
    }["Sidebar.useCallback[load]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            load();
        }
    }["Sidebar.useEffect"], [
        load,
        pathname
    ]);
    const newChat = ()=>{
        router.push("/");
    };
    const remove = async (id, e)=>{
        e.preventDefault();
        e.stopPropagation();
        await fetch(`/api/conversations/${id}`, {
            method: "DELETE"
        });
        await load();
        if (pathname === `/chat/${id}`) {
            router.push("/");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "flex h-full w-60 shrink-0 flex-col border-r border-border bg-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$liquid$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/sidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: newChat,
                    className: "flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/sidebar.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        "新建会话"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sidebar.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sidebar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto px-2 pb-2",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-2 text-xs text-muted",
                    children: "加载中…"
                }, void 0, false, {
                    fileName: "[project]/components/sidebar.tsx",
                    lineNumber: 61,
                    columnNumber: 11
                }, this) : conversations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-2 text-xs text-muted",
                    children: "暂无历史会话"
                }, void 0, false, {
                    fileName: "[project]/components/sidebar.tsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-1",
                    children: conversations.map((c)=>{
                        const active = pathname === `/chat/${c.id}`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/chat/${c.id}`,
                                className: `group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${active ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "h-4 w-4 shrink-0 text-muted"
                                    }, void 0, false, {
                                        fileName: "[project]/components/sidebar.tsx",
                                        lineNumber: 78,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-1 truncate",
                                        children: c.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/sidebar.tsx",
                                        lineNumber: 79,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>remove(c.id, e),
                                        className: "h-5 w-5 shrink-0 text-muted opacity-0 transition hover:text-red group-hover:opacity-100",
                                        "aria-label": "删除会话",
                                        title: "删除会话",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/sidebar.tsx",
                                            lineNumber: 86,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/sidebar.tsx",
                                        lineNumber: 80,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sidebar.tsx",
                                lineNumber: 70,
                                columnNumber: 19
                            }, this)
                        }, c.id, false, {
                            fileName: "[project]/components/sidebar.tsx",
                            lineNumber: 69,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/sidebar.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sidebar.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sidebar.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "qI4IzbHQfWnwW1UtYiSKwYtLIXE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/logo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOGO_HEIGHT",
    ()=>LOGO_HEIGHT,
    "LOGO_SVG",
    ()=>LOGO_SVG,
    "LOGO_WIDTH",
    ()=>LOGO_WIDTH,
    "logoDataUrl",
    ()=>logoDataUrl
]);
const LOGO_WIDTH = 216;
const LOGO_HEIGHT = 40;
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" viewBox="0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}" fill="none">
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
function logoDataUrl() {
    return `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0zm4haz._.js.map
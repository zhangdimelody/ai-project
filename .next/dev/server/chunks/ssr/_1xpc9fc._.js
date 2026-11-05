module.exports = [
"[project]/components/liquid-glass.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LiquidGlass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/* eslint-disable @next/next/no-img-element */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$displacement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/displacement.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function LiquidGlass({ title = "液态玻璃" }) {
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mapUrl, setMapUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMapUrl((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$displacement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displacementMapDataUrl"])(256));
    }, []);
    const onMove = (e)=>{
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${(e.clientX - r.left) / r.width * 100}%`);
        el.style.setProperty("--my", `${(e.clientY - r.top) / r.height * 100}%`);
    };
    const onEnter = ()=>{
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        cardRef.current?.style.setProperty("--strength", "1");
    };
    const onLeave = ()=>{
        cardRef.current?.style.setProperty("--strength", "0");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "lab-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lab-card-stage",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: cardRef,
                    className: "glass-card",
                    onPointerMove: onMove,
                    onPointerEnter: onEnter,
                    onPointerLeave: onLeave,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "glass-filter-defs",
                            "aria-hidden": "true",
                            width: "0",
                            height: "0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                    id: "lg-displace",
                                    x: "-20%",
                                    y: "-20%",
                                    width: "140%",
                                    height: "140%",
                                    colorInterpolationFilters: "sRGB",
                                    children: [
                                        mapUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feImage", {
                                            href: mapUrl,
                                            result: "map",
                                            x: "0",
                                            y: "0",
                                            width: "100%",
                                            height: "100%",
                                            preserveAspectRatio: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/components/liquid-glass.tsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feDisplacementMap", {
                                            in: "SourceGraphic",
                                            in2: "map",
                                            scale: "12",
                                            xChannelSelector: "R",
                                            yChannelSelector: "G"
                                        }, void 0, false, {
                                            fileName: "[project]/components/liquid-glass.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/liquid-glass.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/liquid-glass.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-refract",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-tint",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-highlight",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-bezel",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-content",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoDataUrl"])(),
                                alt: "",
                                width: 216,
                                height: 40,
                                className: "glass-logo"
                            }, void 0, false, {
                                fileName: "[project]/components/liquid-glass.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/liquid-glass.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/liquid-glass.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/liquid-glass.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "lab-card-title",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/liquid-glass.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/liquid-glass.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/water-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WaterCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stripes.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$water$2d$surface$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/water-surface.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DPR_CAP = 2;
const SLEEP_THRESHOLD = 0.002;
function WaterCard({ title = "水波纹" }) {
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const surfaceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sourceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const runningRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const insideRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const blitClean = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const surface = surfaceRef.current;
        const src = sourceRef.current;
        if (!surface || !src) return;
        surface.ctx.clearRect(0, 0, surface.width, surface.height);
        surface.ctx.drawImage(src, 0, 0);
    }, []);
    const ensureRunning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (runningRef.current) return;
        runningRef.current = true;
        const loop = ()=>{
            const surface = surfaceRef.current;
            if (!surface) {
                runningRef.current = false;
                return;
            }
            const energy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$water$2d$surface$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stepWater"])(surface);
            if (energy > SLEEP_THRESHOLD || insideRef.current) {
                rafRef.current = requestAnimationFrame(loop);
            } else {
                runningRef.current = false;
                blitClean();
            }
        };
        rafRef.current = requestAnimationFrame(loop);
    }, [
        blitClean
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const card = cardRef.current;
        const canvas = canvasRef.current;
        if (!card || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        let disposed = false;
        const logo = new Image();
        let observer = null;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const build = ()=>{
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
            const w = Math.max(1, Math.round(rect.width * dpr));
            const h = Math.max(1, Math.round(rect.height * dpr));
            const src = document.createElement("canvas");
            src.width = w;
            src.height = h;
            const sctx = src.getContext("2d", {
                willReadFrequently: true
            });
            if (!sctx) return false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawStripeTexture"])(sctx, w, h);
            if (logo.complete && logo.naturalWidth > 0) {
                const logoW = Math.min(w * 0.62, 360);
                const logoH = logoW * 40 / 216;
                sctx.drawImage(logo, (w - logoW) / 2, (h - logoH) / 2, logoW, logoH);
            }
            const source = sctx.getImageData(0, 0, w, h).data;
            canvas.width = w;
            canvas.height = h;
            sourceRef.current = src;
            surfaceRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$water$2d$surface$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWaterSurface"])(ctx, source, w, h);
            blitClean();
            return true;
        };
        const toLocal = (e)=>{
            const surface = surfaceRef.current;
            if (!surface) return {
                x: 0,
                y: 0
            };
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (surface.width / rect.width),
                y: (e.clientY - rect.top) * (surface.height / rect.height)
            };
        };
        const onEnter = (e)=>{
            if (!surfaceRef.current) return;
            insideRef.current = true;
            const { x, y } = toLocal(e);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$water$2d$surface$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropRipple"])(surfaceRef.current, x, y, performance.now());
            ensureRunning();
        };
        const onMove = (e)=>{
            if (!surfaceRef.current) return;
            const { x, y } = toLocal(e);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$water$2d$surface$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropRipple"])(surfaceRef.current, x, y, performance.now());
            ensureRunning();
        };
        const onLeave = ()=>{
            insideRef.current = false;
        };
        const setup = ()=>{
            if (disposed) return;
            let ok = false;
            try {
                ok = build();
            } catch  {
                ok = false;
            }
            if (!ok) return;
            observer = new ResizeObserver(()=>{
                if (disposed) return;
                try {
                    build();
                } catch  {
                /* 保持上一帧 */ }
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
        logo.src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoDataUrl"])();
        return ()=>{
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
    }, [
        blitClean,
        ensureRunning
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "lab-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lab-card-stage",
                ref: cardRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    ref: canvasRef,
                    "aria-hidden": "true",
                    className: "lab-card-canvas"
                }, void 0, false, {
                    fileName: "[project]/components/water-card.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/water-card.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "lab-card-title",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/water-card.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/water-card.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/displacement.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 生成液态玻璃的边缘透镜位移贴图。
 * R 通道 -> x 偏移，G 通道 -> y 偏移，128 为中性（不偏移）。
 * 位移强度在半径约 0.82 处出现峰值（模拟玻璃边缘的折射环）。
 */ __turbopack_context__.s([
    "displacementMapDataUrl",
    ()=>displacementMapDataUrl
]);
function displacementMapDataUrl(size = 256) {
    if (typeof document === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const img = ctx.createImageData(size, size);
    const c = (size - 1) / 2;
    const max = c;
    for(let y = 0; y < size; y += 1){
        for(let x = 0; x < size; x += 1){
            const nx = (x - c) / max;
            const ny = (y - c) / max;
            const d = Math.hypot(nx, ny) || 1e-6;
            const edge = Math.max(0, 1 - Math.abs(d - 0.82) / 0.3);
            const vx = nx / d * edge;
            const vy = ny / d * edge;
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
}),
"[project]/src/lib/stripes.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "drawStripeTexture",
    ()=>drawStripeTexture
]);
const STRIPE_COLORS = [
    "#ff5f6d",
    "#ffc371",
    "#3ad6a2",
    "#2f80ed",
    "#9b5de5"
];
function drawStripeTexture(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);
    const stripe = Math.max(18, Math.round(Math.min(width, height) / 8));
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI * 30 / 180);
    const span = Math.ceil((width + height) / stripe) + 2;
    for(let i = -span; i <= span; i += 1){
        const idx = (i % STRIPE_COLORS.length + STRIPE_COLORS.length) % STRIPE_COLORS.length;
        ctx.fillStyle = STRIPE_COLORS[idx];
        ctx.fillRect(i * stripe, -height, stripe, height * 3);
    }
    ctx.restore();
}
}),
];

//# sourceMappingURL=_1xpc9fc._.js.map
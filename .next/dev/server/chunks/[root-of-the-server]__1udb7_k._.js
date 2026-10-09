module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:worker_threads [external] (node:worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:worker_threads", () => require("node:worker_threads"));

module.exports = mod;
}),
"[project]/app/api/conversations/[id]/messages/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "maxDuration",
    ()=>maxDuration,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const maxDuration = 60;
const SYSTEM_PROMPT = "你是一位乐于助人的 AI 助手，回答准确、清晰、简洁。使用与用户相同的语言作答。";
async function POST(request, { params }) {
    const { id } = await params;
    const conversation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getConversation"])(id);
    if (!conversation) {
        return Response.json({
            error: "会话不存在"
        }, {
            status: 404
        });
    }
    let body = {};
    try {
        body = await request.json();
    } catch  {
        return Response.json({
            error: "请求体必须是有效 JSON"
        }, {
            status: 400
        });
    }
    const { message } = body ?? {};
    const isNewTurn = typeof message === "string" && message.trim().length > 0;
    if (!isNewTurn && conversation.messages.length === 0) {
        return Response.json({
            error: "消息不能为空"
        }, {
            status: 400
        });
    }
    const userMessage = isNewTurn ? {
        id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
        role: "user",
        content: message.trim(),
        createdAt: new Date().toISOString()
    } : undefined;
    const history = conversation.messages.map((m)=>({
            role: m.role,
            content: m.content
        }));
    const promptInput = userMessage ? [
        ...history,
        {
            role: "user",
            content: userMessage.content
        }
    ] : history;
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getModel"])();
    const runId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
    const encoder = new TextEncoder();
    const body2 = new ReadableStream({
        async start (controller) {
            const send = (event)=>{
                const frame = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
                controller.enqueue(encoder.encode(frame));
            };
            let assistantContent = "";
            try {
                const stream = await model.stream([
                    [
                        "system",
                        SYSTEM_PROMPT
                    ],
                    ...promptInput
                ]);
                for await (const chunk of stream){
                    const token = typeof chunk.content === "string" ? chunk.content : Array.isArray(chunk.content) ? chunk.content.map((c)=>c.text ?? "").join("") : "";
                    if (!token) continue;
                    assistantContent += token;
                    send({
                        type: "token",
                        data: {
                            token
                        },
                        threadId: id,
                        runId
                    });
                }
                const assistantMessage = {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    role: "assistant",
                    content: assistantContent,
                    createdAt: new Date().toISOString()
                };
                const nextMessages = userMessage ? [
                    ...conversation.messages,
                    userMessage,
                    assistantMessage
                ] : [
                    ...conversation.messages,
                    assistantMessage
                ];
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateConversation"])(id, {
                    messages: nextMessages
                });
                send({
                    type: "done",
                    data: {
                        message: assistantMessage
                    },
                    threadId: id,
                    runId
                });
            } catch (error) {
                const message2 = error instanceof Error ? error.message : "AI 回复失败";
                send({
                    type: "error",
                    error: message2,
                    threadId: id,
                    runId
                });
            } finally{
                controller.close();
            }
        }
    });
    return new Response(body2, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive"
        }
    });
}
}),
"[project]/src/agent/model.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getModel",
    ()=>getModel,
    "getModelName",
    ()=>getModelName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/dist/chat_models/index.js [app-route] (ecmascript)");
;
const DEFAULT_MODEL = "GLM-4.7-Flash";
function getModelName() {
    return process.env.ZHIPU_MODEL?.trim() || DEFAULT_MODEL;
}
function getModel() {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        throw new Error("缺少 ZHIPU_API_KEY，请在 .env 中配置智谱 API Key");
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$dist$2f$chat_models$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ChatOpenAI"]({
        model: getModelName(),
        apiKey,
        configuration: {
            baseURL: "https://open.bigmodel.cn/api/paas/v4/"
        },
        temperature: 0.7
    });
}
}),
"[project]/src/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createConversation",
    ()=>createConversation,
    "deleteConversation",
    ()=>deleteConversation,
    "getConversation",
    ()=>getConversation,
    "listConversations",
    ()=>listConversations,
    "updateConversation",
    ()=>updateConversation
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), ".data");
const DATA_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(DATA_DIR, "conversations.json");
let cache = null;
async function readStore() {
    if (cache) return cache;
    try {
        const raw = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(DATA_FILE, "utf-8");
        cache = JSON.parse(raw);
    } catch  {
        cache = {
            conversations: []
        };
    }
    return cache;
}
async function writeStore(store) {
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])(DATA_DIR, {
        recursive: true
    });
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["writeFile"])(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
    cache = store;
}
async function listConversations() {
    const store = await readStore();
    return [
        ...store.conversations
    ].sort((a, b)=>Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}
async function getConversation(id) {
    const store = await readStore();
    return store.conversations.find((c)=>c.id === id);
}
async function createConversation(id, title, messages) {
    const store = await readStore();
    const now = new Date().toISOString();
    const conversation = {
        id,
        title,
        messages,
        createdAt: now,
        updatedAt: now
    };
    store.conversations.push(conversation);
    await writeStore(store);
    return conversation;
}
async function updateConversation(id, patch) {
    const store = await readStore();
    const conversation = store.conversations.find((c)=>c.id === id);
    if (!conversation) return undefined;
    if (patch.title !== undefined) conversation.title = patch.title;
    if (patch.messages !== undefined) conversation.messages = patch.messages;
    conversation.updatedAt = new Date().toISOString();
    await writeStore(store);
    return conversation;
}
async function deleteConversation(id) {
    const store = await readStore();
    const before = store.conversations.length;
    store.conversations = store.conversations.filter((c)=>c.id !== id);
    if (store.conversations.length === before) return false;
    await writeStore(store);
    return true;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1udb7_k._.js.map
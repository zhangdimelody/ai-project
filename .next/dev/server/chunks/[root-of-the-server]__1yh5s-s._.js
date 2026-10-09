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
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

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
"[project]/app/api/agent/run/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/graph.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/state.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$events$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agent-events.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function POST(request) {
    let input;
    try {
        input = await request.json();
    } catch  {
        return Response.json({
            error: "请求体必须是有效 JSON"
        }, {
            status: 400
        });
    }
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["interviewInputSchema"].safeParse(input);
    if (!parsed.success) {
        return Response.json({
            error: parsed.error.issues[0]?.message ?? "输入参数无效"
        }, {
            status: 400
        });
    }
    const threadId = parsed.data.threadId ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
    const config = {
        configurable: {
            thread_id: threadId
        }
    };
    const encoder = new TextEncoder();
    const body = new ReadableStream({
        async start (controller) {
            const send = (event)=>controller.enqueue(encoder.encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2d$events$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encodeSse"])(event)));
            try {
                const stream = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["interviewGraph"].stream({
                    topic: parsed.data.topic,
                    techStack: parsed.data.techStack,
                    difficulty: parsed.data.difficulty,
                    questionCount: parsed.data.questionCount
                }, {
                    ...config,
                    streamMode: "updates"
                });
                for await (const update of stream){
                    const [node, data] = Object.entries(update)[0] ?? [];
                    if (!node) continue;
                    send({
                        type: "node_started",
                        node,
                        threadId
                    });
                    send({
                        type: "node_updated",
                        node,
                        data,
                        threadId
                    });
                    send({
                        type: "node_completed",
                        node,
                        data,
                        threadId
                    });
                }
                const snapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$graph$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["interviewGraph"].getState(config);
                send({
                    type: "run_completed",
                    data: snapshot.values,
                    threadId
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : "Agent 执行失败";
                send({
                    type: "node_failed",
                    error: message,
                    threadId
                });
            } finally{
                controller.close();
            }
        }
    });
    return new Response(body, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive"
        }
    });
}
}),
"[project]/src/agent/graph.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInterviewGraph",
    ()=>createInterviewGraph,
    "interviewGraph",
    ()=>interviewGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph/dist/constants.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2d$checkpoint$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph-checkpoint/dist/memory.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$state$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph/dist/graph/state.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/model.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/parse.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$retry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/retry.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/state.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/agent/prompts.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const modelOutput = async (system, user)=>{
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$model$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getModel"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$retry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withModelRetry"])(()=>model.invoke([
            [
                "system",
                system
            ],
            [
                "user",
                user
            ]
        ]));
};
const text = (value)=>typeof value === "string" ? value : JSON.stringify(value);
async function analyzeRequirements(state) {
    const response = await modelOutput(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analysisPrompt"], `主题：${state.topic}\n技术栈：${state.techStack}\n难度：${state.difficulty}`);
    return {
        analysis: text(response.content),
        currentNode: "analyze_requirements"
    };
}
async function planInterview(state) {
    const response = await modelOutput(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planningPrompt"], `能力画像：${state.analysis}\n题目数量：${state.questionCount}\n难度：${state.difficulty}`);
    return {
        plan: text(response.content),
        currentNode: "plan_interview"
    };
}
async function generateQuestions(state) {
    const response = await modelOutput(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generationPrompt"], `主题：${state.topic}\n技术栈：${state.techStack}\n能力画像：${state.analysis}\n面试计划：${state.plan}\n请生成 ${state.questionCount} 道题。`);
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["questionsSchema"].parse(JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractJsonText"])(text(response.content))));
    return {
        questions: parsed.questions,
        currentNode: "generate_questions"
    };
}
async function reviewQuestions(state) {
    const response = await modelOutput(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reviewPrompt"], `主题：${state.topic}\n难度：${state.difficulty}\n要求题数：${state.questionCount}\n题目：${JSON.stringify(state.questions)}`);
    const review = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reviewSchema"].parse(JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractJsonText"])(text(response.content))));
    return {
        review,
        currentNode: "review_questions"
    };
}
async function rewriteQuestions(state) {
    const response = await modelOutput(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rewritePrompt"], `原题：${JSON.stringify(state.questions)}\n审核反馈：${JSON.stringify(state.review?.feedback)}\n请输出完整修订后的题目数组。`);
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["questionsSchema"].parse(JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$parse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractJsonText"])(text(response.content))));
    return {
        questions: parsed.questions,
        retryCount: state.retryCount + 1,
        currentNode: "rewrite_questions"
    };
}
function routeAfterReview(state) {
    if (state.review?.passed || state.retryCount >= 2) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["END"];
    return "rewrite_questions";
}
function createInterviewGraph() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$state$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StateGraph"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$agent$2f$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InterviewState"]).addNode("analyze_requirements", analyzeRequirements).addNode("plan_interview", planInterview).addNode("generate_questions", generateQuestions).addNode("review_questions", reviewQuestions).addNode("rewrite_questions", rewriteQuestions).addEdge(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$constants$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["START"], "analyze_requirements").addEdge("analyze_requirements", "plan_interview").addEdge("plan_interview", "generate_questions").addEdge("generate_questions", "review_questions").addConditionalEdges("review_questions", routeAfterReview).addEdge("rewrite_questions", "review_questions").compile({
        checkpointer: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2d$checkpoint$2f$dist$2f$memory$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MemorySaver"]()
    });
}
const interviewGraph = createInterviewGraph();
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
const DEFAULT_MODEL = "glm-4.5-flash";
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
"[project]/src/agent/parse.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 模型有时会把 JSON 包在 markdown 代码块里，或在前后附带说明文字。
 * 这里尽量抽出真正的 JSON 片段，避免 JSON.parse 因为外层文本直接失败。
 */ __turbopack_context__.s([
    "extractJsonText",
    ()=>extractJsonText
]);
function extractJsonText(raw) {
    const trimmed = raw.trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = (fenced?.[1] ?? trimmed).trim();
    const start = candidate.search(/[{[]/);
    if (start === -1) return candidate;
    const open = candidate[start];
    const close = open === "{" ? "}" : "]";
    const end = candidate.lastIndexOf(close);
    return end > start ? candidate.slice(start, end + 1) : candidate;
}
}),
"[project]/src/agent/prompts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analysisPrompt",
    ()=>analysisPrompt,
    "generationPrompt",
    ()=>generationPrompt,
    "planningPrompt",
    ()=>planningPrompt,
    "reviewPrompt",
    ()=>reviewPrompt,
    "rewritePrompt",
    ()=>rewritePrompt
]);
const analysisPrompt = `你是 AI Agent 架构分析师。分析用户给出的面试主题和技术栈，输出一段简洁的岗位能力画像，覆盖核心职责、必备知识和实际工程场景。`;
const planningPrompt = `你是资深 AI Agent 面试设计师。根据能力画像规划面试题结构，确保覆盖 Agent 状态管理、工具调用、RAG、记忆、规划、评估和安全中的关键能力。结合用户指定的难度和题目数量。`;
const generationPrompt = `你是严格的 AI Agent 技术面试官。根据分析和面试计划生成指定数量的深度面试题。每题必须包含 title、background、focus（字符串数组）和 answer。题目要能区分真实项目经验，避免只问概念。只输出 JSON，不要 markdown 代码块、标题或额外说明，格式为 {"questions":[{"title":"","background":"","focus":[""],"answer":""}]}。`;
const reviewPrompt = `你是面试题质量审核官。检查题目数量、技术准确性、岗位相关性、难度匹配度和答案完整性。若全部达标，passed 为 true；否则 passed 为 false，并给出具体可执行的反馈。只输出 JSON，不要 markdown 代码块或额外说明，格式为 {"passed":true,"score":0,"feedback":[""]}。`;
const rewritePrompt = `你是 AI Agent 面试题修订专家。根据原题和审核反馈进行修订，保留有效内容，逐条解决反馈。只输出 JSON，不要 markdown 代码块、标题或额外说明，格式为 {"questions":[{"title":"","background":"","focus":[""],"answer":""}]}。`;
}),
"[project]/src/agent/retry.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isRetryableModelError",
    ()=>isRetryableModelError,
    "withModelRetry",
    ()=>withModelRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/core/dist/errors/index.js [app-route] (ecmascript)");
;
const DEFAULT_MAX_ATTEMPTS = 4;
const DEFAULT_BASE_DELAY_MS = 2_000;
const DEFAULT_MAX_DELAY_MS = 15_000;
/**
 * 智谱在平台侧过载时返回 429 + 业务错误码 1305（"该模型当前访问量过大"）。
 * LangChain 会把这类错误标记为可重试，但默认不会在请求内长时间退避，
 * 因此这里补一层带抖动的指数退避。
 */ const RETRYABLE_TEXT_HINTS = [
    "1305",
    "访问量过大",
    "model_rate_limit",
    "ratelimitcapacityerror",
    "rate limit",
    "too many requests"
];
function errorText(error) {
    if (typeof error === "string") return error;
    if (error instanceof Error) {
        const extra = error;
        return [
            error.name,
            error.message,
            extra.code,
            JSON.stringify(extra.error ?? "")
        ].filter(Boolean).join(" ");
    }
    try {
        return JSON.stringify(error);
    } catch  {
        return String(error);
    }
}
function errorStatus(error) {
    if (typeof error !== "object" || error === null) return undefined;
    const candidate = error;
    const status = candidate.status ?? candidate.statusCode ?? candidate.response?.status;
    return typeof status === "number" ? status : undefined;
}
function isRetryableModelError(error) {
    // LangChain 已经对错误做过分类；显式的 false 表示不该重试（如欠费、鉴权失败）。
    const classified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$core$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRetryable"])(error);
    if (classified !== undefined) return classified;
    if (errorStatus(error) === 429) return true;
    const text = errorText(error).toLowerCase();
    return RETRYABLE_TEXT_HINTS.some((hint)=>text.includes(hint));
}
function positiveInt(value, fallback) {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
async function withModelRetry(operation) {
    const maxAttempts = positiveInt(process.env.ZHIPU_MAX_ATTEMPTS, DEFAULT_MAX_ATTEMPTS);
    const baseDelayMs = positiveInt(process.env.ZHIPU_RETRY_BASE_MS, DEFAULT_BASE_DELAY_MS);
    let lastError;
    for(let attempt = 1; attempt <= maxAttempts; attempt += 1){
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (!isRetryableModelError(error) || attempt === maxAttempts) break;
            const backoff = Math.min(DEFAULT_MAX_DELAY_MS, baseDelayMs * 2 ** (attempt - 1));
            await sleep(backoff + Math.random() * baseDelayMs);
        }
    }
    if (isRetryableModelError(lastError)) {
        throw new Error("模型服务当前访问量过大（智谱 429/1305），已自动重试多次仍失败。请稍后再试，或在 .env 中通过 ZHIPU_MODEL 切换到其他模型。");
    }
    throw lastError;
}
}),
"[project]/src/agent/state.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InterviewState",
    ()=>InterviewState,
    "interviewInputSchema",
    ()=>interviewInputSchema,
    "questionSchema",
    ()=>questionSchema,
    "questionsSchema",
    ()=>questionsSchema,
    "reviewSchema",
    ()=>reviewSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/langgraph/dist/graph/annotation.js [app-route] (ecmascript)");
;
;
const interviewInputSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    topic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(2, "请输入面试主题"),
    techStack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(2, "请输入技术栈"),
    difficulty: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "beginner",
        "intermediate",
        "advanced"
    ]),
    questionCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(10),
    threadId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const questionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    background: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    focus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    answer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const questionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    questions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(questionSchema)
});
const reviewSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    passed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    score: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(100),
    feedback: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
});
const InterviewState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"].Root({
    topic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    techStack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    difficulty: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    questionCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    analysis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    plan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    questions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"])({
        reducer: (_current, update)=>update,
        default: ()=>[]
    }),
    review: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    retryCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"])({
        reducer: (_current, update)=>update,
        default: ()=>0
    }),
    currentNode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"],
    errors: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$langgraph$2f$dist$2f$graph$2f$annotation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Annotation"])({
        default: ()=>[],
        reducer: (current, update)=>current.concat(update)
    })
});
}),
"[project]/src/lib/agent-events.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "encodeSse",
    ()=>encodeSse
]);
function encodeSse(event) {
    return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1yh5s-s._.js.map
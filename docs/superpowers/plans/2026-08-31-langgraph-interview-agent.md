# LangGraph Interview Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js learning console that runs a streamed LangGraph workflow for generating and reviewing AI-agent interview questions.

**Architecture:** Use Next.js App Router and TypeScript for the full-stack shell. Keep the LangGraph graph and Zhipu model client in server-only modules, expose execution through an SSE Route Handler, and use `MemorySaver` keyed by `thread_id` for in-memory checkpoints.

**Tech Stack:** Next.js, React, TypeScript, LangGraph.js, LangChain OpenAI-compatible chat model, Zod, Tailwind CSS, Lucide React.

## Global Constraints

- Model calls and API keys remain server-side.
- Use `GLM-4.7-Flash` through `https://open.bigmodel.cn/api/paas/v4/` and `ZHIPU_API_KEY`.
- The graph must expose separate analysis, planning, generation, review, and rewrite nodes.
- Review failure may loop to rewrite at most 2 times.
- The UI must stream node state and intermediate output and support mobile layout.
- No database, authentication, or long-term history in the first version.

---

### Task 1: Establish Next.js Application Shell

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `.env.example`

**Interfaces:**
- Produces: A TypeScript Next.js app with `npm run dev`, `npm run build`, and `npm run lint` scripts.

- [ ] **Step 1: Install runtime and UI dependencies**

Run: `npm install next@latest react@latest react-dom@latest @langchain/langgraph@latest zod@latest lucide-react@latest`

Run: `npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss`

- [ ] **Step 2: Add Next.js scripts and module configuration**

Set `package.json` scripts to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

Add `"type": "module"` and retain the existing LangChain dependencies.

- [ ] **Step 3: Create the app shell**

Create a root layout that imports `globals.css`, sets metadata to `Agent Interview Lab`, and renders `children`. Create a placeholder page with the three-column console landmarks: configuration, graph trace, and final result.

- [ ] **Step 4: Add environment template**

Create `.env.example` with:

```env
ZHIPU_API_KEY=
```

Do not copy a real key into this file.

- [ ] **Step 5: Verify the shell**

Run: `npm run build`

Expected: Next.js production build succeeds.

### Task 2: Implement the LangGraph State and Nodes

**Files:**
- Create: `src/agent/state.ts`
- Create: `src/agent/model.ts`
- Create: `src/agent/prompts.ts`
- Create: `src/agent/graph.ts`

**Interfaces:**
- Consumes: `ZHIPU_API_KEY`.
- Produces: `createInterviewGraph()` returning a compiled graph that accepts `{ userInput, difficulty, questionCount }` and streams node updates.

- [ ] **Step 1: Define validated domain schemas**

Use Zod schemas for `InterviewInput`, `InterviewQuestion`, `InterviewResult`, and `ReviewResult`. Require a non-empty topic, a non-empty technology stack, difficulty in `beginner | intermediate | advanced`, and question count between 1 and 10.

- [ ] **Step 2: Define graph state annotations**

Create a LangGraph `Annotation.Root` state with `threadId`, input fields, `analysis`, `plan`, `questions`, `review`, `retryCount`, `currentNode`, and `errors`. Set `retryCount` to default to `0` and append errors rather than replacing them.

- [ ] **Step 3: Configure the server-side model**

Create `ChatOpenAI` with:

```ts
{
  model: "GLM-4.7-Flash",
  apiKey: process.env.ZHIPU_API_KEY,
  configuration: { baseURL: "https://open.bigmodel.cn/api/paas/v4/" },
  temperature: 0.7
}
```

Throw a clear configuration error when the environment variable is missing.

- [ ] **Step 4: Implement the graph nodes**

Implement `analyze_requirements`, `plan_interview`, `generate_questions`, `review_questions`, and `rewrite_questions`. Each node must return only its state delta, update `currentNode`, and use structured output for model-generated data. The review node must assess coverage, depth, correctness, and alignment with the requested question count.

- [ ] **Step 5: Implement graph edges and checkpointer**

Connect `START -> analyze_requirements -> plan_interview -> generate_questions -> review_questions`. Route passed reviews to `END`; route failed reviews with `retryCount < 2` to `rewrite_questions -> review_questions`; route exhausted reviews to `END`. Compile with `MemorySaver`.

- [ ] **Step 6: Verify graph compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors.

### Task 3: Add the Streaming API Route

**Files:**
- Create: `app/api/agent/run/route.ts`
- Create: `src/lib/agent-events.ts`

**Interfaces:**
- Consumes: JSON `POST` body containing `topic`, `techStack`, `difficulty`, `questionCount`, and optional `threadId`.
- Produces: `text/event-stream` response containing typed node lifecycle events and a final result.

- [ ] **Step 1: Define public event types**

Define event payloads for `node_started`, `node_updated`, `node_completed`, `node_failed`, and `run_completed`. Keep payloads JSON serializable and exclude model clients, headers, and environment variables.

- [ ] **Step 2: Validate request input**

Parse the request with the shared Zod input schema. Return HTTP 400 with a safe error message for invalid input.

- [ ] **Step 3: Stream graph updates**

Create a `thread_id` when absent, call the compiled graph with `configurable.thread_id`, convert graph stream updates into SSE frames, and send a final `run_completed` event. Flush each frame immediately.

- [ ] **Step 4: Handle failures safely**

Catch model and graph errors, emit `node_failed` or a final error event, close the stream, and never include the API key or raw request headers.

- [ ] **Step 5: Verify route types**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors.

### Task 4: Build the Learning Console UI

**Files:**
- Create: `components/agent-console.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: SSE events from `/api/agent/run`.
- Produces: Interactive configuration form and trace/result views.

- [ ] **Step 1: Implement configuration controls**

Add controlled fields for topic, technology stack, difficulty, and question count. Disable the run button while active and provide a stop/reset action.

- [ ] **Step 2: Implement SSE client handling**

Use `fetch` with a POST body and `ReadableStream` reader. Parse SSE frames, update node statuses and intermediate outputs, persist the returned `threadId` in component state, and show recoverable errors.

- [ ] **Step 3: Render execution trace**

Render the five graph nodes in order with `idle`, `running`, `completed`, and `failed` states. Show current node, review decision, retry count, and readable intermediate output.

- [ ] **Step 4: Render final results**

Render each generated question with background, focus points, and reference answer. Add copy-to-clipboard and clear-result icon buttons with accessible labels and tooltips.

- [ ] **Step 5: Add responsive visual system**

Use a restrained light workspace palette with distinct ink, blue, green, amber, and red status colors. Keep cards flat and compact, use stable columns on desktop, and switch to a vertical flow below the tablet breakpoint.

- [ ] **Step 6: Verify production build**

Run: `npm run build`

Expected: Build succeeds without client/server boundary errors.

### Task 5: End-to-End Verification and Runbook

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add local run instructions**

Document `npm install`, `.env` setup, `npm run dev`, browser URL, and the purpose of each graph node. State explicitly that the API key must remain server-side.

- [ ] **Step 2: Run static checks**

Run: `npx tsc --noEmit`

Run: `npm run build`

Expected: Both commands pass.

- [ ] **Step 3: Run the development server**

Run: `npm run dev -- --port 3000`

Expected: The console is available at `http://localhost:3000`.

- [ ] **Step 4: Exercise the browser workflow**

Submit the default AI-agent topic and verify that node events appear progressively, the review branch is visible, and final questions render. Test an invalid empty topic and verify an inline error. Test a model failure or rate-limit response and verify the trace remains visible with a retry action.

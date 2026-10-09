# Switch Chat Provider to Zhipu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the existing LangChain example to call Zhipu's OpenAI-compatible chat API.

**Architecture:** Keep the existing prompt-to-model-to-string parser chain unchanged. Change only the provider-specific model name, environment variable, API key option, and base URL.

**Tech Stack:** Node.js, ES modules, LangChain `@langchain/openai`, `@langchain/core`, `dotenv`.

## Global Constraints

- Read the API key from `ZHIPU_API_KEY` in `.env`.
- Use `https://open.bigmodel.cn/api/paas/v4/` as the API endpoint.
- Use the `glm-4-flash` model.
- Preserve the existing prompt chain and output format.

---

### Task 1: Update Zhipu Model Configuration

**Files:**
- Modify: `index.js:8-15`

**Interfaces:**
- Consumes: `process.env.ZHIPU_API_KEY` loaded by `dotenv/config`.
- Produces: A `ChatOpenAI` instance configured for Zhipu's compatible API.

- [ ] **Step 1: Update provider-specific values**

Change the model configuration to:

```js
const model = new ChatOpenAI({
  model: "glm-4-flash",
  apiKey: process.env.ZHIPU_API_KEY,
  configuration: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  },
  temperature: 0.7,
});
```

- [ ] **Step 2: Run the example**

Run: `node index.js`

Expected: The program reaches Zhipu and prints generated interview questions. If the configured key is invalid, the expected diagnostic is an HTTP `401` authentication error from Zhipu.

- [ ] **Step 3: Check the diff**

Run: `git diff -- index.js`

Expected: Only the provider configuration changes are present. This directory is currently not a Git repository, so the command may report that no repository exists.

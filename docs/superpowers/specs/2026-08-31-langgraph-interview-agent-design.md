# LangGraph AI Agent Interviewer Design

## Goal

将当前单文件模型调用示例升级为一个用于学习 Agent 技术的 Next.js 全栈项目。用户输入 AI 智能体岗位和技术栈后，系统通过 LangGraph 运行可观测的面试题生成工作流，并在网页上实时展示节点状态和中间结果。

## Architecture

采用 Next.js App Router、TypeScript 和 LangGraph.js。模型调用、图执行和 API Key 读取全部发生在服务端；浏览器通过 SSE 接收执行事件。首版使用 `MemorySaver` 保存 thread 状态，后续可替换为 SQLite、Postgres 或 LangGraph Platform。

目录职责：

- `app/`：页面、布局和 API Route Handler。
- `src/agent/`：LangGraph 状态定义、节点、条件边和模型适配。
- `src/lib/`：SSE 事件类型、输入校验和通用服务端工具。
- `components/`：配置表单、执行轨迹和结果展示组件。

## Graph Workflow

```text
START
  -> analyze_requirements
  -> plan_interview
  -> generate_questions
  -> review_questions
       ├─ passed -> END
       ├─ failed and retryCount < 2 -> rewrite_questions
       │                                -> review_questions
       └─ retryCount >= 2 -> END with best available result
```

图状态包含：

- `threadId`
- `userInput`
- `difficulty`
- `questionCount`
- `analysis`
- `plan`
- `questions`
- `review`
- `retryCount`
- `currentNode`
- `errors`

每个节点只负责一个清晰的步骤，并返回状态增量。题目和审核结果使用结构化 schema，避免依赖模型自由格式文本。

## User Interface

桌面端使用三栏学习控制台：

- 左栏：岗位主题、技术栈、难度、题目数量、thread_id 和运行控制。
- 中栏：节点状态、当前节点、中间输出、条件分支和重试次数。
- 右栏：最终题目、背景、考察点、参考答案，以及复制和清空操作。

移动端切换为上下布局。界面需要包含空闲、运行中、完成、失败和可重试状态。按钮使用图标增强明确操作，并为不熟悉的图标提供 tooltip。

## Streaming Protocol

`POST /api/agent/run` 接收运行配置，服务端使用 `thread_id` 调用带 `MemorySaver` 的图。通过 SSE 推送以下事件：

- `node_started`
- `node_updated`
- `node_completed`
- `node_failed`
- `run_completed`

事件只包含节点名、状态、公开中间结果和错误信息，不包含 API Key 或模型客户端内部配置。

## Error Handling

模型错误、输入校验错误和图执行错误都转为可展示的错误事件。服务端保留已完成节点和错误信息，前端保留当前 `thread_id` 并提供重试操作。审核循环最多执行 2 次，达到上限后输出当前最佳结果并明确标记。

## Verification

- 单元测试验证节点状态转换、审核通过分支和重写循环。
- API 测试验证 SSE 事件顺序、输入校验和错误事件。
- 浏览器测试验证运行中状态、最终结果、重试和响应式布局。
- 手动验证服务端环境变量不会出现在客户端 bundle 或 SSE 事件中。

## Scope Exclusions

首版不包含用户登录、数据库、长期历史记录、真实面试对话、自动评分和多模型路由。这些功能在基础图执行稳定后再独立扩展。

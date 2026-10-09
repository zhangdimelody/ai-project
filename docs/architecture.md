# Agent Interview Lab 架构图

本文基于当前代码库产出，描述整体分层、LangGraph 工作流、SSE 事件链路与数据持久化。

## 1. 系统分层架构

```mermaid
flowchart TB
    subgraph Browser["浏览器 (Client Components)"]
        Sidebar["Sidebar<br/>会话列表 / 删除"]
        NewChat["NewChat<br/>首页发起会话"]
        ChatWindow["ChatWindow<br/>消息流式展示"]
        MD["MarkdownMessage<br/>Markdown 渲染"]
        Console["AgentConsole<br/>(面试 Agent 控制台)"]
    end

    subgraph NextServer["Next.js App Router (Node.js Runtime)"]
        direction TB
        subgraph Pages["Pages"]
            HomePage["/  (page.tsx)"]
            ChatPage["/chat/[id]  (SSR)"]
        end
        subgraph ApiRoutes["API Route Handlers"]
            ConvList["/api/conversations<br/>GET / POST"]
            ConvById["/api/conversations/[id]<br/>GET / DELETE"]
            ConvMsg["/api/conversations/[id]/messages<br/>POST (SSE)"]
            AgentRun["/api/agent/run<br/>POST (SSE)"]
        end
        subgraph AgentLayer["src/agent  LangGraph 工作流"]
            Graph["graph.ts<br/>StateGraph + 条件边"]
            State["state.ts<br/>Annotation + Zod Schema"]
            Prompts["prompts.ts<br/>节点 Prompt"]
            Model["model.ts<br/>ChatOpenAI 适配"]
            Retry["retry.ts<br/>指数退避重试"]
            Parse["parse.ts<br/>JSON 抽取"]
        end
        subgraph LibLayer["src/lib  通用能力"]
            Storage["storage.ts<br/>文件持久化"]
            Events["agent-events.ts<br/>SSE 事件与编码"]
            Types["conversation-types.ts<br/>前端共享类型"]
        end
    end

    subgraph External["外部依赖"]
        Zhipu["智谱 OpenAPI<br/>open.bigmodel.cn"]
        Disk[(".data/conversations.json")]
    end

    Sidebar --> ConvList
    Sidebar --> ConvById
    NewChat --> HomePage
    NewChat --> ConvList
    HomePage --> NewChat
    ChatPage --> ChatWindow
    ChatWindow --> ConvMsg
    ChatWindow --> MD
    Console --> AgentRun
    Console --> MD

    ConvList --> Storage
    ConvById --> Storage
    ConvMsg --> Storage
    ConvMsg --> Model
    ConvMsg --> Retry

    AgentRun --> Graph
    AgentRun --> Events
    Graph --> State
    Graph --> Prompts
    Graph --> Model
    Graph --> Retry
    Graph --> Parse

    Model --> Zhipu
    Storage --> Disk
```

## 2. LangGraph 工作流

状态在节点间传递，审核节点通过条件边决定结束或进入修订循环（最多重写 2 次）。

```mermaid
flowchart TD
    START([START]) --> Analyze["analyze_requirements<br/>需求分析"]
    Analyze --> Plan["plan_interview<br/>面试规划"]
    Plan --> Generate["generate_questions<br/>题目生成"]
    Generate --> Review["review_questions<br/>质量审核"]
    Review --> Route{"routeAfterReview"}
    Route -->|"passed = true"| END([END])
    Route -->|"failed 且 retryCount < 2"| Rewrite["rewrite_questions<br/>题目修订"]
    Route -->|"retryCount >= 2"| END
    Rewrite --> Review
```

图状态（`src/agent/state.ts`）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `topic` / `techStack` | `string` | 面试主题与技术栈 |
| `difficulty` | `beginner` \| `intermediate` \| `advanced` | 难度等级 |
| `questionCount` | `number` | 题目数量（1–10） |
| `analysis` | `string` | 能力画像，`analyze_requirements` 产出 |
| `plan` | `string` | 面试题结构规划，`plan_interview` 产出 |
| `questions` | `InterviewQuestion[]` | 结构化题目，生成/修订节点产出 |
| `review` | `InterviewReview` | 审核结果（passed / score / feedback） |
| `retryCount` | `number` | 已修订次数，用于条件边判定 |
| `currentNode` | `string` | 当前节点名 |
| `errors` | `string[]` | 累积错误信息 |

结构化输出使用 Zod 校验：`questionsSchema`（题目数组）与 `reviewSchema`（审核结果），模型返回经 `parse.ts` 抽取 JSON 后解析。

## 3. 面试 Agent SSE 事件链路

`POST /api/agent/run` 使用 `interviewGraph.stream(..., { streamMode: "updates" })` 逐节点推送事件，`MemorySaver` 以 `thread_id` 保存图状态。

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as AgentConsole
    participant R as /api/agent/run
    participant G as interviewGraph
    participant M as 智谱 OpenAPI

    U->>C: 填写主题/技术栈/难度/题量
    C->>R: POST (JSON, 可带 threadId)
    R->>R: interviewInputSchema 校验
    R->>G: stream(state, thread_id)
    loop 每个节点
        G->>M: invoke(system + user prompt)
        M-->>G: 模型输出
        G-->>R: update
        R-->>C: node_started / node_updated / node_completed
    end
    G-->>R: (可选) rewrite_questions 循环
    R->>G: getState(config)
    R-->>C: run_completed (完整状态)
    C->>U: 展示执行轨迹与最终题目
```

SSE 事件类型（`src/lib/agent-events.ts`）：`node_started`、`node_updated`、`node_completed`、`node_failed`、`run_completed`，以及聊天链路的 `token`、`done`、`error`。

## 4. 会话聊天链路

与面试 Agent 相互独立：`/api/conversations/[id]/messages` 直接调用模型流式输出（不走 LangGraph），并把完整消息历史落盘。

```mermaid
flowchart LR
    User[用户输入] --> CW[ChatWindow]
    CW -->|"POST /messages"| API[messages/route.ts]
    API -->|"读取历史"| Store[(.data/conversations.json)]
    API -->|"model.stream"| Zhipu[智谱 OpenAPI]
    Zhipu -->|"逐 token"| API
    API -->|"event: token"| CW
    API -->|"写入 user + assistant"| Store
    API -->|"event: done"| CW
```

## 5. 目录职责

| 目录 | 职责 |
| --- | --- |
| `app/` | 页面、布局与 API Route Handler |
| `app/api/agent/run/` | 面试 Agent 的 SSE 入口 |
| `app/api/conversations/` | 会话增删查与消息流式接口 |
| `src/agent/` | LangGraph 状态、节点、条件边、Prompt、模型适配、重试与解析 |
| `src/lib/` | 文件持久化、SSE 事件编码、前端共享类型 |
| `components/` | 侧边栏、会话窗口、Agent 控制台、Markdown 渲染 |

## 6. 安全与运行约束

- `ZHIPU_API_KEY` 仅在服务端读取（`model.ts`），不会进入客户端 bundle 或 SSE 事件。
- 所有 API Route 使用 `runtime = "nodejs"` 与 `dynamic = "force-dynamic"`。
- 模型调用经 `retry.ts` 指数退避，处理智谱 429 / 业务码 1305 过载。
- 会话数据存储于本地 `.data/conversations.json`；面试图状态仅存于进程内 `MemorySaver`，重启即失效。

# Agent Interview Lab

可观测的 LangGraph AI 智能体面试题生成器。输入岗位主题和技术栈后，系统通过 LangGraph 运行可观测的面试题生成工作流，并在网页端实时展示节点状态与中间结果。

## 本地运行

```bash
npm install
```

配置环境变量：复制 `.env.example` 为 `.env`，填入智谱 API Key。

```env
ZHIPU_API_KEY=
```

可选配置：

```env
# 默认 glm-4.5-flash；高峰期遇到 429/1305 时可切换其他模型
ZHIPU_MODEL=glm-4.5-flash
# 单个模型调用的最大尝试次数与退避基数（毫秒）
ZHIPU_MAX_ATTEMPTS=4
ZHIPU_RETRY_BASE_MS=2000
```

> API Key 必须保留在服务端（`.env`），绝不能出现在客户端 bundle 或 SSE 事件中。

## 429 / 访问量过大

`GLM-4.7-Flash` 是免费模型，高峰时段智谱会返回 `429` + 业务码 `1305`（“该模型当前访问量过大，请您稍后再试”），属于平台侧过载，与 API Key、Prompt 无关。

- 系统会自动按指数退避重试（默认最多 4 次，间隔 2s/4s/8s）。
- 若仍失败，可在 `.env` 中把 `ZHIPU_MODEL` 切换为其他模型后重启开发服务器。


启动开发服务器：

```bash
npm run dev
```

浏览器访问 http://localhost:6006。

## 工作流节点

| 节点 | 职责 |
| --- | --- |
| `analyze_requirements` | 分析主题与技术栈，生成岗位能力画像 |
| `plan_interview` | 规划面试题结构，覆盖关键能力 |
| `generate_questions` | 生成指定数量的结构化面试题 |
| `review_questions` | 审核题量、准确性、相关性、难度与答案完整性 |
| `rewrite_questions` | 根据审核反馈修订题目（最多重写 2 次） |

## 脚本

```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run start    # 生产运行
npx tsc --noEmit # 类型检查
```

## 验证

- `npx tsc --noEmit`：类型检查通过。
- `npm run build`：Next.js 生产构建通过。
- `node index.js`：独立的 LangChain 示例，直接调用智谱生成面试题。
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BrainCircuit,
  Check,
  ChevronRight,
  ClipboardList,
  Copy,
  FileSearch,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";
import MarkdownMessage from "@/components/markdown-message";
import type { AgentEvent } from "@/src/lib/agent-events";

type Difficulty = "beginner" | "intermediate" | "advanced";
type NodeStatus = "idle" | "running" | "completed" | "failed";

type Question = {
  title: string;
  background: string;
  focus: string[];
  answer: string;
};

const NODE_ORDER = [
  "analyze_requirements",
  "plan_interview",
  "generate_questions",
  "review_questions",
  "rewrite_questions",
] as const;

const NODE_LABELS: Record<string, string> = {
  analyze_requirements: "需求分析",
  plan_interview: "面试规划",
  generate_questions: "题目生成",
  review_questions: "质量审核",
  rewrite_questions: "题目修订",
};

const NODE_ICONS: Record<string, React.ReactNode> = {
  analyze_requirements: <FileSearch className="h-4 w-4" />,
  plan_interview: <ClipboardList className="h-4 w-4" />,
  generate_questions: <Sparkles className="h-4 w-4" />,
  review_questions: <ScrollText className="h-4 w-4" />,
  rewrite_questions: <RefreshCw className="h-4 w-4" />,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "初级",
  intermediate: "中级",
  advanced: "高级",
};

type StatusMap = Record<string, NodeStatus>;

function statusColor(status: NodeStatus) {
  switch (status) {
    case "running":
      return "bg-accent text-white";
    case "completed":
      return "bg-green text-white";
    case "failed":
      return "bg-red text-white";
    default:
      return "bg-border text-muted";
  }
}

export default function AgentConsole() {
  const [topic, setTopic] = useState("AI 智能体后端开发");
  const [techStack, setTechStack] = useState("Python + LangGraph + RAG");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [questionCount, setQuestionCount] = useState(3);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  const [statuses, setStatuses] = useState<StatusMap>({});
  const [nodeOutputs, setNodeOutputs] = useState<Record<string, string>>({});
  const [review, setReview] = useState<{
    passed?: boolean;
    score?: number;
    feedback?: string[];
  }>({});
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<{
    questions: Question[];
    analysis: string;
    plan: string;
  } | null>(null);
  const [running, setRunning] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [nodeOutputs]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatuses({});
    setNodeOutputs({});
    setReview({});
    setRetryCount(0);
    setError(undefined);
    setResult(null);
    setThreadId(undefined);
    setRunning(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!topic.trim() || !techStack.trim()) {
      setError("请填写面试主题和技术栈");
      return;
    }

    setRunning(true);
    setError(undefined);
    setResult(null);
    setReview({});
    setRetryCount(0);
    setNodeOutputs({});
    const controller = new AbortController();
    abortRef.current = controller;

    const statusesBuilder: StatusMap = Object.fromEntries(
      NODE_ORDER.map((n) => [n, "idle"] as const),
    );

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          topic,
          techStack,
          difficulty,
          questionCount,
          threadId,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error ?? "请求失败");
        setRunning(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const eventLine = frame
            .split("\n")
            .find((line) => line.startsWith("data: "));
          if (!eventLine) continue;
          const payload = JSON.parse(eventLine.slice(6)) as AgentEvent;

          if (payload.threadId) setThreadId(payload.threadId);

          switch (payload.type) {
            case "node_started": {
              const node = payload.node as string;
              statusesBuilder[node] = "running";
              setStatuses({ ...statusesBuilder });
              break;
            }
            case "node_updated":
            case "node_completed": {
              const node = payload.node as string;
              if (payload.type === "node_completed") {
                statusesBuilder[node] = "completed";
                setStatuses({ ...statusesBuilder });
              }
              if (payload.data && typeof payload.data === "object") {
                extractOutputs(
                  payload.data as Record<string, unknown>,
                  setNodeOutputs,
                  setReview,
                  setRetryCount,
                );
              }
              break;
            }
            case "run_completed": {
              const data = payload.data as
                | { questions?: Question[]; analysis?: string; plan?: string; retryCount?: number }
                | undefined;
              if (data?.questions) {
                setResult({
                  questions: data.questions,
                  analysis: data.analysis ?? "",
                  plan: data.plan ?? "",
                });
              }
              setRunning(false);
              break;
            }
            case "node_failed": {
              setError(payload.error ?? "执行失败");
              const runningNode = NODE_ORDER.find(
                (n) => statusesBuilder[n] === "running",
              );
              if (runningNode) {
                statusesBuilder[runningNode] = "failed";
                setStatuses({ ...statusesBuilder });
              }
              setRunning(false);
              break;
            }
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message ?? "连接中断");
      }
      setRunning(false);
    }
  }, [topic, techStack, difficulty, questionCount, threadId]);

  const activeNode = useMemo(
    () => NODE_ORDER.find((n) => statuses[n] === "running"),
    [statuses],
  );

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = result.questions
      .map(
        (q, i) =>
          `${i + 1}. ${q.title}\n背景：${q.background}\n考察点：${q.focus.join("、")}\n参考答案：${q.answer}`,
      )
      .join("\n\n");
    navigator.clipboard?.writeText(text);
  }, [result]);

  return (
    <main className="min-h-screen text-foreground">
      <header className="border-b border-border bg-panel px-6 py-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-accent" />
          <div>
            <h1 className="text-lg font-semibold">Agent Interview Lab</h1>
            <p className="text-sm text-muted">
              可观测的 LangGraph 面试题生成工作流
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 lg:h-[calc(100vh-73px)] lg:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-panel p-4">
          <h2 className="mb-3 text-sm font-semibold">运行配置</h2>

          <label className="mb-2 block text-xs font-medium text-muted">
            面试主题
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <label className="mb-2 block text-xs font-medium text-muted">
            技术栈
          </label>
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <label className="mb-2 block text-xs font-medium text-muted">难度</label>
          <div className="mb-4 flex gap-2">
            {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs transition ${
                  difficulty === d
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-background text-muted hover:border-accent"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>

          <label className="mb-2 block text-xs font-medium text-muted">
            题目数量：{questionCount}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="mb-4 w-full accent-accent"
          />

          {threadId && (
            <div className="mb-4 break-all rounded-lg bg-background px-3 py-2 text-xs text-muted">
              thread_id: {threadId}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={running}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {running ? "运行中" : "运行 Agent"}
            </button>
            <button
              onClick={reset}
              disabled={running}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:text-foreground disabled:opacity-50"
              aria-label="重置"
              title="重置"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="flex min-h-[320px] flex-col rounded-xl border border-border bg-panel p-4">
          <h2 className="mb-3 text-sm font-semibold">执行轨迹</h2>

          <div className="mb-3 space-y-2">
            {NODE_ORDER.map((node, i) => (
              <div key={node} className="flex items-center gap-2">
                <span className="text-xs text-muted">{i + 1}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${statusColor(statuses[node] ?? "idle")}`}
                >
                  {statuses[node] === "completed" ? (
                    <Check className="h-3 w-3" />
                  ) : statuses[node] === "running" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : statuses[node] === "failed" ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  {NODE_ICONS[node]}
                  <span className="font-medium">{NODE_LABELS[node]}</span>
                </span>
                {i < NODE_ORDER.length - 1 && (
                  <ChevronRight className="ml-auto h-3 w-3 text-muted" />
                )}
              </div>
            ))}
          </div>

          {review.feedback && review.feedback.length > 0 && (
            <div className="mb-3 rounded-lg border border-amber/40 bg-amber/5 p-3">
              <p className="mb-1 text-xs font-medium text-amber">
                审核结果：{review.passed ? "通过" : "未通过"}
                {typeof review.score === "number" && `（${review.score} 分）`}
                {typeof retryCount === "number" && retryCount > 0 && ` · 已修订 ${retryCount} 次`}
              </p>
              <ul className="list-inside list-disc space-y-1 text-xs text-muted">
                {review.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div
            ref={logRef}
            className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-background p-3"
          >
            {activeNode && !error && (
              <p className="text-xs text-muted">
                正在执行：{NODE_LABELS[activeNode]}…
              </p>
            )}
            {Object.entries(nodeOutputs).length === 0 && !activeNode && !error && (
              <p className="text-xs text-muted">
                点击“运行 Agent”查看节点执行过程和中间结果
              </p>
            )}
            {error && (
              <div className="rounded-lg border border-red/40 bg-red/5 p-3 text-xs text-red">
                {error}
                <button
                  onClick={handleSubmit}
                  className="mt-2 block rounded bg-red px-2 py-1 text-white hover:opacity-90"
                >
                  重试
                </button>
              </div>
            )}
            {Object.entries(nodeOutputs).map(([node, output]) => (
              <details key={node} open className="text-xs">
                <summary className="cursor-pointer font-medium text-muted">
                  {NODE_LABELS[node]}
                </summary>
                <div className="mt-1 rounded bg-panel p-2 text-muted">
                  <MarkdownMessage content={String(output)} />
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="flex min-h-[320px] flex-col rounded-xl border border-border bg-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">最终结果</h2>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={copyResult}
                  className="rounded-lg border border-border p-1.5 text-muted hover:text-foreground"
                  aria-label="复制结果"
                  title="复制结果"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-border p-1.5 text-muted hover:text-foreground"
                  aria-label="清空结果"
                  title="清空结果"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {!result && !running && !error && (
              <p className="text-xs text-muted">生成结果将显示在这里</p>
            )}
            {result &&
              result.questions.map((q, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-border p-4"
                >
                  <h3 className="mb-2 font-medium">
                    <span className="mr-2 text-accent">{i + 1}.</span>
                    {q.title}
                  </h3>
                  <div className="mb-2">
                    <p className="mb-1 text-xs font-medium text-muted">背景</p>
                    <div className="text-sm text-muted">
                      <MarkdownMessage content={q.background} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="mb-1 text-xs font-medium text-muted">考察点</p>
                    <div className="flex flex-wrap gap-1.5">
                      {q.focus.map((f, j) => (
                        <span
                          key={j}
                          className="rounded-full bg-background px-2 py-0.5 text-xs text-muted"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted">参考答案</p>
                    <div className="text-sm text-muted">
                      <MarkdownMessage content={q.answer} />
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function extractOutputs(
  data: Record<string, unknown>,
  setNodeOutputs: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setReview: React.Dispatch<
    React.SetStateAction<{ passed?: boolean; score?: number; feedback?: string[] }>
  >,
  setRetryCount: React.Dispatch<React.SetStateAction<number>>,
) {
  for (const [key, value] of Object.entries(data)) {
    if (key === "review" && value && typeof value === "object") {
      const r = value as { passed?: boolean; score?: number; feedback?: string[] };
      setReview({ passed: r.passed, score: r.score, feedback: r.feedback });
    } else if (key === "retryCount" && typeof value === "number") {
      setRetryCount(value);
    } else if (key === "questions") {
      continue;
    } else if (typeof value === "string" && value.length > 0) {
      setNodeOutputs((prev) => ({ ...prev, [key]: value }));
    }
  }
}
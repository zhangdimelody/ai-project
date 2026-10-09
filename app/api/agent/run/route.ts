import { randomUUID } from "node:crypto";
import { interviewGraph } from "@/src/agent/graph";
import { interviewInputSchema } from "@/src/agent/state";
import { encodeSse } from "@/src/lib/agent-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "请求体必须是有效 JSON" }, { status: 400 });
  }

  const parsed = interviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "输入参数无效" },
      { status: 400 },
    );
  }

  const threadId = parsed.data.threadId ?? randomUUID();
  const config = { configurable: { thread_id: threadId } };

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (event: Parameters<typeof encodeSse>[0]) =>
        controller.enqueue(encoder.encode(encodeSse(event)));

      try {
        const stream = await interviewGraph.stream(
          {
            topic: parsed.data.topic,
            techStack: parsed.data.techStack,
            difficulty: parsed.data.difficulty,
            questionCount: parsed.data.questionCount,
          },
          { ...config, streamMode: "updates" },
        );

        for await (const update of stream) {
          const [node, data] = Object.entries(update)[0] ?? [];
          if (!node) continue;
          send({ type: "node_started", node, threadId });
          send({ type: "node_updated", node, data, threadId });
          send({ type: "node_completed", node, data, threadId });
        }
        const snapshot = await interviewGraph.getState(config);
        send({
          type: "run_completed",
          data: snapshot.values,
          threadId,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Agent 执行失败";
        send({ type: "node_failed", error: message, threadId });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

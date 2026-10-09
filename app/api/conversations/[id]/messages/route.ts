import { randomUUID } from "node:crypto";
import { getModel } from "@/src/agent/model";
import { withModelRetry } from "@/src/agent/retry";
import {
  type ChatMessage,
  getConversation,
  updateConversation,
} from "@/src/lib/storage";
import type { AgentEvent } from "@/src/lib/agent-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

const SYSTEM_PROMPT =
  "你是一位乐于助人的 AI 助手，回答准确、清晰、简洁。使用与用户相同的语言作答。";

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const conversation = await getConversation(id);
  if (!conversation) {
    return Response.json({ error: "会话不存在" }, { status: 404 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体必须是有效 JSON" }, { status: 400 });
  }

  const { message } = (body ?? {}) as { message?: string };

  const isNewTurn = typeof message === "string" && message.trim().length > 0;
  if (!isNewTurn && conversation.messages.length === 0) {
    return Response.json({ error: "消息不能为空" }, { status: 400 });
  }

  const userMessage: ChatMessage | undefined = isNewTurn
    ? {
        id: randomUUID(),
        role: "user",
        content: message!.trim(),
        createdAt: new Date().toISOString(),
      }
    : undefined;

  const history = conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const promptInput = userMessage
    ? [...history, { role: "user" as const, content: userMessage.content }]
    : history;

  const model = getModel();
  const runId = randomUUID();

  const encoder = new TextEncoder();
  const body2 = new ReadableStream({
    async start(controller) {
      const send = (event: AgentEvent) => {
        const frame = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(frame));
      };

      let assistantContent = "";

      try {
        const stream = await withModelRetry(() =>
          model.stream([
            ["system", SYSTEM_PROMPT],
            ...promptInput,
          ]),
        );

        for await (const chunk of stream) {
          const token =
            typeof chunk.content === "string"
              ? chunk.content
              : Array.isArray(chunk.content)
                ? chunk.content.map((c) => c.text ?? "").join("")
                : "";
          if (!token) continue;
          assistantContent += token;
          send({ type: "token", data: { token }, threadId: id, runId });
        }

        const assistantMessage: ChatMessage = {
          id: randomUUID(),
          role: "assistant",
          content: assistantContent,
          createdAt: new Date().toISOString(),
        };

        const nextMessages = userMessage
          ? [...conversation.messages, userMessage, assistantMessage]
          : [...conversation.messages, assistantMessage];

        await updateConversation(id, { messages: nextMessages });

        send({
          type: "done",
          data: { message: assistantMessage },
          threadId: id,
          runId,
        });
      } catch (error) {
        const message2 =
          error instanceof Error ? error.message : "AI 回复失败";
        send({ type: "error", error: message2, threadId: id, runId });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body2, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
import { randomUUID } from "node:crypto";
import { createConversation, listConversations } from "@/src/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const conversations = await listConversations();
  return Response.json({ conversations });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体必须是有效 JSON" }, { status: 400 });
  }

  const { message } = (body ?? {}) as { message?: string };
  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "消息不能为空" }, { status: 400 });
  }

  const userMessage = {
    id: randomUUID(),
    role: "user" as const,
    content: message.trim(),
    createdAt: new Date().toISOString(),
  };

  const title = message.trim().slice(0, 40);
  const conversation = await createConversation(randomUUID(), title, [
    userMessage,
  ]);

  return Response.json({ conversation }, { status: 201 });
}
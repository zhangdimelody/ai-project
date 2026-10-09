"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import MarkdownMessage from "@/components/markdown-message";
import type {
  ChatMessage,
  Conversation,
} from "@/src/lib/conversation-types";

type StreamEvent = {
  type: string;
  data?: { token?: string; message?: ChatMessage };
  error?: string;
};

export default function ChatWindow({
  conversation,
}: {
  conversation: Conversation;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation.messages,
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // `text` 为空表示对会话中已存在的最后一条用户消息生成回复（创建会话首轮）
  const send = useCallback(
    async (text?: string) => {
      if (streaming) return;

      setError(undefined);
      setStreaming(true);

      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-a`,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        },
      ]);

      try {
        const res = await fetch(
          `/api/conversations/${conversation.id}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(text ? { message: text } : {}),
          },
        );

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "请求失败");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const dataLine = frame
              .split("\n")
              .find((line) => line.startsWith("data: "));
            if (!dataLine) continue;
            const event = JSON.parse(dataLine.slice(6)) as StreamEvent;

            if (event.type === "token" && event.data?.token) {
              const token = event.data.token;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = {
                    ...last,
                    content: last.content + token,
                  };
                }
                return copy;
              });
            } else if (event.type === "done" && event.data?.message) {
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = event.data!.message!;
                return copy;
              });
            } else if (event.type === "error") {
              setError(event.error ?? "回复失败");
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError((e as Error).message ?? "连接中断");
        }
      } finally {
        setStreaming(false);
      }
    },
    [conversation.id, streaming],
  );

  useEffect(() => {
    if (triggeredRef.current) return;
    const last = conversation.messages[conversation.messages.length - 1];
    if (last?.role === "user") {
      triggeredRef.current = true;
      send();
    }
  }, [conversation.messages, send]);

  const submit = () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    send(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "max-w-[85%] whitespace-pre-wrap bg-accent text-white"
                    : "max-w-full bg-panel border border-border"
                }`}
              >
                {m.role === "assistant" ? (
                  m.content ? (
                    <MarkdownMessage content={m.content} />
                  ) : streaming ? (
                    <span className="text-muted">思考中…</span>
                  ) : (
                    ""
                  )
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          {error && <p className="mb-2 text-sm text-red">{error}</p>}
          <div className="flex items-end gap-2 rounded-xl border border-border bg-panel p-2 shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="给 AI 发送消息"
              className="max-h-48 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
            />
            <button
              onClick={submit}
              disabled={streaming || !input.trim()}
              aria-label="发送"
              title="发送"
              className="rounded-lg bg-accent p-2 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
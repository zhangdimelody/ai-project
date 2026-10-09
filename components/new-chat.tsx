"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export default function NewChat() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    const content = message.trim();
    if (!content) {
      setError("请输入消息");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "创建会话失败");
        setLoading(false);
        return;
      }
      const data = await res.json();
      router.push(`/chat/${data.conversation.id}`);
    } catch (e) {
      setError((e as Error).message ?? "网络错误");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="mb-2 text-center text-2xl font-semibold">
          有什么可以帮你？
        </h1>
        <p className="mb-8 text-center text-sm text-muted">
          输入你的问题，AI 将为你解答
        </p>

        <div className="flex items-end gap-2 rounded-xl border border-border bg-panel p-2 shadow-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            placeholder="给 AI 发送消息"
            className="max-h-48 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none"
          />
          <button
            onClick={submit}
            disabled={loading}
            aria-label="发送"
            title="发送"
            className="rounded-lg bg-accent p-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mt-3 text-center text-sm text-red">{error}</p>}
      </div>
    </div>
  );
}
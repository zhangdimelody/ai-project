"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import LiquidLogo from "@/components/liquid-logo";
import type { Conversation } from "@/src/lib/conversation-types";

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, pathname]);

  const newChat = () => {
    router.push("/");
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    await load();
    if (pathname === `/chat/${id}`) {
      router.push("/");
    }
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-panel">
      <LiquidLogo />
      <div className="p-3">
        <button
          onClick={newChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          新建会话
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {loading ? (
          <p className="px-2 text-xs text-muted">加载中…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-xs text-muted">暂无历史会话</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => {
              const active = pathname === `/chat/${c.id}`;
              return (
                <li key={c.id}>
                  <Link
                    href={`/chat/${c.id}`}
                    className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-background"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex-1 truncate">{c.title}</span>
                    <button
                      onClick={(e) => remove(c.id, e)}
                      className="h-5 w-5 shrink-0 text-muted opacity-0 transition hover:text-red group-hover:opacity-100"
                      aria-label="删除会话"
                      title="删除会话"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
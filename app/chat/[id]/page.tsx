import { notFound } from "next/navigation";
import ChatWindow from "@/components/chat-window";
import { getConversation } from "@/src/lib/storage";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);
  if (!conversation) {
    notFound();
  }

  return (
    <div className="h-full">
      <div className="flex h-12 items-center border-b border-border bg-panel px-4">
        <span className="truncate text-sm font-medium">{conversation.title}</span>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <ChatWindow conversation={conversation} />
      </div>
    </div>
  );
}
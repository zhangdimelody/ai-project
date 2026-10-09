import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

type StoreShape = {
  conversations: Conversation[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "conversations.json");

// 不再缓存整个 store：API 路由与页面路由是彼此独立的模块实例，
// 进程内缓存会让新建的会话在 /chat/[id] 页面变成 404。
async function readStore(): Promise<StoreShape> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (Array.isArray(parsed?.conversations)) return parsed;
    return { conversations: [] };
  } catch {
    return { conversations: [] };
  }
}

async function writeStore(store: StoreShape): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function listConversations(): Promise<Conversation[]> {
  const store = await readStore();
  return [...store.conversations].sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );
}

export async function getConversation(
  id: string,
): Promise<Conversation | undefined> {
  const store = await readStore();
  return store.conversations.find((c) => c.id === id);
}

export async function createConversation(
  id: string,
  title: string,
  messages: ChatMessage[],
): Promise<Conversation> {
  const store = await readStore();
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id,
    title,
    messages,
    createdAt: now,
    updatedAt: now,
  };
  store.conversations.push(conversation);
  await writeStore(store);
  return conversation;
}

export async function updateConversation(
  id: string,
  patch: {
    title?: string;
    messages?: ChatMessage[];
  },
): Promise<Conversation | undefined> {
  const store = await readStore();
  const conversation = store.conversations.find((c) => c.id === id);
  if (!conversation) return undefined;
  if (patch.title !== undefined) conversation.title = patch.title;
  if (patch.messages !== undefined) conversation.messages = patch.messages;
  conversation.updatedAt = new Date().toISOString();
  await writeStore(store);
  return conversation;
}

export async function deleteConversation(id: string): Promise<boolean> {
  const store = await readStore();
  const before = store.conversations.length;
  store.conversations = store.conversations.filter((c) => c.id !== id);
  if (store.conversations.length === before) return false;
  await writeStore(store);
  return true;
}
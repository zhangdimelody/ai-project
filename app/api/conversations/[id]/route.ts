import { deleteConversation, getConversation } from "@/src/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const conversation = await getConversation(id);
  if (!conversation) {
    return Response.json({ error: "会话不存在" }, { status: 404 });
  }
  return Response.json({ conversation });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const deleted = await deleteConversation(id);
  if (!deleted) {
    return Response.json({ error: "会话不存在" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
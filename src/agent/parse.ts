/**
 * 模型有时会把 JSON 包在 markdown 代码块里，或在前后附带说明文字。
 * 这里尽量抽出真正的 JSON 片段，避免 JSON.parse 因为外层文本直接失败。
 */
export function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();

  const start = candidate.search(/[{[]/);
  if (start === -1) return candidate;

  const open = candidate[start];
  const close = open === "{" ? "}" : "]";
  const end = candidate.lastIndexOf(close);
  return end > start ? candidate.slice(start, end + 1) : candidate;
}

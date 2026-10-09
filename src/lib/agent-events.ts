export type AgentEventType =
  | "node_started"
  | "node_updated"
  | "node_completed"
  | "node_failed"
  | "run_completed"
  | "token"
  | "done"
  | "error";

export type AgentEvent = {
  type: AgentEventType;
  node?: string;
  data?: unknown;
  threadId?: string;
  runId?: string;
  error?: string;
};

export function encodeSse(event: AgentEvent) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

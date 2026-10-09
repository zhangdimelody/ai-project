import { getRetryable } from "@langchain/core/errors";

const DEFAULT_MAX_ATTEMPTS = 4;
const DEFAULT_BASE_DELAY_MS = 2_000;
const DEFAULT_MAX_DELAY_MS = 15_000;

/**
 * 智谱在平台侧过载时返回 429 + 业务错误码 1305（"该模型当前访问量过大"）。
 * LangChain 会把这类错误标记为可重试，但默认不会在请求内长时间退避，
 * 因此这里补一层带抖动的指数退避。
 */
const RETRYABLE_TEXT_HINTS = [
  "1305",
  "访问量过大",
  "model_rate_limit",
  "ratelimitcapacityerror",
  "rate limit",
  "too many requests",
];

function errorText(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const extra = error as Error & { code?: unknown; error?: unknown };
    return [error.name, error.message, extra.code, JSON.stringify(extra.error ?? "")]
      .filter(Boolean)
      .join(" ");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function errorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const candidate = error as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown };
  };
  const status = candidate.status ?? candidate.statusCode ?? candidate.response?.status;
  return typeof status === "number" ? status : undefined;
}

export function isRetryableModelError(error: unknown): boolean {
  // LangChain 已经对错误做过分类；显式的 false 表示不该重试（如欠费、鉴权失败）。
  const classified = getRetryable(error);
  if (classified !== undefined) return classified;
  if (errorStatus(error) === 429) return true;

  const text = errorText(error).toLowerCase();
  return RETRYABLE_TEXT_HINTS.some((hint) => text.includes(hint));
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withModelRetry<T>(operation: () => Promise<T>): Promise<T> {
  const maxAttempts = positiveInt(process.env.ZHIPU_MAX_ATTEMPTS, DEFAULT_MAX_ATTEMPTS);
  const baseDelayMs = positiveInt(process.env.ZHIPU_RETRY_BASE_MS, DEFAULT_BASE_DELAY_MS);

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableModelError(error) || attempt === maxAttempts) break;

      const backoff = Math.min(DEFAULT_MAX_DELAY_MS, baseDelayMs * 2 ** (attempt - 1));
      await sleep(backoff + Math.random() * baseDelayMs);
    }
  }

  if (isRetryableModelError(lastError)) {
    throw new Error(
      "模型服务当前访问量过大（智谱 429/1305），已自动重试多次仍失败。请稍后再试，或在 .env 中通过 ZHIPU_MODEL 切换到其他模型。",
    );
  }
  throw lastError;
}

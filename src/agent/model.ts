import { ChatOpenAI } from "@langchain/openai";

const DEFAULT_MODEL = "glm-4.5-flash";

/**
 * 智谱免费模型（如 GLM-4.7-Flash）在高峰时段容易触发 1305 平台过载，
 * 可通过 ZHIPU_MODEL 切换到其他模型（例如 glm-4.5-flash 或付费模型）。
 */
export function getModelName() {
  return process.env.ZHIPU_MODEL?.trim() || DEFAULT_MODEL;
}

export function getModel() {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 ZHIPU_API_KEY，请在 .env 中配置智谱 API Key");
  }

  return new ChatOpenAI({
    model: getModelName(),
    apiKey,
    configuration: {
      baseURL: "https://open.bigmodel.cn/api/paas/v4/",
    },
    temperature: 0.7,
  });
}

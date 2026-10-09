import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import 'dotenv/config';

async function main() {
  // 1. 初始化智谱大模型
  const model = new ChatOpenAI({
    model: "GLM-4.7-Flash",
    apiKey: process.env.ZHIPU_API_KEY,
    configuration: {
      baseURL: "https://open.bigmodel.cn/api/paas/v4/",
    },
    temperature: 0.7,
  });

  // 2. 定义提示词模板 (Prompt Template)
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "你是一位资深的 AI 智能体技术专家兼。请针对用户提供的技术栈，设计3道面向 AI 智能体岗位的深度题，重点考察 Agent 架构设计、工具调用、RAG、记忆与上下文管理、规划推理、评估以及安全性。每道题请包含题目背景、考察点和参考答案，避免只考察基础概念。"],
    ["user", "我想的 AI 智能体技术栈是：{tech_stack}"]
  ]);

  // 3. 定义输出解析器 (Output Parser)
  const outputParser = new StringOutputParser();

  // 4. 组装成一条“链” (Chain)
  // 这里的管道符 | 是 LangChain 的灵魂，就像前端的中间件或者 Linux 的管道
  const chain = prompt.pipe(model).pipe(outputParser);

  console.log("🚀 正在为您生成题，请稍候...\n");

  // 5. 运行链
  const response = await chain.invoke({
    tech_stack: "Python + LangChain + RAG + Function Calling"
  });

  console.log("💡 题目生成完毕：");
  console.log(response);
}

main().catch(console.error);


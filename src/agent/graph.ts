import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { getModel } from "./model";
import { extractJsonText } from "./parse";
import { withModelRetry } from "./retry";
import {
  InterviewState,
  type InterviewStateType,
  questionsSchema,
  reviewSchema,
} from "./state";
import {
  analysisPrompt,
  generationPrompt,
  planningPrompt,
  reviewPrompt,
  rewritePrompt,
} from "./prompts";

const modelOutput = async (system: string, user: string) => {
  const model = getModel();
  return withModelRetry(() =>
    model.invoke([
      ["system", system],
      ["user", user],
    ]),
  );
};

const text = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value);

async function analyzeRequirements(state: InterviewStateType) {
  const response = await modelOutput(
    analysisPrompt,
    `主题：${state.topic}\n技术栈：${state.techStack}\n难度：${state.difficulty}`,
  );
  return { analysis: text(response.content), currentNode: "analyze_requirements" };
}

async function planInterview(state: InterviewStateType) {
  const response = await modelOutput(
    planningPrompt,
    `能力画像：${state.analysis}\n题目数量：${state.questionCount}\n难度：${state.difficulty}`,
  );
  return { plan: text(response.content), currentNode: "plan_interview" };
}

async function generateQuestions(state: InterviewStateType) {
  const response = await modelOutput(
    generationPrompt,
    `主题：${state.topic}\n技术栈：${state.techStack}\n能力画像：${state.analysis}\n面试计划：${state.plan}\n请生成 ${state.questionCount} 道题。`,
  );
  const parsed = questionsSchema.parse(JSON.parse(extractJsonText(text(response.content))));
  return { questions: parsed.questions, currentNode: "generate_questions" };
}

async function reviewQuestions(state: InterviewStateType) {
  const response = await modelOutput(
    reviewPrompt,
    `主题：${state.topic}\n难度：${state.difficulty}\n要求题数：${state.questionCount}\n题目：${JSON.stringify(state.questions)}`,
  );
  const review = reviewSchema.parse(JSON.parse(extractJsonText(text(response.content))));
  return { review, currentNode: "review_questions" };
}

async function rewriteQuestions(state: InterviewStateType) {
  const response = await modelOutput(
    rewritePrompt,
    `原题：${JSON.stringify(state.questions)}\n审核反馈：${JSON.stringify(state.review?.feedback)}\n请输出完整修订后的题目数组。`,
  );
  const parsed = questionsSchema.parse(JSON.parse(extractJsonText(text(response.content))));
  return {
    questions: parsed.questions,
    retryCount: state.retryCount + 1,
    currentNode: "rewrite_questions",
  };
}

function routeAfterReview(state: InterviewStateType) {
  if (state.review?.passed || state.retryCount >= 2) return END;
  return "rewrite_questions";
}

export function createInterviewGraph() {
  return new StateGraph(InterviewState)
    .addNode("analyze_requirements", analyzeRequirements)
    .addNode("plan_interview", planInterview)
    .addNode("generate_questions", generateQuestions)
    .addNode("review_questions", reviewQuestions)
    .addNode("rewrite_questions", rewriteQuestions)
    .addEdge(START, "analyze_requirements")
    .addEdge("analyze_requirements", "plan_interview")
    .addEdge("plan_interview", "generate_questions")
    .addEdge("generate_questions", "review_questions")
    .addConditionalEdges("review_questions", routeAfterReview)
    .addEdge("rewrite_questions", "review_questions")
    .compile({ checkpointer: new MemorySaver() });
}

export const interviewGraph = createInterviewGraph();

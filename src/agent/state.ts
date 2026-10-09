import { z } from "zod";
import { Annotation } from "@langchain/langgraph";

export const interviewInputSchema = z.object({
  topic: z.string().trim().min(2, "请输入面试主题"),
  techStack: z.string().trim().min(2, "请输入技术栈"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  questionCount: z.number().int().min(1).max(10),
  threadId: z.string().optional(),
});

export const questionSchema = z.object({
  title: z.string(),
  background: z.string(),
  focus: z.array(z.string()),
  answer: z.string(),
});

export const questionsSchema = z.object({
  questions: z.array(questionSchema),
});

export const reviewSchema = z.object({
  passed: z.boolean(),
  score: z.number().min(0).max(100),
  feedback: z.array(z.string()),
});

export type InterviewInput = z.infer<typeof interviewInputSchema>;
export type InterviewQuestion = z.infer<typeof questionSchema>;
export type InterviewReview = z.infer<typeof reviewSchema>;

export const InterviewState = Annotation.Root({
  topic: Annotation<string>,
  techStack: Annotation<string>,
  difficulty: Annotation<"beginner" | "intermediate" | "advanced">,
  questionCount: Annotation<number>,
  analysis: Annotation<string>,
  plan: Annotation<string>,
  questions: Annotation<InterviewQuestion[]>({
    reducer: (_current, update) => update,
    default: () => [],
  }),
  review: Annotation<InterviewReview | undefined>,
  retryCount: Annotation<number>({
    reducer: (_current, update) => update,
    default: () => 0,
  }),
  currentNode: Annotation<string>,
  errors: Annotation<string[]>({
    default: () => [],
    reducer: (current, update) => current.concat(update),
  }),
});

export type InterviewStateType = typeof InterviewState.State;

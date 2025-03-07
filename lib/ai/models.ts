import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openrouter } from '@openrouter/ai-sdk-provider';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

export const DEFAULT_CHAT_MODEL: string = 'chat-model-openai';

export const myProvider = customProvider({
  languageModels: {
    "chat-model-openai": openai("o3-mini"),
    "chat-model-gemini": google("gemini-2.0-flash"),
    "chat-model-claude": anthropic("claude-3-7-sonnet-20250219"),
    "chat-model-reasoning": wrapLanguageModel({
      model: openrouter("google/gemini-2.0-flash-thinking-exp:free"),
      //model: openrouter("google/gemini-2.0-flash-thinking-exp:free"),
      //model: openrouter("deepseek/deepseek-r1-distill-llama-70b"),
      //model: openrouter("microsoft/phi-4"),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    "title-model": openai("o3-mini"),
    "artifact-model": openai("o3-mini"),
  },
  imageModels: {
    'small-model': openai.image("dall-e-3"),
    // 'large-model': openai.image("dall-e-3"),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-openai',
    name: 'Openai model',
    description: 'o3-mini',
  },
  {
    id: 'chat-model-gemini',
    name: 'Gemini model',
    description: 'gemini-2.0-flash',
  },
  {
    id: 'chat-model-claude',
    name: 'Claude model',
    description: 'claude-3-7-sonnet',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Openrouter reasoning',
    description: 'google/gemini-2.0-flash-thinking-exp:free',
  },
];
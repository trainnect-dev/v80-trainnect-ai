# Update Models

The chatbot template ships with [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) as the default model provider. Since the template is powered by the [AI SDK](https://sdk.vercel.ai), which supports [multiple providers](https://sdk.vercel.ai/providers/ai-sdk-providers) out of the box, you can easily switch to another provider of your choice.

To update the models, you will need to update the custom provider called `myProvider` at `/lib/ai/models.ts` shown below.

You can replace the `openai` models with any other provider of your choice. You will need to install the provider library and switch the models accordingly.

For example, if you want to use Anthropic's `claude-3-5-sonnet` model for `chat-model-large`, you can replace the `openai` model with the `anthropic` model as shown below.

```ts
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
    "chat-model-anthropic": anthropic("claude-3-7-sonnet-20250219"),
    "chat-model-reasoning": wrapLanguageModel({
      model: openrouter("deepseek/deepseek-r1-distill-llama-70b"),
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
    name: 'Openrouter model',
    description: 'deepseek-r1-distill-llama-70b',
  },
];

```

You can find the provider library and model names in the [provider](https://sdk.vercel.ai/providers/ai-sdk-providers)'s documentation. Once you have updated the models, you should be able to use the new models in your chatbot.

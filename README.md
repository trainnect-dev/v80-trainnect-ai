<a href="https://trainnect.com/">
  <img alt="Next.js 15, App Router, React 19, AI SDK." src="public/images/technical-course-header.jpg">
  <h1 align="center">Next.js 15 - React 19 AI</h1>
</a>

<p align="center">
  An Technical Course Creator AI Built With Next.js, React and Vercel AI.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication

## Model Providers

This template ships with OpenAI `o3-mini` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## How to Test the Models

This project includes a test script that allows you to verify all the AI models are working correctly. This is especially useful for everyone who is learning about different AI models and their capabilities.

### Setup

1. Make sure your `.env.local` file contains all the necessary API keys:
   - `OPENAI_API_KEY` - For OpenAI models
   - `ANTHROPIC_API_KEY` - For Anthropic Claude models
   - `GOOGLE_GENERATIVE_AI_API_KEY` - For Google Gemini models
   - `OPENROUTER_API_KEY` - For accessing various models through OpenRouter

2. The test script is located at `test-models.ts` and includes tests for:
   - OpenAI's o3-mini (chat-model-small)
   - Google's gemini-2.0-flash (chat-model-medium)
   - Anthropic's claude-3-7-sonnet (chat-model-large)
   - DeepSeek's deepseek-r1-distill-llama-70b via OpenRouter (chat-model-reasoning)

### Running the Tests

We've included a shell script that loads environment variables and runs the tests:

```bash
# Make the script executable (only needed once)
chmod +x run-test.sh

# If you run into permission issues run the command below and then enter your password:  
sudo chmod +x run-test.sh

# Run the tests
./run-test.sh
```

### Expected Output

The test will send a simple "Hello, how are you?" prompt to each model and display the responses. For models with reasoning capabilities (Anthropic and OpenRouter), it will also attempt to display the reasoning process.

### Customizing the Tests

You can modify the `test-models.ts` file to:
- Test different prompts
- Adjust model parameters
- Add tests for additional models
- Test specific features like reasoning, tool use, etc.

### Troubleshooting

If you encounter errors:
1. Check that all API keys are correctly set in your `.env.local` file
2. Verify that you have installed all required dependencies
3. For Anthropic models, ensure the `budgetTokens` parameter is at least 1024
4. For OpenRouter models, check that the model ID is correct and available through your account

## Remove and reinstall node_modules and dependencies

rm -rf node_modules
rm -rf .next
npm cache clean --force

# If using pnpm
pnpm store prune

# Then reinstall dependencies
```bash
pnpm install
pnpm dev
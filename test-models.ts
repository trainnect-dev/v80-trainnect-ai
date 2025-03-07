import { myProvider } from './lib/ai/models';
import { generateText } from 'ai';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({
  path: '.env.local',
});

async function testModels() {
  try {
    console.log("Testing OpenAI model (o3-mini)...");
    const openaiResult = await generateText({
      model: myProvider.languageModel("chat-model-openai"),
      prompt: "Hello, how are you?",
    });
    console.log("OpenAI result:", openaiResult.text);
    console.log("OpenAI model test successful!");
    
    console.log("\nTesting Google model (gemini-2.0-flash)...");
    const googleResult = await generateText({
      model: myProvider.languageModel("chat-model-gemini"),
      prompt: "Hello, how are you?",
    });
    console.log("Google result:", googleResult.text);
    console.log("Google model test successful!");
    
    console.log("\nTesting Anthropic model (claude-3-7-sonnet-20250219)...");
    const anthropicResult = await generateText({
      model: myProvider.languageModel("chat-model-claude"),
      prompt: "Hello, how are you?",
      providerOptions: {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens: 1024 },
        },
      },
    });
    console.log("Anthropic result:", anthropicResult.text);
    console.log("Anthropic reasoning:", anthropicResult.reasoning);
    console.log("Anthropic model test successful!");
    
    console.log("\nTesting OpenRouter model (deepseek/deepseek-r1-distill-llama-70b)...");
    const openrouterResult = await generateText({
      model: myProvider.languageModel("chat-model-reasoning"),
      prompt: "Hello, how are you?",
    });
    console.log("OpenRouter result:", openrouterResult.text);
    console.log("OpenRouter reasoning:", openrouterResult.reasoning);
    console.log("OpenRouter model test successful!");
    
  } catch (error) {
    console.error("Error testing models:", error);
  }
}

testModels();

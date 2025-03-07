import { tool } from 'ai';
import { z } from 'zod';
import { tavily } from '@tavily/core';

export const tavilySearch = tool({
  description: 'Search the web for factual information using Tavily search API',
  parameters: z.object({
    query: z.string().describe('The search query to find information about'),
    searchDepth: z
      .enum(['basic', 'advanced'])
      .optional()
      .describe('The depth of the search, basic is faster, advanced is more comprehensive'),
    maxResults: z
      .number()
      .optional()
      .describe('Maximum number of results to return, defaults to 5'),
    includeRawContent: z
      .boolean()
      .optional()
      .describe('Whether to include the raw content of the search results'),
    includeImages: z
      .boolean()
      .optional()
      .describe('Whether to include images in the search results'),
  }),
  execute: async ({ 
    query, 
    searchDepth = 'basic', 
    maxResults = 5, 
    includeRawContent = false,
    includeImages = false
  }) => {
    // Get the API key from environment variables
    const apiKey = process.env.TAVILY_API_KEY;
    
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY is not set in environment variables');
    }

    try {
      // Initialize the Tavily client with the API key
      const tavilyClient = tavily({
        apiKey: apiKey
      });

      // Use the Tavily client to perform the search
      const searchData = await tavilyClient.search(query, {
        searchDepth,
        maxResults,
        includeRawContent,
        includeImages
      });

      return searchData;
    } catch (error) {
      console.error('Error in Tavily search:', error);
      return {
        error: 'Failed to perform search',
        message: error instanceof Error ? error.message : String(error)
      };
    }
  },
});

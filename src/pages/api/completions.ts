// pages/api/completion.ts

import { LLMAPIFactory, LLMResponse } from '@/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, systemContext, provider, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Missing required field: prompt' });
    }

    // Initialize the appropriate API handler based on provider
    const api = LLMAPIFactory.createAPI(provider || 'anthropic', { model });

    // Call the API
    const response: LLMResponse = await api.complete({
      content: prompt,
      systemContext: systemContext || ''
    });

    if (!response.success) {
      throw new Error(response.error || 'Unknown error occurred with LLM API');
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({
      message: 'Error processing completion request',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
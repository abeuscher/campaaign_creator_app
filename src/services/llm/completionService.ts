export type CompletionProvider = 'mistral' | 'anthropic' | 'openai';

// Format to match the structure expected by your Netlify function
interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export async function callNetlifyCompletion(
  prompt: string,
  systemContext: string = '',
  provider: CompletionProvider = 'anthropic',
  existingChatHistory: ChatMessage[] = []
): Promise<string> {
  // Create the chat history array expected by your Netlify function
  const chatHistory = [...existingChatHistory];
  
  // Add system message if provided
  if (systemContext) {
    chatHistory.push({
      role: 'system',
      content: systemContext
    });
  }
  
  // Add user message
  chatHistory.push({
    role: 'user',
    content: prompt
  });

  try {
    // Call your Netlify function
    const response = await fetch('/.netlify/functions/open-ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatHistory,
        newValue: prompt,
        aiOption: provider // You'll need to modify your Netlify function to use this
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Extract the assistant's response
    const assistantMessage = data[data.length - 1];
    if (assistantMessage && assistantMessage.role === 'assistant') {
      return assistantMessage.content;
    }
    
    throw new Error('No assistant response found in the data');
  } catch (error) {
    console.error('Netlify function error:', error);
    throw error;
  }
}

// Function to extract JSON from LLM response
export function extractJSONFromResponse(response: string): any {
  try {
    // Look for JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Error extracting JSON:', error);
    throw error;
  }
}

// File upload function that uses the Netlify function
export async function uploadFile(
  file: File,
  existingChatHistory: ChatMessage[] = []
): Promise<{ chatHistory: ChatMessage[], fileContent: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatHistory', JSON.stringify(existingChatHistory));

    const response = await fetch('/.netlify/functions/utils', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      chatHistory: data.chatHistory || existingChatHistory,
      fileContent: data.file ? data.file.content : ''
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'
import { formHandler } from './utils.js'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Define token limit for the model
const TOKEN_LIMIT = 8192

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  console.log('Processing JSON request...',  JSON.parse(event.body))
  if (
    event.headers['content-type'] &&
    event.headers['content-type'].includes('multipart/form-data')
  ) {
    const response = await formHandler(event)
    return response
  } else {
    
    try {
      let { messages, system } = JSON.parse(event.body)

      let params = {
        messages: messages,
        max_tokens: TOKEN_LIMIT,
        model: 'claude-3-5-sonnet-20241022',
        system: system // Insert concatenated system content here
      }

      const response = await anthropic.messages.create(params)

      messages.push({ role: 'assistant', content: response.content[0].text })
      
      return {
        statusCode: 200,
        body: JSON.stringify(messages)
      }
    } catch (error) {
      // Log error details
      console.error('Error processing request:', error)

      return {
        statusCode: 500,
        body: JSON.stringify({ message: `Server error: ${error.message}` })
      }
    }
  }
}

export { handler }

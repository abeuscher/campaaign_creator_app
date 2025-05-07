import { Buffer } from 'buffer'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // Example: 2MB size limit

const formHandler = async (event) => {
  // Handle multipart form data (file uploads) independently
  try {
    const formData = parseMultipartForm(event)

    if (!formData || !formData.file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No file found in form data' })
      }
    }

    const updatedChatHistory = formData.chatHistory || []
    updatedChatHistory.push({
      role: 'system',
      content: `File uploaded: ${formData.file.filename}, Size: ${Buffer.byteLength(formData.file.content, 'utf8')} bytes\n${formData.file.content}`
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File processed and added to system content',
        chatHistory: updatedChatHistory
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Server error: ${error.message}` })
    }
  }
}

const parseMultipartForm = (event) => {
  const boundary = event.headers['content-type'].split('boundary=')[1]
  let result = { file: null, chatHistory: null, aiOption: null }

  try {
    const parts = Buffer.from(event.body, 'base64').toString().split(`--${boundary}`)

    parts.forEach((part) => {
      if (part.includes('filename=')) {
        const filenameMatch = part.match(/filename="(.+)"/)
        if (filenameMatch) {
          const filename = filenameMatch[1]
          const content = part.split('\r\n\r\n').slice(1).join('\r\n\r\n').trim()
          const fileSize = Buffer.byteLength(content, 'utf8')

          if (fileSize > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds the allowed limit of ${MAX_FILE_SIZE} bytes`)
          }

          result.file = { filename, content }
        }
      } else if (part.includes('name="chatHistory"')) {
        const content = part.split('\r\n\r\n')[1].trim()
        result.chatHistory = JSON.parse(content)
      } else if (part.includes('name="aiOption"')) {
        const content = part.split('\r\n\r\n')[1].trim()
        result.aiOption = content
      }
    })
  } catch (error) {
    throw new Error('Error parsing multipart form: ' + error.message)
  }

  return result
}

export { formHandler }

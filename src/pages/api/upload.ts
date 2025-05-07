// pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB size limit

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form with formidable
    const form = new formidable.IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ message: `Form parsing error: ${err.message}` });
          return resolve(true);
        }

        try {
          const file = files.file;
          
          if (!file || Array.isArray(file)) {
            res.status(400).json({ message: 'No file or multiple files received' });
            return resolve(true);
          }

          // Read the file content
          const filePath = file.filepath;
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // Process the chat history if provided
          let chatHistory = [];
          if (fields.chatHistory && !Array.isArray(fields.chatHistory)) {
            try {
              chatHistory = JSON.parse(fields.chatHistory);
            } catch (e) {
              console.error('Error parsing chat history:', e);
            }
          }

          // Add file info to chat history
          chatHistory.push({
            role: 'system',
            content: `File uploaded: ${file.originalFilename}, Size: ${file.size} bytes\n${fileContent}`,
            timestamp: new Date().toISOString()
          });

          // Clean up the temp file
          fs.unlinkSync(filePath);

          res.status(200).json({
            message: 'File processed and added to system content',
            chatHistory: chatHistory,
            filename: file.originalFilename,
            fileContent
          });
          
          return resolve(true);
        } catch (error) {
          console.error('File processing error:', error);
          res.status(500).json({
            message: 'Error processing file',
            error: error instanceof Error ? error.message : String(error)
          });
          return resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('General upload error:', error);
    return res.status(500).json({
      message: 'Server error during upload',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
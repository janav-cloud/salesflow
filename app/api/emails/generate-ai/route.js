import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { fileName, category, prompt } = await req.json();
    const processedFileName = `${fileName.replace('.csv', '')}-processed.json`;
    const processedFilePath = path.join(process.cwd(), 'uploads', processedFileName);

    try {
      const fileContent = await fs.readFile(processedFilePath, 'utf-8');
      const leads = JSON.parse(fileContent);
      const filteredLeads = leads.filter(lead => lead.Category === category);

      if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required for AI generation.' }, { status: 400 });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const aiPrompt = `
You are an expert marketing assistant specializing in crafting outreach emails for different lead categories. The user wants to email leads categorized as "${category}". Based on the following user prompt, generate a compelling and concise email subject and body.

User Prompt: ${prompt}

Consider that these leads are in the "${category}" category, which implies [describe the characteristics of this category, e.g., for "Most Likely to Convert": "they have shown strong interest and are likely ready to make a decision soon"; for "Future Scope": "they have potential but need more nurturing and information"].

The email should aim to [state the objective, e.g., "encourage them to schedule a brief consultation to discuss their needs further" or "introduce our key services and highlight the benefits for their type of company"].

Please ensure the email body clearly articulates [mention key information, e.g., "the core value proposition of our services and a clear benefit tailored to their potential future growth"].

Maintain a [specify tone, e.g., "professional yet friendly" or "concise and action-oriented"] tone. Use the placeholder \${Company_Name} for the company name and "Customer" for a generic contact person.

Return ONLY the subject and body, labeled as "Subject:" and "Body:". The email should be relatively brief and easy to read. Do not include any extra text, explanations, greetings beyond "Dear Consumer,", or closing remarks beyond a professional closing like "Sincerely," followed by "The [Your Company Name] Team".
`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      let generatedText = response.text();

      // Improved regular expressions to extract subject and body
      const subjectMatch = generatedText.match(/Subject:\s*([^\n]+)/i);  // Extract until the first newline
      const bodyMatch = generatedText.match(/Body:\s*([\s\S]*)/i);     // Extract everything after "Body:"

      let subject = subjectMatch ? subjectMatch[1].trim() : null;
      let body = bodyMatch ? bodyMatch[1].trim() : null;

      if (subject && body) {
          return NextResponse.json({ subject, body });
      }
      else {
          console.error("Could not reliably extract subject and body from AI response:", generatedText);
          return NextResponse.json({ error: "Failed to extract subject and body from AI response." }, { status: 500 });
      }

    } catch (readError) {
      console.error('Error reading processed file for AI generation:', readError);
      return NextResponse.json({ error: 'Could not read processed data.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error processing AI email generation request:', error);
    return NextResponse.json({ error: 'Failed to process AI email generation request.' }, { status: 500 });
  }
}
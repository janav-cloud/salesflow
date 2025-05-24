// app/api/emails/send/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendEmail } from '@/lib/mailer';
import { convert } from 'html-to-text';

function convertPlainTextToHTML(text) {
  let html = text
    .replace(/(\r\n|\n|\r)/gm, "<br/>") // Convert line breaks to <br/>
    .split(/\n\s*\n/g)                 // Split by double line breaks for paragraphs
    .map(p => `<p>${p.trim()}</p>`)       // Wrap each paragraph in <p> tags
    .join('');                        // Join the paragraphs back

  return html;
}

export async function GET(req) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const searchParams = req.nextUrl.searchParams;
        const fileName = searchParams.get('fileName');
        const category = searchParams.get('category');
        const templateSubject = searchParams.get('subject');
        const templateBody = searchParams.get('body');

        if (!fileName || !category || !templateSubject || !templateBody) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Missing required parameters (fileName, category, subject, body).' })}\n\n`));
          controller.close();
          return;
        }

        const processedFileName = `${fileName.replace('.csv', '')}-processed.json`;
        const processedFilePath = path.join(process.cwd(), 'uploads', processedFileName);

        try {
          const fileContent = await fs.readFile(processedFilePath, 'utf-8');
          const leads = JSON.parse(fileContent);

          const filteredLeads = leads.filter(lead => lead.Category === category && lead.Company_Client_Email);
          const totalEmails = filteredLeads.length;
          let sentCount = 0;

          if (totalEmails === 0) {
            const message = `No emails to send for category "${category}" in file "${fileName}".`;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: false, message })}\n\n`));
            controller.close();
            return;
          }

          for (const lead of filteredLeads) {
            const { Company_Name, Company_Client_Email } = lead;

            let personalizedSubject = templateSubject.replace(/\${Company_Name}/g, Company_Name);
            let personalizedBody = templateBody.replace(/\${Company_Name}/g, Company_Name);

            const htmlBody = convertPlainTextToHTML(personalizedBody); // Convert to HTML

            try {
              const result = await sendEmail({
                to: Company_Client_Email,
                subject: personalizedSubject,
                html: htmlBody, // Use the generated HTML
                text: convert(htmlBody),
              });
              sentCount++;
              const progress = Math.round((sentCount / totalEmails) * 100);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress, sent: sentCount, total: totalEmails, to: Company_Client_Email, success: result.success, error: result.error })}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
              console.error(`Error sending email to ${Company_Client_Email}:`, error);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress: Math.round((sentCount / totalEmails) * 100), sent: sentCount, total: totalEmails, to: Company_Client_Email, success: false, error: 'Failed to send email' })}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ complete: true, sent: sentCount, total: totalEmails })}\n\n`));
          controller.close();

        } catch (readError) {
          console.error('Error reading processed file for sending emails:', readError);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Could not read processed data for the selected file.' })}\n\n`));
          controller.close();
        }

      } catch (error) {
        console.error('Error initiating email sending:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to initiate email sending.' })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { fileName, category } = await req.json();
    const processedFileName = `${fileName.replace('.csv', '')}-processed.json`;
    const processedFilePath = path.join(process.cwd(), 'uploads', processedFileName);

    try {
      const fileContent = await fs.readFile(processedFilePath, 'utf-8');
      const leads = JSON.parse(fileContent);

      const filteredLeads = leads.filter(lead => lead.Category === category);

      if (filteredLeads.length === 0) {
        return NextResponse.json({ subject: `No leads in category "${category}"`, body: `No leads found in the "${category}" category for the file "${fileName}".` });
      }

      // Common email structure with placeholders
      const commonSubject = `Exclusive Opportunity for ${'${Company_Name}'} (${category} Lead)`;
      const commonBody = `Dear ${'${Company_Name}'},\n\nBased on our analysis, your company falls into the "${category}" category, indicating a strong potential for [mention your product/service benefit].\n\nWe would like to offer you [briefly mention your offer].\n\n[Include a call to action and your contact information].`;

      return NextResponse.json({ subject: commonSubject, body: commonBody });

    } catch (readError) {
      console.error('Error reading processed file for email generation:', readError);
      return NextResponse.json({ error: 'Could not read processed data.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error generating email structure:', error);
    return NextResponse.json({ error: 'Failed to generate email structure.' }, { status: 500 });
  }
}
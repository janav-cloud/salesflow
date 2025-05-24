// app/api/process-file-background/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { fileName } = await req.json();
    const filePath = path.join(process.cwd(), 'uploads', fileName);

    try {
      const fileBuffer = await fs.readFile(filePath);

      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer]), fileName);

      const predictResponse = await fetch("http://localhost:8000/predict", {
        method: 'POST',
        body: formData,
      });

      if (!predictResponse.ok) {
        console.error('FastAPI prediction failed:', predictResponse.status, await predictResponse.text());
        return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
      }

      const categorizedData = await predictResponse.json();

      if (categorizedData && categorizedData.leads) {
        const processedFileName = `${fileName.replace('.csv', '')}-processed.json`;
        const processedFilePath = path.join(process.cwd(), 'uploads', processedFileName);
        await fs.writeFile(processedFilePath, JSON.stringify(categorizedData.leads, null, 2), 'utf-8');

        return NextResponse.json({ success: true, message: `Processing of ${fileName} completed and data saved to ${processedFileName}` });
      } else {
        return NextResponse.json({ error: 'Invalid categorized data received from FastAPI' }, { status: 500 });
      }
    } catch (readFileError) {
      console.error('Error reading uploaded file:', readFileError);
      return NextResponse.json({ error: 'Could not read the uploaded file.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing file in background:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
// app/api/upload/route.js
import { writeFile, mkdir, readFile, writeFile as saveFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensure SSR revalidation if needed

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const timestamp = new Date().toISOString();
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Update metadata
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    let metadata = [];

    try {
      const existing = await readFile(metadataPath, 'utf8');
      metadata = JSON.parse(existing);
    } catch (err) {
      // File probably doesn't exist, skip
    }

    metadata.push({
      filename,
      originalName: file.name,
      timestamp,
    });

    await saveFile(metadataPath, JSON.stringify(metadata, null, 2));

    return new Response(JSON.stringify({
      message: 'File uploaded successfully',
      filename,
      originalName: file.name,
    }), { status: 200 });
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
}
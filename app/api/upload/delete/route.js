import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filepath = path.join(uploadsDir, filename);
    const metadataPath = path.join(uploadsDir, 'metadata.json');

    // Delete the file
    await fs.unlink(filepath).catch(() => null); // ignore if already deleted

    // Update metadata
    let metadata = [];
    try {
      const data = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(data);
    } catch (err) {
      console.error('Failed to read metadata:', err);
    }

    const updated = metadata.filter((file) => file.filename !== filename);
    await fs.writeFile(metadataPath, JSON.stringify(updated, null, 2));

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
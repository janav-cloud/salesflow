import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const metadataPath = path.join(uploadsDir, 'metadata.json');

    let metadata = [];
    try {
      const data = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(data);
    } catch (err) {
      console.error('Metadata read error:', err);
    }

    // Sort latest first
    const sorted = metadata.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const startIndex = (page - 1) * limit;
    const paginatedFiles = sorted.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(sorted.length / limit);

    return NextResponse.json({
      files: paginatedFiles,
      totalPages,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'Failed to read uploaded files' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 1MB)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File terlalu besar! Maksimal 1MB' },
        { status: 400 }
      );
    }

    // Validasi format file
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak valid! Gunakan PNG, JPG, atau WEBP' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the path relative to public directory
    const filePath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filePath: filePath,
      message: 'File berhasil diupload'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary credentials exist, upload to Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const uploadForm = new FormData();
        uploadForm.append('file', fileUri);
        uploadForm.append('upload_preset', 'ml_default');

        const cloudRes = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: uploadForm,
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          return NextResponse.json({
            url: cloudData.secure_url,
            publicId: cloudData.public_id,
            width: cloudData.width,
            height: cloudData.height,
          });
        }
      } catch (err) {
        console.warn('Cloudinary upload fallback to local storage:', err);
      }
    }

    // 2. Built-in Local Storage fallback (instant zero-config support)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, sanitizedName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${sanitizedName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: sanitizedName,
      size: file.size,
      success: true,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

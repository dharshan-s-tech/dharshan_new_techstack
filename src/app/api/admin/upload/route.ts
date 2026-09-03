import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'file';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Max size: 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();

    // Whitelist check
    const allowedImageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const allowedFileExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'];

    if (type === 'image' && !allowedImageExts.includes(ext)) {
      return NextResponse.json({ error: `Invalid image format. Allowed: ${allowedImageExts.join(', ')}` }, { status: 400 });
    }
    if (type === 'file' && !allowedFileExts.includes(ext)) {
      return NextResponse.json({ error: `Invalid file format. Allowed: ${allowedFileExts.join(', ')}` }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const folder = type === 'image' ? 'images' : 'uploads';
    const uploadDir = join(process.cwd(), 'public', 'admin-uploads', folder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    const url = `/admin-uploads/${folder}/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

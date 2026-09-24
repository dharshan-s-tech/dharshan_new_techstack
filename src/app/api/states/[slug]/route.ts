import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await aeService.getAeHomepageData(slug);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API /api/states/[slug]] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

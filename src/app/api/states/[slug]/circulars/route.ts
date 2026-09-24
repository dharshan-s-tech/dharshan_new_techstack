import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 30;

    const circulars = await aeService.getAeCirculars(limit);
    return NextResponse.json({
      state_slug: slug,
      total: circulars.length,
      items: circulars
    });
  } catch (error: any) {
    console.error('[API /api/states/[slug]/circulars] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

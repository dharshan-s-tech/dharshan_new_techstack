import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const ppo = searchParams.get('ppo') || undefined;
    const cname = searchParams.get('cname') || undefined;
    const treasury = searchParams.get('treasury') || undefined;
    const phase = searchParams.get('phase') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await aeService.getBiharPensions({
      ppo,
      cname,
      treasury,
      phase,
      page,
      limit
    });

    return NextResponse.json({
      state_slug: slug,
      page,
      limit,
      total: result.total,
      items: result.items
    });
  } catch (error: any) {
    console.error('[API /api/states/[slug]/pension] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

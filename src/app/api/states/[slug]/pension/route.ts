import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const ppo = searchParams.get('ppo');
    const phase = searchParams.get('phase') || undefined;

    if (!ppo) {
      return NextResponse.json({ error: 'PPO number is required' }, { status: 400 });
    }

    const records = await aeService.queryPension(ppo, undefined, phase);
    return NextResponse.json({
      state_slug: slug,
      ppo,
      count: records.length,
      records
    });
  } catch (error: any) {
    console.error('[API /api/states/[slug]/pension] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const site = await aeService.getAeWebsiteBySlug(slug);
    const stateId = site?.state_id || 64;

    const { searchParams } = new URL(request.url);
    const reportTypeId = searchParams.get('type') ? parseInt(searchParams.get('type')!, 10) : undefined;

    const reports = await aeService.getAeStateAccounts(stateId, reportTypeId);
    return NextResponse.json({
      state_slug: slug,
      state_id: stateId,
      total: reports.length,
      items: reports
    });
  } catch (error: any) {
    console.error('[API /api/states/[slug]/accounts] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

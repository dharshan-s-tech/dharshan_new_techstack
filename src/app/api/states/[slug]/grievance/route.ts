import { NextRequest, NextResponse } from 'next/server';
import { aeService } from '@/lib/services/aeService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const site = await aeService.getAeWebsiteBySlug(slug);
    const result = await aeService.submitAeGrievance({
      ...body,
      website_id: site?.website_id || body.website_id,
      state_id: site?.state_id || body.state_id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ticket_id: `CAG-AE-${slug.toUpperCase().slice(0, 3)}-${result.id}`,
      id: result.id,
      message: 'Your grievance has been submitted successfully to the Accountant General (A&E) office.'
    });
  } catch (error: any) {
    console.error('[API /api/states/[slug]/grievance] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

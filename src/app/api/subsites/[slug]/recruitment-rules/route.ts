import { NextRequest, NextResponse } from 'next/server';
import { getSubsiteRecruitmentRules } from '@/lib/subsitesData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rules = getSubsiteRecruitmentRules(slug);

    return NextResponse.json({
      status: 'success',
      data: rules
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to retrieve recruitment rules' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSubsiteOfficeData, getSubsiteOrgStruct, getSubsiteRecruitmentRules } from '@/lib/subsitesData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const office = getSubsiteOfficeData(slug);
    const staff = getSubsiteOrgStruct(slug);
    const recruitmentRules = getSubsiteRecruitmentRules(slug);

    return NextResponse.json({
      status: 'success',
      data: {
        office,
        staff,
        recruitmentRules
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to retrieve subsite data' },
      { status: 500 }
    );
  }
}

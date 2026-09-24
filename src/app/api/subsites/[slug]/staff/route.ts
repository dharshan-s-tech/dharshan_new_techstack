import { NextRequest, NextResponse } from 'next/server';
import { getSubsiteOrgStruct } from '@/lib/subsitesData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const staff = getSubsiteOrgStruct(slug);

    return NextResponse.json({
      status: 'success',
      data: staff
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to retrieve staff directory' },
      { status: 500 }
    );
  }
}

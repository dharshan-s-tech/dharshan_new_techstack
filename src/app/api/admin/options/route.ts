import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/admin/options${search}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

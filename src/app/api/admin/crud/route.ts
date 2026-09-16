import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/admin/crud${url.search}`;
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const targetUrl = `${BACKEND_URL}/api/admin/crud${url.search}`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const targetUrl = `${BACKEND_URL}/api/admin/crud${url.search}`;
    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/admin/crud${url.search}`;
    const res = await fetch(targetUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

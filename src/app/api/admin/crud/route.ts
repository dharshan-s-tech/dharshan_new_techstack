import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/crud${search}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, data: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { search } = new URL(req.url);
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/admin/crud${search}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { search } = new URL(req.url);
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/admin/crud${search}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { search } = new URL(req.url);
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/crud${search}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


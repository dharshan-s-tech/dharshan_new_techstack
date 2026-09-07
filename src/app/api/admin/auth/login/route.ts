import { NextRequest, NextResponse } from 'next/server';

const BACKEND =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let username = '';
    let password = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      username = body.username ?? '';
      password = body.password ?? '';
    } else {
      const form = await req.formData();
      username = String(form.get('username') || '');
      password = String(form.get('password') || '');
    }

    const res = await fetch(`${BACKEND.replace(/\/$/, '')}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({ detail: 'Login failed' }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Admin login proxy error:', error);
    return NextResponse.json(
      { detail: 'Unable to reach authentication service' },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_MODULES } from '@/lib/admin-modules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module: moduleKey, action, id, data } = body;
    const config = ADMIN_MODULES[moduleKey];

    if (!config) {
      return NextResponse.json({ error: `Invalid module config: ${moduleKey}` }, { status: 400 });
    }

    const table = config.table;

    if (action === 'create') {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?table=${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return NextResponse.json(result, { status: res.status });
    }

    if (action === 'update') {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?table=${table}&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return NextResponse.json(result, { status: res.status });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

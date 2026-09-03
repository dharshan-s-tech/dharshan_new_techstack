import GenForm from '@/components/admin/GenForm';
import AdminHeader from '@/components/admin/AdminHeader';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import { notFound } from 'next/navigation';

async function getRecordDetail(table: string, id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?table=${table}&id=${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

export default async function AdminEditPage({
  params
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const p = await params;
  const config = ADMIN_MODULES[p.module];

  if (!config) return notFound();

  const row = await getRecordDetail(config.table, p.id);

  if (!row) return notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={`Edit ${config.title}`} subtitle={`Modify existing record ID: ${p.id}`} />
      <main className="flex-1 p-6">
        <GenForm moduleKey={p.module} id={p.id} initialData={row} />
      </main>
    </div>
  );
}

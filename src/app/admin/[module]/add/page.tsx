import GenForm from '@/components/admin/GenForm';
import AdminHeader from '@/components/admin/AdminHeader';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import { notFound } from 'next/navigation';

export default async function AdminAddPage({ params }: { params: Promise<{ module: string }> }) {
  const p = await params;
  const config = ADMIN_MODULES[p.module];

  if (!config) return notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={config.addTitle} subtitle={`Create new ${config.title} record`} />
      <main className="flex-1 p-6">
        <GenForm moduleKey={p.module} />
      </main>
    </div>
  );
}

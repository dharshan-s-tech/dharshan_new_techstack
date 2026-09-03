import { GenListPage } from '@/components/admin/GenListPage';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import { notFound } from 'next/navigation';

export default async function DynamicAdminModuleListPage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { module: moduleKey } = await params;
  const config = ADMIN_MODULES[moduleKey];

  if (!config) {
    return notFound();
  }

  const sp = await searchParams;
  const page = parseInt(sp?.page || '1');
  const search = sp?.search || '';

  return (
    <GenListPage
      title={config.title}
      table={config.table}
      addHref={`/admin/${moduleKey}/add`}
      editBase={`/admin/${moduleKey}`}
      viewBase={`/admin/${moduleKey}`}
      searchCol={config.searchColumn}
      cols={config.columns}
      page={page}
      search={search}
    />
  );
}

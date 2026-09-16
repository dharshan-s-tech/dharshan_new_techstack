import { GenListPage } from '@/components/admin/GenListPage';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import { notFound } from 'next/navigation';

export default async function DynamicAdminModuleListPage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    lang?: string;
    status?: string;
    sort?: string;
    website_id?: string;
    role_id?: string;
    wings_id?: string;
  }>;
}) {
  const { module: moduleKey } = await params;
  const config = ADMIN_MODULES[moduleKey];

  if (!config) {
    return notFound();
  }

  const sp = await searchParams;
  const page = parseInt(sp?.page || '1');
  const search = sp?.search || '';
  const lang = sp?.lang || 'all';
  const status = sp?.status || 'all';
  const sort = sp?.sort || 'newest';
  const website_id = sp?.website_id || 'all';
  const role_id = sp?.role_id || 'all';
  const wings_id = sp?.wings_id || 'all';

  return (
    <GenListPage
      moduleKey={moduleKey}
      title={config.title}
      table={config.table}
      addHref={`/admin/${moduleKey}/add`}
      editBase={`/admin/${moduleKey}`}
      viewBase={`/admin/${moduleKey}`}
      searchCol={config.searchColumn}
      cols={config.columns}
      page={page}
      search={search}
      lang={lang}
      status={status}
      sort={sort}
      website_id={website_id}
      role_id={role_id}
      wings_id={wings_id}
    />
  );
}

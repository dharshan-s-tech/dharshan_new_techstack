import { GenListPage } from '@/components/admin/GenListPage';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import { notFound } from 'next/navigation';

export default async function DynamicAdminModuleListPage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{ page?: string; search?: string; lang?: string; status?: string; sort?: string; type?: string; category?: string; subtopic?: string }>;
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
  const type = sp?.type;
  const category = sp?.category;
  const subtopic = sp?.subtopic;

  const dynamicTitle = type === 'overseas' 
    ? 'Overseas Audit Offices' 
    : type === 'ae' 
    ? 'State A&E Offices'
    : type === 'audit'
    ? 'State Audit Offices'
    : type === 'defence'
    ? 'Central Defence Audit Offices'
    : type === 'railway'
    ? 'Central Railway Audit Offices'
    : config.title;

  return (
    <GenListPage
      title={dynamicTitle}
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
      type={type}
      category={category}
      subtopic={subtopic}
    />
  );
}

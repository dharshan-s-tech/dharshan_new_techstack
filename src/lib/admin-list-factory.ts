interface ListPageConfig {
  title: string;
  table: string;
  schema?: string;
  searchCol: string;
  addHref: string;
  editHref: (id: any) => string;
  viewHref?: (id: any) => string;
  deleteTable?: string;
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
}

export async function renderListPage(
  config: ListPageConfig,
  page: number,
  search: string
) {
  try {
    const searchParams = new URLSearchParams({
      table: config.table,
      page: page.toString(),
      limit: '20',
      search: search || '',
      searchCol: config.searchCol || ''
    });

    const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?${searchParams.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { rows: [], total: 0, totalPages: 1 };
    }

    const data = await res.json();
    return {
      rows: data.data || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1
    };
  } catch (err) {
    console.error('Error fetching list page data:', err);
    return { rows: [], total: 0, totalPages: 1 };
  }
}

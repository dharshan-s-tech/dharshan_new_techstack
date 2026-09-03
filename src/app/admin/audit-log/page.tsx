import { GenListPage } from '@/components/admin/GenListPage';
export default async function AuditLogPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams;
  return GenListPage({
    title: 'Admin Audit Log',
    table: 'admin_audit_log',
    addHref: '/admin/audit-log/add',
    editBase: '/admin/audit-log',
    searchCol: 'action',
    page: parseInt(sp?.page || '1'),
    search: sp?.search || '',
    cols: [
      { key: 'user_id', label: 'User ID' },
      { key: 'action', label: 'Action' },
      { key: 'table_name', label: 'Table' },
      { key: 'record_id', label: 'Record ID' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'created_at', label: 'Timestamp', type: 'date' },
    ]
  });
}

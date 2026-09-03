import AdminHeader from '@/components/admin/AdminHeader';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';
import { FilePreviewAction } from '@/components/admin/ListClientHelpers';

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

function renderValue(key: string, val: any): React.ReactNode {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') {
    return val ? 'Active (true)' : 'Inactive (false)';
  }

  const strVal = String(val);
  const lowerKey = key.toLowerCase();
  
  // Check if it's a file path or URL
  const isFilePath = strVal.startsWith('/storage/') || strVal.startsWith('/admin-uploads/') || strVal.startsWith('http://') || strVal.startsWith('https://');
  
  if (isFilePath) {
    const isImage = strVal.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || lowerKey.includes('image') || lowerKey.includes('thumbnail');
    if (isImage) {
      return (
        <div className="flex items-center gap-3">
          <img src={strVal} alt="" className="max-h-20 max-w-[150px] object-contain rounded border bg-white shadow-sm flex-shrink-0" />
          <FilePreviewAction url={strVal} type="image" />
        </div>
      );
    }
    return <FilePreviewAction url={strVal} type="file" />;
  }

  return strVal;
}

export default async function DynamicRecordDetailPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module: moduleKey, id } = await params;
  const config = ADMIN_MODULES[moduleKey];

  if (!config) {
    return notFound();
  }

  const record = await getRecordDetail(config.table, id);

  if (!record) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title={`${config.title} Detail`} subtitle={`ID: #${id}`} />
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">The requested record could not be found.</p>
            <Link
              href={`/admin/${moduleKey}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#751639] text-white text-sm rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {config.title}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`${config.title} Detail`}
        subtitle={`Record ID: #${record.id}`}
      />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Link
            href={`/admin/${moduleKey}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {config.title}
          </Link>
          <Link
            href={`/admin/${moduleKey}/${record.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#751639] text-white text-sm rounded-lg font-medium"
          >
            <Pencil className="w-4 h-4" /> Edit Record
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(record).map(([key, val]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="text-sm font-medium text-gray-800 break-words mt-1">
                  {renderValue(key, val)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

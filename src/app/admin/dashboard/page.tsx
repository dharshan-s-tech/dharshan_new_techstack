import AdminHeader from '@/components/admin/AdminHeader';
import {
  FileBarChart, Newspaper, Bell, Users, Images, BookOpen,
  FileText, CalendarDays, Megaphone, ScrollText, UserCog, Phone, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const tablesMap = [
    { key: 'audit_reports', label: 'Audit Reports', table: 'audit_reports', icon: FileBarChart, color: 'bg-[#751639]/10 text-[#751639]', href: '/admin/audit-reports' },
    { key: 'news', label: 'News', table: 'news', icon: Newspaper, color: 'bg-amber-50 text-amber-800', href: '/admin/news' },
    { key: 'notifications', label: 'Notifications', table: 'notifications', icon: Bell, color: 'bg-blue-50 text-blue-800', href: '/admin/notifications' },
    { key: 'admin_users', label: 'Admin Users', table: 'admin_users', icon: Users, color: 'bg-slate-100 text-slate-700', href: '/admin/users' },
    { key: 'media_gallery', label: 'Media Gallery', table: 'media_gallery', icon: Images, color: 'bg-purple-50 text-purple-800', href: '/admin/media-gallery' },
    { key: 'publications', label: 'Publications', table: 'publications', icon: BookOpen, color: 'bg-[#751639]/10 text-[#751639]', href: '/admin/publications' },
    { key: 'pages', label: 'Pages', table: 'pages', icon: FileText, color: 'bg-slate-100 text-slate-700', href: '/admin/pages' },
    { key: 'events', label: 'Events', table: 'events', icon: CalendarDays, color: 'bg-teal-50 text-teal-800', href: '/admin/events' },
    { key: 'recruitment_notices', label: 'Recruitment', table: 'recruitment_notices', icon: Megaphone, color: 'bg-red-50 text-red-800', href: '/admin/recruitment-notices' },
    { key: 'tenders', label: 'Tenders', table: 'tenders', icon: ScrollText, color: 'bg-cyan-50 text-cyan-800', href: '/admin/tenders' },
    { key: 'public_consultations', label: 'Consultations', table: 'public_consultations', icon: UserCog, color: 'bg-emerald-50 text-emerald-800', href: '/admin/public-consultations' },
    { key: 'contact_submissions', label: 'Contact Msgs', table: 'contact_submissions', icon: Phone, color: 'bg-rose-50 text-rose-800', href: '/admin/contact-submissions' },
  ];

  try {
    const res = await fetch('http://127.0.0.1:8000/api/admin/crud/dashboard-stats', {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const json = await res.json();
    const countsData = json.counts || {};
    const recentLogs = Array.isArray(json.recentLogs) ? json.recentLogs : [];

    const counts = tablesMap.map(t => ({
      ...t,
      count: countsData[t.table] || 0
    }));

    return { counts, recentLogs };
  } catch (e) {
    const counts = tablesMap.map(t => ({ ...t, count: 0 }));
    return { counts, recentLogs: [] };
  }
}

export default async function DashboardPage() {
  const { counts, recentLogs } = await getDashboardStats();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Welcome to CAG Admin Panel" />
      <main className="flex-1 p-6 space-y-6 bg-gray-50/50">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {counts.map(stat => {
            const Icon = stat.icon;
            return (
              <Link key={stat.key} href={stat.href}
                className="bg-white rounded-xl border border-gray-200/80 p-4 hover:shadow-sm hover:border-gray-300 transition-all group">
                <div className={`w-9 h-9 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.count.toLocaleString()}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#751639]" /> Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Add Audit Report', href: '/admin/audit-reports/add', color: 'text-blue-700 hover:text-blue-900' },
                { label: 'Add News', href: '/admin/news/add', color: 'text-amber-700 hover:text-amber-900' },
                { label: 'Add Notification', href: '/admin/notifications/add', color: 'text-slate-700 hover:text-slate-900' },
                { label: 'Add Publication', href: '/admin/publications/add', color: 'text-[#751639] hover:text-[#5f0f2d]' },
                { label: 'Add Recruitment Notice', href: '/admin/recruitment-notices/add', color: 'text-red-700 hover:text-red-900' },
                { label: 'Add Tender', href: '/admin/tenders/add', color: 'text-cyan-700 hover:text-cyan-900' },
                { label: 'Add Event', href: '/admin/events/add', color: 'text-teal-700 hover:text-teal-900' },
                { label: 'Manage Users', href: '/admin/users', color: 'text-purple-700 hover:text-purple-900' },
              ].map(action => (
                <Link key={action.href} href={action.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-xs ${action.color} font-semibold transition-colors`}>
                  → {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Recent Activity</h2>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No activity yet</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-80">
                {recentLogs.map((log: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 
                      ${log.action === 'INSERT' || log.action === 'CREATE' ? 'bg-green-400' : log.action === 'DELETE' ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 font-medium truncate">
                        {log.full_name || 'System'} · {log.action} · {log.table_name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

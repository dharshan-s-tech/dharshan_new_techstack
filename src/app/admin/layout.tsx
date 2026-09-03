import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export const metadata: Metadata = {
  title: 'CAG Admin Panel',
  description: 'Comptroller and Auditor General of India - Administration Panel',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}

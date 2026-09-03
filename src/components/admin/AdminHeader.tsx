'use client';
import { useSession } from 'next-auth/react';
import { Bell, User, ChevronDown } from 'lucide-react';

interface AdminHeaderProps { title: string; subtitle?: string; }

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#751639] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

import * as React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  PieChart, 
  Settings, 
  LogOut,
  TrendingUp,
  FileText,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: ArrowUpRight },
    { id: 'expenses', label: 'Expenses', icon: ArrowDownLeft },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Smart</h1>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Analysis</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group',
                activeTab === item.id
                  ? 'bg-emerald-600/10 text-emerald-500 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-colors',
                activeTab === item.id ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-200'
              )} />
              {item.label}
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-900 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
            activeTab === 'settings'
              ? "bg-emerald-600/10 text-emerald-500 shadow-sm"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          )}
        >
          <Settings className={cn(
            "w-5 h-5 transition-colors",
            activeTab === 'settings' ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-200"
          )} />
          Settings
          {activeTab === 'settings' && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

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
  Info,
  LifeBuoy,
  Calendar,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from './Button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: ArrowUpRight },
    { id: 'expenses', label: 'Expenses', icon: ArrowDownLeft },
    { id: 'history', label: 'History', icon: History },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'insights', label: 'Smart Analysis', icon: TrendingUp },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside className={cn(
      "h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col z-50 overflow-y-auto custom-scrollbar transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-10 flex items-center mb-2 px-4 py-4",
        isCollapsed ? "justify-center" : "justify-between px-6"
      )}>
        <div className={cn("flex items-center gap-3", isCollapsed && "hidden")}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight underline decoration-emerald-500/50 underline-offset-4">Smart</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 text-zinc-500 hover:text-emerald-500 transition-colors"
            title={isCollapsed ? "Expand Sidebar (View Out)" : "Collapse Sidebar (View In)"}
          >
            {isCollapsed ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose?.();
            }}
            className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className={cn("flex-1", isCollapsed ? "px-2" : "px-6")}>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose?.();
              }}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isCollapsed ? "justify-center px-4 py-4" : "px-4 py-3 gap-3",
                activeTab === item.id
                  ? 'bg-emerald-600/10 text-emerald-500 shadow-sm border border-emerald-500/10'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-colors',
                activeTab === item.id ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-200'
              )} />
              {!isCollapsed && (
                <>
                  {item.label}
                  {activeTab === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </>
              )}
              {isCollapsed && activeTab === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-l-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className={cn("mt-auto border-t border-zinc-900 space-y-1", isCollapsed ? "p-2" : "p-6")}>
        <button
          onClick={() => {
            setActiveTab('settings');
            if (window.innerWidth < 1024) onClose?.();
          }}
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
            isCollapsed ? "justify-center px-4 py-4" : "px-4 py-3 gap-3",
            activeTab === 'settings'
              ? "bg-emerald-600/10 text-emerald-500 shadow-sm border border-emerald-500/10"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          )}
        >
          <Settings className={cn(
            "w-5 h-5 transition-colors",
            activeTab === 'settings' ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-200"
          )} />
          {!isCollapsed && "Settings"}
          {isCollapsed && activeTab === 'settings' && (
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-l-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          )}
        </button>
        <button
          onClick={onLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group",
            isCollapsed ? "justify-center px-4 py-4" : "px-4 py-3 gap-3",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

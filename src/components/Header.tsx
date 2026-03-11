import * as React from 'react';
import { Bell, Search, User, X, Check, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Card } from './Card';
import { Button } from './Button';

interface HeaderProps {
  title: string;
  user?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ title, user }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'New Transaction', desc: 'Received $1,200 from Client A', time: '2m ago', read: false },
    { id: 2, title: 'Budget Alert', desc: 'You have reached 80% of your monthly budget', time: '1h ago', read: false },
    { id: 3, title: 'Report Ready', desc: 'Your weekly financial report is ready to view', time: '5h ago', read: true },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Analysis
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-48"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-zinc-800 pl-6 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              showNotifications ? "bg-emerald-500/10 text-emerald-500" : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100"
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-zinc-950" />
          </button>

          {showNotifications && (
            <Card className="absolute top-full right-0 mt-2 w-80 p-0 bg-zinc-950 border-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-zinc-900">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={cn(
                          "p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer group",
                          !n.read && "bg-emerald-500/[0.02]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn(
                            "text-sm font-bold",
                            n.read ? "text-zinc-400" : "text-white"
                          )}>
                            {n.title}
                          </p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />}
                        </div>
                        <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{n.desc}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-zinc-900/50 border-t border-zinc-900">
                <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest gap-2">
                  <Check className="w-3 h-3" />
                  Mark all as read
                </Button>
              </div>
            </Card>
          )}

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none mb-1">
                {user?.displayName || 'Business User'}
              </p>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                Professional Plan
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-zinc-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import * as React from 'react';
import { Bell, Search, User, X, Check, Clock, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Card } from './Card';
import { Button } from './Button';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  user?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ title, user, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: 'New Transaction', desc: 'Received ₹1,200 from Client A', time: '2m ago', read: false },
    { id: 2, title: 'Budget Alert', desc: 'You have reached 80% of your monthly budget', time: '1h ago', read: false },
    { id: 3, title: 'Report Ready', desc: 'Your weekly financial report is ready to view', time: '5h ago', read: true },
  ]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

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
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-10 w-10 text-zinc-400"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate max-w-[120px] sm:max-w-none">{title}</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Analysis
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-48"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 sm:border-l sm:border-zinc-800 sm:pl-6 relative" ref={dropdownRef}>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative rounded-xl transition-all duration-300 h-10 w-10",
              showNotifications ? "bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20" : "text-zinc-400 hover:text-zinc-100"
            )}
            title="Notifications"
          >
            <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-ring")} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-zinc-950 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            )}
          </Button>

          {showNotifications && (
            <Card className="absolute top-full right-0 mt-4 w-[280px] sm:w-85 p-0 bg-zinc-950 border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden z-50">
              <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">Notifications</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">{unreadCount} unread messages</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-zinc-900/50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => toggleRead(n.id)}
                        className={cn(
                          "p-5 hover:bg-zinc-900/80 transition-all cursor-pointer group relative",
                          !n.read && "bg-emerald-500/[0.03]"
                        )}
                      >
                        {!n.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                        )}
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <p className={cn(
                            "text-sm font-bold leading-tight",
                            n.read ? "text-zinc-400" : "text-white"
                          )}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mb-3 leading-relaxed line-clamp-2">{n.desc}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                      <Bell className="w-8 h-8 text-zinc-700" />
                    </div>
                    <p className="text-sm text-zinc-400 font-bold mb-1">All Caught Up!</p>
                    <p className="text-xs text-zinc-600">No new notifications at the moment.</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-zinc-900/40 border-t border-zinc-900 flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 text-[10px] font-bold uppercase tracking-widest gap-2 h-9"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] font-bold uppercase tracking-widest h-9 px-3 border-zinc-800"
                  onClick={() => setNotifications([])}
                >
                  Clear
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

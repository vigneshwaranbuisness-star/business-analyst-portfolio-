import * as React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Moon, 
  Sun, 
  Globe, 
  Lock,
  ChevronRight,
  LogOut,
  Trash2,
  Save
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SettingsProps {
  transactions: any[];
  onClearData: () => void;
  onDeleteAccount: () => void;
}

const Settings: React.FC<SettingsProps> = ({ transactions, onClearData, onDeleteAccount }) => {
  const [activeSubTab, setActiveSubTab] = React.useState('General');
  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(false);

  const subTabs = ['General', 'Security', 'Notifications', 'Billing', 'API Access'];

  const handleExport = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeSubTab) {
      case 'General':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Profile Settings</h3>
              <div className="space-y-3">
                {[
                  { icon: User, label: 'Personal Information', desc: 'Update your name and email address' },
                  { icon: Globe, label: 'Language & Region', desc: 'English (US) • UTC +00:00' },
                ].map((item) => (
                  <Card key={item.label} className="p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Data Management</h3>
              <div className="space-y-3">
                <Card 
                  onClick={handleExport}
                  className={cn(
                    "p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer group",
                    transactions.length === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Export Data</p>
                        <p className="text-xs text-zinc-500">Download your transactions as CSV/JSON</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Card>
                <Card 
                  onClick={onClearData}
                  className="p-4 bg-zinc-950 border-zinc-900 hover:border-rose-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-rose-500">Clear Local Storage</p>
                        <p className="text-xs text-zinc-500">Reset all dashboard data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Security Settings</h3>
              <div className="space-y-3">
                <Card className="p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Change Password</p>
                        <p className="text-xs text-zinc-500">Update your account password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Card>
                <Card className="p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={cn(
                        "w-10 h-5 rounded-full transition-colors relative",
                        twoFactor ? "bg-emerald-600" : "bg-zinc-800"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                        twoFactor ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Push Notifications', desc: 'Receive alerts in your browser', value: notifications, setter: setNotifications },
                  { label: 'Email Alerts', desc: 'Weekly financial summaries', value: emailAlerts, setter: setEmailAlerts },
                ].map((item) => (
                  <Card key={item.label} className="p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => item.setter(!item.value)}
                        className={cn(
                          "w-10 h-5 rounded-full transition-colors relative",
                          item.value ? "bg-emerald-600" : "bg-zinc-800"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                          item.value ? "left-6" : "left-1"
                        )} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Billing':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Subscription & Billing</h3>
              <Card className="p-6 bg-zinc-900/50 border-zinc-800 border-dashed">
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-zinc-700" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Professional Plan</h4>
                  <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">You are currently on the professional plan. Your next billing date is April 12, 2024.</p>
                  <Button variant="outline" className="h-10 px-6 font-bold uppercase tracking-widest">Manage Subscription</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'API Access':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Developer API</h3>
              <Card className="p-6 bg-zinc-950 border-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">API Keys</h4>
                    <p className="text-xs text-zinc-500">Use these keys to access your data programmatically.</p>
                  </div>
                  <Button size="sm" className="text-[10px] font-bold uppercase tracking-widest">Generate New Key</Button>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <code className="text-xs text-emerald-500 font-mono">sk_live_••••••••••••••••••••••••</code>
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Copy</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>
          <p className="text-sm text-zinc-500">Manage your profile, preferences, and data security.</p>
        </div>
        <Button glow className="gap-2 h-11 px-6 font-bold uppercase tracking-widest">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {subTabs.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSubTab(item)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200",
                activeSubTab === item 
                  ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
              )}
            >
              {item}
              {activeSubTab === item && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {renderContent()}

          {/* Danger Zone */}
          {activeSubTab === 'General' && (
            <div className="pt-8 border-t border-zinc-900">
              <Card className="p-6 bg-rose-500/5 border-rose-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-rose-500 mb-1">Delete Account</h4>
                    <p className="text-sm text-zinc-500">Permanently remove all your data and access to this dashboard.</p>
                  </div>
                  <Button 
                    variant="danger" 
                    className="h-11 px-8 font-bold uppercase tracking-widest whitespace-nowrap"
                    onClick={onDeleteAccount}
                  >
                    Delete Permanently
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

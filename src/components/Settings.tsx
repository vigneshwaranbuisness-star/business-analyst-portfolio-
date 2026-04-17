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
  Lock as LockIcon,
  ChevronRight,
  LogOut,
  Trash2,
  Save,
  Plus,
  X,
  CreditCard,
  Camera,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CategoryInfo, TransactionType, ICON_MAP } from '../types';

interface SettingsProps {
  user: any;
  transactions: any[];
  incomeCategories: CategoryInfo[];
  expenseCategories: CategoryInfo[];
  onUpdateProfile: (updates: any) => void;
  onAddCategory: (type: TransactionType, name: string) => void;
  onDeleteCategory: (type: TransactionType, label: string) => void;
  onClearData: () => void;
  onDeleteAccount: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  user,
  transactions, 
  incomeCategories,
  expenseCategories,
  onUpdateProfile,
  onAddCategory,
  onDeleteCategory,
  onClearData, 
  onDeleteAccount 
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState('General');
  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({ displayName: user?.displayName || '', email: user?.email || '' });
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatType, setNewCatType] = React.useState<TransactionType>('income');

  const subTabs = ['General', 'Categories', 'Security', 'Notifications', 'Billing'];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setIsEditingProfile(false);
  };

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
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const netWorth = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Visual Profile Header */}
            <Card className="p-8 bg-gradient-to-br from-emerald-600/10 via-zinc-950/50 to-zinc-950 border-emerald-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative group/avatar">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'User'}&backgroundColor=09090b`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity hover:scale-110 active:scale-95">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">{user?.displayName || 'Business Owner'}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase tracking-widest">{user?.email || 'No Email Linked'}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Professional</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="px-5 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-center md:text-left">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Savings Rate</p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                       <span className="text-xl font-bold text-white tracking-tight">{savingsRate}%</span>
                       <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-center md:text-left">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Net</p>
                    <div className="flex items-center justify-center md:justify-start gap-1">
                       <span className="text-xl font-bold text-white tracking-tight">₹{Math.abs(netWorth).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Identity & Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={cn(
                    "p-5 bg-zinc-950 border-zinc-900 hover:border-emerald-500/20 transition-all cursor-pointer group flex items-start gap-5",
                    isEditingProfile && "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all duration-300">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-0.5">Edit Profile</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">Update display name, email, and biometric settings</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-zinc-700 group-hover:text-zinc-400 mt-1 transition-transform", isEditingProfile && "rotate-90")} />
                </Card>

                <Card className="p-5 bg-zinc-950 border-zinc-900 hover:border-emerald-500/20 transition-all cursor-pointer group flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 flex items-center justify-center transition-all duration-300">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-0.5">Account Activity</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">View login history and active business sessions</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 mt-1 transition-colors" />
                </Card>
              </div>

              {isEditingProfile && (
                <form onSubmit={handleProfileSubmit} className="p-8 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={profileForm.displayName}
                        onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                        className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 text-sm font-medium text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="e.g. Johnathan Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Business Email</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 text-sm font-medium text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="john@business.com"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" className="h-11 px-6 text-xs uppercase tracking-widest font-bold text-zinc-500" onClick={() => setIsEditingProfile(false)}>Discard</Button>
                    <Button type="submit" glow className="h-11 px-8 font-bold uppercase tracking-widest text-[11px] hocus:scale-105 active:scale-95 transition-transform">
                      Save Profile Updates
                    </Button>
                  </div>
                </form>
              )}

              <Card className="p-4 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Language & Region</p>
                      <p className="text-xs text-zinc-500">English (US) • UTC +00:00</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Card>
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
                        <p className="text-xs text-zinc-500">Reset all dashboard data to defaults</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-rose-500/10 text-[10px] font-bold text-rose-500 border border-rose-500/20 uppercase tracking-widest">Reset</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'Categories':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Custom Categories</h3>
                <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                  {(['income', 'expense'] as TransactionType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewCatType(t)}
                      className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                        newCatType === t ? "bg-zinc-800 text-emerald-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <Button 
                  className="h-11 px-6 font-bold uppercase tracking-widest"
                  disabled={!newCatName}
                  onClick={() => {
                    onAddCategory(newCatType, newCatName);
                    setNewCatName('');
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {(newCatType === 'income' ? incomeCategories : expenseCategories).map(cat => {
                  const Icon = ICON_MAP[cat.iconName] || Plus;
                  return (
                    <Card key={cat.label} className="p-4 bg-zinc-950 border-zinc-900 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-zinc-900", cat.color)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{cat.label}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{newCatType}</p>
                          </div>
                        </div>
                        {cat.label !== 'Other' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-600 hover:text-rose-500 transition-opacity opacity-0 group-hover:opacity-100"
                            onClick={() => onDeleteCategory(newCatType, cat.label)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
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
                        <LockIcon className="w-5 h-5" />
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
        {/* Sidebar Nav (Desktop) / Tab Bar (Mobile) */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 no-scrollbar">
          {subTabs.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSubTab(item)}
              className={cn(
                "whitespace-nowrap flex items-center justify-between px-4 py-3 rounded-xl text-[10px] sm:text-sm font-bold uppercase tracking-widest transition-all duration-200 min-w-max lg:min-w-0 flex-1 lg:flex-none",
                activeSubTab === item 
                  ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
              )}
            >
              {item}
              <div className={cn(
                "hidden lg:block w-1.5 h-1.5 rounded-full",
                activeSubTab === item ? "bg-emerald-500" : "bg-transparent"
              )} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8 mt-4 lg:mt-0">
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

import * as React from 'react';
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Plus, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import StatCard from './StatCard';
import TransactionTable from './TransactionTable';
import Analytics from './Analytics';
import QuickAddForm from './QuickAddForm';
import { Transaction, TransactionType } from '@/src/types';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/src/lib/utils';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (type: TransactionType) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onQuickAdd: (values: any) => void;
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction,
  onQuickAdd,
  isLoading
}) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const profit = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Financial Overview</h2>
          <p className="text-sm text-zinc-500 font-medium">Track your business performance and growth</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2 h-11 px-6 font-bold uppercase tracking-widest"
            onClick={handleExport}
            disabled={transactions.length === 0}
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <Button 
              glow
              className="gap-2 h-9 px-4 font-bold uppercase tracking-widest"
              onClick={() => onAddTransaction('income')}
            >
              <Plus className="w-4 h-4" />
              Income
            </Button>
            <Button 
              glow
              variant="danger"
              className="gap-2 h-9 px-4 font-bold uppercase tracking-widest"
              onClick={() => onAddTransaction('expense')}
            >
              <Plus className="w-4 h-4" />
              Expense
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          value={`₹${totalIncome.toLocaleString()}`} 
          trend={12.5} 
          icon={ArrowUpRight} 
          variant="emerald" 
        />
        <StatCard 
          title="Total Expenses" 
          value={`₹${totalExpense.toLocaleString()}`} 
          trend={-8.2} 
          icon={ArrowDownLeft} 
          variant="rose" 
        />
        <StatCard 
          title="Net Profit" 
          value={`₹${profit.toLocaleString()}`} 
          trend={15.8} 
          icon={IndianRupee} 
          variant="sky" 
        />
        <StatCard 
          title="Savings Rate" 
          value={`${savingsRate.toFixed(1)}%`} 
          trend={2.4} 
          icon={Wallet} 
          variant="amber" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Analytics transactions={transactions} />
          <TransactionTable 
            transactions={transactions.slice(0, 5)} 
            onEdit={onEditTransaction} 
            onDelete={onDeleteTransaction} 
          />
        </div>

        <div className="space-y-8">
          <QuickAddForm onSubmit={onQuickAdd} isLoading={isLoading} />

          <Card className="p-6 bg-zinc-950 border-zinc-900">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Bills</h3>
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Office Rent', date: 'Mar 15, 2024', amount: 1200, status: 'pending' },
                { name: 'Cloud Services', date: 'Mar 18, 2024', amount: 450, status: 'pending' },
                { name: 'Internet Bill', date: 'Mar 20, 2024', amount: 85, status: 'paid' },
              ].map((bill, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1">{bill.name}</p>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{bill.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white mb-1">₹{bill.amount}</p>
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full ml-auto',
                      bill.status === 'paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-emerald-600 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Upgrade to Pro</h3>
              <p className="text-emerald-100 text-sm mb-6 leading-relaxed">Get advanced analytics, unlimited file storage, and priority support.</p>
              <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold uppercase tracking-widest">
                Upgrade Now
              </Button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

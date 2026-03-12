import * as React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Transaction } from '@/src/types';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InsightsProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const profit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  const insights = [
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      description: profitMargin > 20 ? 'Your business is highly profitable.' : 'Consider optimizing expenses to improve margin.',
      icon: TrendingUp,
      variant: profitMargin > 20 ? 'success' : 'warning',
    },
    {
      title: 'Top Expense',
      value: transactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0]?.category || 'N/A',
      description: 'This category accounts for the largest portion of your costs.',
      icon: AlertCircle,
      variant: 'danger',
    },
    {
      title: 'Financial Health',
      value: profit > 0 ? 'Healthy' : 'Critical',
      description: profit > 0 ? 'You are generating more than you spend.' : 'Your expenses exceed your income.',
      icon: CheckCircle2,
      variant: profit > 0 ? 'success' : 'danger',
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                'p-3 rounded-xl border',
                insight.variant === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                insight.variant === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                'bg-rose-500/10 text-rose-500 border-rose-500/20'
              )}>
                <insight.icon className="w-6 h-6" />
              </div>
              <Badge variant={insight.variant as any}>{insight.title}</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{insight.value}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{insight.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
              <Lightbulb className="w-3 h-3" />
              Smart Recommendation
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Optimize Your Business Growth</h2>
            <p className="text-zinc-400 leading-relaxed max-w-2xl">
              Based on your recent transactions, we've identified that your business costs are trending upwards in the 'Business Cost' category. 
              Reducing these by just 10% could increase your monthly profit by approximately <span className="text-emerald-500 font-bold">₹{(totalExpense * 0.1).toFixed(0)}</span>.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all group">
                View Detailed Report
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-700 transition-all">
                Dismiss Insight
              </button>
            </div>
          </div>
          <div className="w-full lg:w-72 h-48 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-600/5 animate-pulse" />
             <TrendingUp className="w-24 h-24 text-emerald-500/20" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Insights;

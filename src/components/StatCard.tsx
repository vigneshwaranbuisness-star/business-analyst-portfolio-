import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  variant?: 'emerald' | 'rose' | 'sky' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, variant = 'sky' }) => {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <Card className="relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl border transition-colors duration-300', variants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
            trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          )}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>

      <div className={cn(
        'absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500',
        variant === 'emerald' ? 'text-emerald-500' : 
        variant === 'rose' ? 'text-rose-500' : 
        variant === 'sky' ? 'text-sky-500' : 'text-amber-500'
      )}>
        <Icon className="w-full h-full" />
      </div>
    </Card>
  );
};

export default StatCard;

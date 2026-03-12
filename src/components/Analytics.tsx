import * as React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Card } from './Card';
import { Transaction, EXPENSE_CATEGORIES } from '@/src/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Helper to get color from category
  const getCategoryColor = (label: string) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.label === label);
    if (!cat) return '#6366f1'; // Default
    
    // Map tailwind text classes to hex
    const colorMap: Record<string, string> = {
      'text-orange-500': '#f97316',
      'text-blue-500': '#3b82f6',
      'text-rose-500': '#f43f5e',
      'text-amber-600': '#d97706',
      'text-zinc-400': '#a1a1aa',
      'text-emerald-600': '#059669',
      'text-pink-500': '#ec4899',
      'text-red-500': '#ef4444',
      'text-fuchsia-500': '#d946ef',
      'text-zinc-500': '#71717a'
    };
    return colorMap[cat.color] || '#6366f1';
  };
  // Monthly Data for Bar Chart
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), i);
    return {
      name: format(date, 'MMM'),
      month: startOfMonth(date),
      income: 0,
      expense: 0,
    };
  }).reverse();

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    last6Months.forEach(m => {
      if (isWithinInterval(tDate, { start: m.month, end: endOfMonth(m.month) })) {
        if (t.type === 'income') m.income += t.amount;
        else m.expense += t.amount;
      }
    });
  });

  // Category Data for Pie Chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Profit Growth Data for Area Chart
  const growthData = last6Months.map(m => ({
    name: m.name,
    profit: m.income - m.expense,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Income vs Expenses</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1f2937', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Expense Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1f2937', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Profit Growth Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1f2937', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

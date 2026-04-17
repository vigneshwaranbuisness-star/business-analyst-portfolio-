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
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Card } from './Card';
import { Button } from './Button';
import { Transaction, CategoryInfo } from '@/src/types';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar, TrendingUp, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AnalyticsProps {
  transactions: Transaction[];
  expenseCategories: CategoryInfo[];
  onNextPage?: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions, expenseCategories, onNextPage }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper to get color from category
  const getCategoryColor = (label: string) => {
    const cat = expenseCategories.find(c => c.label === label);
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

  // Daily Data for specific month analysis
  const monthInterval = {
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  };

  const daysInMonth = eachDayOfInterval(monthInterval);
  
  const dailyData = daysInMonth.map(day => {
    const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      day: format(day, 'dd'),
      fullDate: format(day, 'MMM dd'),
      income,
      expense,
      balance: income - expense
    };
  });

  const availableMonths = Array.from({ length: 12 }).map((_, i) => subMonths(new Date(), i));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h2>
            <p className="text-sm text-zinc-500 font-medium">Monthly and daily trend analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <select 
              className="bg-transparent border-none outline-none text-xs font-bold text-zinc-200 uppercase tracking-widest cursor-pointer"
              value={selectedMonth.toISOString()}
              onChange={(e) => setSelectedMonth(new Date(e.target.value))}
            >
              {availableMonths.map(m => (
                <option key={m.toISOString()} value={m.toISOString()} className="bg-zinc-950 text-white">
                  {format(m, 'MMMM yyyy')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400"
              onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400"
              onClick={() => setSelectedMonth(prev => addMonths(prev, 1))}
              disabled={isSameDay(startOfMonth(selectedMonth), startOfMonth(new Date()))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6 border-zinc-800 bg-zinc-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Daily Performance Analysis</h3>
            <p className="text-xs text-zinc-500 font-medium">{format(selectedMonth, 'MMMM yyyy')} Breakdown</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Expense</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full min-w-0 relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350} debounce={1}>
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dailyIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="dailyExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} strokeOpacity={0.5} />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                interval={isMobile ? 2 : 0}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1f2937', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                itemStyle={{ fontSize: '11px', padding: '2px 0' }}
                cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#dailyIncome)" 
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#f43f5e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#dailyExpense)" 
                name="Expense"
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Income vs Expenses</h3>
        <div className="h-[300px] w-full min-w-0 relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
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
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Expense Distribution</h3>
        <div className="h-[300px] w-full min-w-0 relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
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
              <Legend 
                layout={isMobile ? 'horizontal' : 'vertical'} 
                align={isMobile ? 'center' : 'right'} 
                verticalAlign={isMobile ? 'bottom' : 'middle'} 
              />
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Profit Growth Trend</h3>
        <div className="h-[300px] w-full min-w-0 relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={1}>
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
          )}
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6 bg-emerald-500/[0.02] border-emerald-500/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Deeper Business Analysis</h3>
            <p className="text-xs text-zinc-500 font-medium">Get customized AI-driven business insights based on your transaction history.</p>
          </div>
          <Button 
            glow 
            className="w-full sm:w-auto gap-2 px-8 h-12 font-bold uppercase tracking-widest group"
            onClick={onNextPage}
          >
            Go to Smart Analysis
            <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Analytics;

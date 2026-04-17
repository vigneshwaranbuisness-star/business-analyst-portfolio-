import * as React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft, X, FileText, Trash2 } from 'lucide-react';
import { Transaction } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '@/src/lib/utils';

interface CalendarViewProps {
  transactions: Transaction[];
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ transactions, onEditTransaction, onDeleteTransaction }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getDayTransactions = (day: Date) => {
    return transactions.filter(t => isSameDay(new Date(t.date), day));
  };

  const getDayTotals = (day: Date) => {
    const dayTransactions = getDayTransactions(day);
    return dayTransactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      acc.net = acc.income - acc.expense;
      return acc;
    }, { income: 0, expense: 0, net: 0 });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Financial Calendar</h2>
            <p className="text-sm text-zinc-500 font-medium">Daily summary of your cash flow</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="px-4 py-1 text-sm font-bold text-white min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-zinc-800 mx-1" />
          <Button variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>

      <Card className="p-0 border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-zinc-900">
              {weekDays.map(day => (
                <div key={day} className="py-4 text-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{day}</span>
                </div>
              ))}
            </div>
    
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const totals = getDayTotals(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
    
                return (
                  <div 
                    key={day.toString()} 
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-zinc-900 transition-all group relative cursor-pointer",
                      !isCurrentMonth ? "bg-zinc-950/40 opacity-50" : "bg-zinc-950 hover:bg-zinc-900/40",
                      isSelected && "ring-2 ring-inset ring-emerald-500/50 bg-emerald-500/[0.02]",
                      idx % 7 === 6 ? "border-r-0" : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                        isToday ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]" : 
                        isSelected ? "text-emerald-500" :
                        isCurrentMonth ? "text-zinc-400" : "text-zinc-700"
                      )}>
                        {format(day, 'd')}
                      </span>
                      {totals.net !== 0 && (
                        <span className={cn(
                          "text-[9px] font-bold px-1 rounded uppercase tracking-tighter",
                          totals.net > 0 ? "text-emerald-500 bg-emerald-500/5" : "text-rose-500 bg-rose-500/5"
                        )}>
                          {totals.net > 0 ? '+' : ''}₹{Math.abs(totals.net).toLocaleString()}
                        </span>
                      )}
                    </div>
    
                    <div className="space-y-1.5 mt-auto">
                      {totals.income > 0 && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 transition-all group-hover:bg-emerald-500/20">
                          <ArrowUpRight className="w-2.5 h-2.5" />
                          <span className="text-[10px] sm:text-[11px] font-bold tabular-nums">
                            ₹{totals.income.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {totals.expense > 0 && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/10 transition-all group-hover:bg-rose-500/20">
                          <ArrowDownLeft className="w-2.5 h-2.5" />
                          <span className="text-[10px] sm:text-[11px] font-bold tabular-nums">
                            ₹{totals.expense.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
    
                    {isToday && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <Card className="p-0 overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Transactions for {format(selectedDate, 'MMMM dd, yyyy')}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {getDayTransactions(selectedDate).length} Items Found
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-500 hover:text-white"
                onClick={() => setSelectedDate(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {getDayTransactions(selectedDate).length > 0 ? (
                <div className="divide-y divide-zinc-800">
                  {getDayTransactions(selectedDate).map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg border",
                          t.type === 'income' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.description}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={cn(
                          "text-sm font-bold tabular-nums",
                          t.type === 'income' ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => onEditTransaction(t)}>
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-500" onClick={() => onDeleteTransaction(t.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-xs font-medium text-zinc-500">No transactions recorded for this day</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-emerald-500/5 border-emerald-500/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Monthly Income</h4>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            ₹{transactions
              .filter(t => t.type === 'income' && isSameMonth(new Date(t.date), currentDate))
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 font-medium">Total income recorded in {format(currentDate, 'MMMM')}</p>
        </Card>

        <Card className="p-6 bg-rose-500/5 border-rose-500/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Monthly Expenses</h4>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            ₹{transactions
              .filter(t => t.type === 'expense' && isSameMonth(new Date(t.date), currentDate))
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 font-medium">Total expenses recorded in {format(currentDate, 'MMMM')}</p>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;

import * as React from 'react';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/src/types';
import { format } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  FileText,
  Search,
  Filter,
  X,
  History,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/src/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>('all');
  const [viewingReceipt, setViewingReceipt] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredTransactions = transactions.filter(t => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      t.description.toLowerCase().includes(searchLower) || 
      t.category.toLowerCase().includes(searchLower) ||
      t.id.toLowerCase().includes(searchLower) ||
      t.amount.toString().includes(searchTerm) ||
      format(new Date(t.date), 'MMM dd, yyyy').toLowerCase().includes(searchLower);
    
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h3>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder:text-zinc-600 w-32 sm:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all',
                  filterType === type 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-900">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg border transition-colors',
                        t.type === 'income' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      )}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">{t.description}</p>
                        <p className="text-xs text-zinc-500 font-medium">{t.type === 'income' ? 'Received' : 'Paid'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const allCats = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
                      const catInfo = allCats.find(c => c.label === t.category);
                      const Icon = catInfo?.icon || Tag;
                      return (
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "p-1.5 rounded-md bg-zinc-900 border border-zinc-800",
                            catInfo?.color || "text-zinc-500"
                          )}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                            {t.category}
                          </Badge>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-zinc-400">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className={cn(
                      'text-sm font-bold tracking-tight',
                      t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    )}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.receiptUrl && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                          onClick={() => setViewingReceipt(t.receiptUrl!)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-500" onClick={() => onEdit(t)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-rose-500" onClick={() => onDelete(t.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="group-hover:hidden sm:block hidden">
                      <MoreVertical className="w-4 h-4 text-zinc-600 ml-auto" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <History className="w-8 h-8 text-zinc-800" />
                    <p className="text-sm font-medium text-zinc-600">No transactions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > itemsPerPage && (
        <div className="p-6 border-t border-zinc-900 flex items-center justify-between">
          <p className="text-xs text-zinc-500 font-medium">
            Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of <span className="text-white">{filteredTransactions.length}</span> transactions
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] font-bold transition-all",
                    currentPage === page 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {viewingReceipt && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewingReceipt(null)}
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="w-full h-full overflow-auto rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
              {viewingReceipt.startsWith('data:application/pdf') ? (
                <iframe src={viewingReceipt} className="w-full h-[80vh]" title="Receipt PDF" />
              ) : (
                <img src={viewingReceipt} alt="Receipt" className="max-w-full h-auto object-contain" />
              )}
            </div>
            
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = viewingReceipt;
                  link.download = `receipt-${Date.now()}`;
                  link.click();
                }}
                className="font-bold uppercase tracking-widest"
              >
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionTable;

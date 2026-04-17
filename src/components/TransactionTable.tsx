import * as React from 'react';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES, CategoryInfo, ICON_MAP } from '@/src/types';
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
  Tag,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/src/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  incomeCategories: CategoryInfo[];
  expenseCategories: CategoryInfo[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  defaultFilter?: 'all' | 'income' | 'expense';
  hideFilters?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  incomeCategories,
  expenseCategories,
  onEdit, 
  onDelete,
  defaultFilter = 'all',
  hideFilters = false
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>(defaultFilter);
  const [viewingReceipt, setViewingReceipt] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const [sortConfig, setSortConfig] = React.useState<{
    key: 'date' | 'amount' | 'description' | 'category';
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  const handleSort = (key: 'date' | 'amount' | 'description' | 'category') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

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
  }).sort((a, b) => {
    const { key, direction } = sortConfig;
    let comparison = 0;

    if (key === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (key === 'amount') {
      comparison = a.amount - b.amount;
    } else if (key === 'description') {
      comparison = a.description.localeCompare(b.description);
    } else if (key === 'category') {
      comparison = a.category.localeCompare(b.category);
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const SortIcon = ({ column }: { column: typeof sortConfig.key }) => {
    if (sortConfig.key !== column) return <ChevronsUpDown className="w-3 h-3 ml-1 text-zinc-600 group-hover/header:text-zinc-400" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 ml-1 text-emerald-500" /> 
      : <ChevronDown className="w-3 h-3 ml-1 text-emerald-500" />;
  };

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
          
          {!hideFilters && (
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
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-900">
              <th 
                className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:bg-zinc-900/50 transition-colors group/header"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Transaction
                  <SortIcon column="description" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:bg-zinc-900/50 transition-colors group/header hidden md:table-cell"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  <SortIcon column="category" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:bg-zinc-900/50 transition-colors group/header hidden sm:table-cell"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right cursor-pointer hover:bg-zinc-900/50 transition-colors group/header"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
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
                        'p-2 rounded-lg border transition-colors shrink-0',
                        t.type === 'income' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      )}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-none mb-1 truncate">{t.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-zinc-500 font-medium">{t.type === 'income' ? 'Received' : 'Paid'}</p>
                          <span className="sm:hidden text-[10px] text-zinc-600">•</span>
                          <p className="sm:hidden text-[10px] text-zinc-500 font-medium">
                            {format(new Date(t.date), 'MMM dd')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {(() => {
                      const allCats = [...incomeCategories, ...expenseCategories];
                      const catInfo = allCats.find(c => c.label === t.category);
                      const Icon = (catInfo && ICON_MAP[catInfo.iconName]) || Tag;
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
                  <td className="px-6 py-4 hidden sm:table-cell">
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
                    <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
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
                    <div className="lg:group-hover:hidden hidden lg:block">
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
        <div className="p-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-medium order-2 sm:order-1">
            Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of <span className="text-white">{filteredTransactions.length}</span>
          </p>
          
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 flex-shrink-0"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {(() => {
                const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                const visiblePages = totalPages <= 5 
                  ? pages 
                  : pages.filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);
                
                return visiblePages.map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-zinc-700 text-xs px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xs font-bold transition-all flex-shrink-0",
                        currentPage === page 
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800"
                      )}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ));
              })()}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 flex-shrink-0" 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="w-5 h-5" />
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

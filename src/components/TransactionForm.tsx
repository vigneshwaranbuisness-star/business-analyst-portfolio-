import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, Transaction, TransactionType } from '@/src/types';
import { X, IndianRupee, Tag, FileText, Calendar, Upload, Paperclip, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
});

type TransactionFormValues = {
  amount: string;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
};

interface TransactionFormProps {
  type: TransactionType;
  initialData?: Transaction;
  onSubmit: (values: any, stayOpen?: boolean) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, initialData, onSubmit, onClose, isLoading }) => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData ? {
      amount: initialData.amount.toString(),
      category: initialData.category,
      description: initialData.description,
      date: initialData.date.split('T')[0],
      type: initialData.type,
    } : {
      type: type,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');
  const [customCategory, setCustomCategory] = React.useState('');
  const [isOtherSelected, setIsOtherSelected] = React.useState(false);

  React.useEffect(() => {
    if (selectedCategory === 'Other') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
  }, [selectedCategory]);

  const [receiptBase64, setReceiptBase64] = React.useState<string | undefined>(initialData?.receiptUrl);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB for local storage demo.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: TransactionFormValues, stayOpen: boolean = false) => {
    const finalCategory = data.category === 'Other' ? customCategory || 'Other' : data.category;
    
    onSubmit({
      ...data,
      category: finalCategory,
      amount: parseFloat(data.amount),
      receiptUrl: receiptBase64
    }, stayOpen);

    if (stayOpen) {
      reset({
        ...data,
        amount: '',
        description: '',
      });
      setCustomCategory('');
      setReceiptBase64(undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-0 bg-zinc-950 border-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg border',
              type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            )}>
              <IndianRupee className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {initialData ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit((data) => onFormSubmit(data, false))} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
              <IndianRupee className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
              <Input 
                label="Amount" 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                className="pl-10"
                {...register('amount')}
                error={errors.amount?.message}
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Select Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setValue('category', cat.label)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 group",
                      selectedCategory === cat.label
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    )}
                  >
                    <cat.icon className={cn(
                      "w-6 h-6 mb-2 transition-transform duration-300 group-hover:scale-110",
                      selectedCategory === cat.label ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-400"
                    )} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('category')} />
              {errors.category && <p className="text-xs font-medium text-rose-500 ml-1">{errors.category.message}</p>}
            </div>
          </div>

          {isOtherSelected && (
            <div className="relative group animate-in slide-in-from-top-2 duration-200">
              <Plus className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
              <Input 
                label="Custom Category" 
                placeholder="Type your category name" 
                className="pl-10"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative group">
            <Calendar className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
            <Input 
              label="Date" 
              type="date" 
              className="pl-10"
              {...register('date')}
              error={errors.date?.message}
            />
          </div>

          <div className="relative group">
            <FileText className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
            <Input 
              label="Description" 
              placeholder="What was this for?" 
              className="pl-10"
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Receipt / Bill (Optional)
              </label>
              {showSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-500 animate-in fade-in slide-in-from-right-2 duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Receipt uploaded successfully!</span>
                </div>
              )}
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all cursor-pointer",
                receiptBase64 
                  ? "border-emerald-500/50 bg-emerald-500/5" 
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              
              {receiptBase64 ? (
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-500">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Receipt Attached</p>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReceiptBase64(undefined);
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                  >
                    Remove and replace
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                  <div className="p-2 rounded-full bg-zinc-800 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Click to upload receipt</p>
                  <p className="text-[10px] text-zinc-600">Max size 2MB (Image or PDF)</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 h-11 font-bold uppercase tracking-widest" 
                disabled={isLoading}
                onClick={handleSubmit((data) => onFormSubmit(data, false))}
              >
                {isLoading ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}
              </Button>
              {!initialData && (
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1 h-11 font-bold uppercase tracking-widest border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10" 
                  disabled={isLoading}
                  onClick={handleSubmit((data) => onFormSubmit(data, true))}
                >
                  Save & Add Another
                </Button>
              )}
            </div>
            <Button type="button" variant="ghost" className="w-full h-11 font-bold uppercase tracking-widest text-zinc-500" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TransactionForm;

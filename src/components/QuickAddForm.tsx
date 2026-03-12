import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, TransactionType } from '@/src/types';
import { IndianRupee, Tag, FileText, Calendar, Upload, Paperclip, CheckCircle2, Plus } from 'lucide-react';
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

interface QuickAddFormProps {
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

const QuickAddForm: React.FC<QuickAddFormProps> = ({ onSubmit, isLoading }) => {
  const [type, setType] = React.useState<TransactionType>('income');
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'income',
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

  const [receiptBase64, setReceiptBase64] = React.useState<string | undefined>();
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

  const onFormSubmit = (data: TransactionFormValues) => {
    const finalCategory = data.category === 'Other' ? customCategory || 'Other' : data.category;
    
    onSubmit({
      ...data,
      category: finalCategory,
      amount: parseFloat(data.amount),
      receiptUrl: receiptBase64
    });
    reset();
    setCustomCategory('');
    setReceiptBase64(undefined);
  };

  return (
    <Card className="p-6 bg-zinc-950 border-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Quick Add</h3>
        <div className="flex p-1 rounded-lg bg-zinc-900 border border-zinc-800">
          <button 
            type="button"
            onClick={() => setType('income')}
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
              type === 'income' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Income
          </button>
          <button 
            type="button"
            onClick={() => setType('expense')}
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
              type === 'expense' ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Expense
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <input type="hidden" {...register('type')} value={type} />
        
        <div className="relative group">
          <IndianRupee className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Amount" 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            className="pl-10 h-10"
            {...register('amount')}
            error={errors.amount?.message}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setValue('category', cat.label)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 group",
                  selectedCategory === cat.label
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                <cat.icon className={cn(
                  "w-4 h-4 mb-1 transition-transform group-hover:scale-110",
                  selectedCategory === cat.label ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-400"
                )} />
                <span className="text-[8px] font-bold uppercase tracking-tighter text-center leading-tight truncate w-full">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" {...register('category')} />
          {errors.category && <p className="text-[10px] font-medium text-rose-500 ml-1">{errors.category.message}</p>}
        </div>

        {isOtherSelected && (
          <div className="relative group animate-in slide-in-from-top-2 duration-200">
            <Plus className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
            <Input 
              label="Custom Category" 
              placeholder="Type your category name" 
              className="pl-10 h-10"
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
            className="pl-10 h-10"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>

        <div className="relative group">
          <FileText className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Description" 
            placeholder="What was this for?" 
            className="pl-10 h-10"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Receipt (Optional)
            </label>
            {showSuccess && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group relative flex items-center justify-center w-full h-12 border-2 border-dashed rounded-xl transition-all cursor-pointer",
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
              <div className="flex items-center gap-2">
                <Paperclip className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Attached</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Upload</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" glow className="flex-1 h-10 text-[10px] font-bold uppercase tracking-widest" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Transaction'}
          </Button>
          <Button type="button" variant="outline" className="h-10 px-4 text-[10px] font-bold uppercase tracking-widest" onClick={() => reset()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuickAddForm;

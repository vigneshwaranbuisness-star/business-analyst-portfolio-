import { 
  Briefcase, 
  Store, 
  Globe, 
  Laptop, 
  TrendingUp, 
  Plus,
  Utensils,
  Plane,
  FileText,
  Home,
  Building,
  Users,
  Gamepad,
  HeartPulse,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  receiptUrl?: string;
}

export interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { label: 'Salary', icon: Briefcase, color: 'text-emerald-500' },
  { label: 'Shop Income', icon: Store, color: 'text-sky-500' },
  { label: 'Online Business', icon: Globe, color: 'text-indigo-500' },
  { label: 'Freelance', icon: Laptop, color: 'text-purple-500' },
  { label: 'Investment', icon: TrendingUp, color: 'text-amber-500' },
  { label: 'Other', icon: Plus, color: 'text-zinc-500' }
];

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { label: 'Food', icon: Utensils, color: 'text-orange-500' },
  { label: 'Travel', icon: Plane, color: 'text-blue-500' },
  { label: 'Bills', icon: FileText, color: 'text-rose-500' },
  { label: 'Rent', icon: Home, color: 'text-amber-600' },
  { label: 'Business Cost', icon: Building, color: 'text-zinc-400' },
  { label: 'Employee Salary', icon: Users, color: 'text-emerald-600' },
  { label: 'Entertainment', icon: Gamepad, color: 'text-pink-500' },
  { label: 'Health', icon: HeartPulse, color: 'text-red-500' },
  { label: 'Shopping', icon: ShoppingBag, color: 'text-fuchsia-500' },
  { label: 'Other', icon: Plus, color: 'text-zinc-500' }
];

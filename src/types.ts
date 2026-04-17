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

export const ICON_MAP: Record<string, LucideIcon> = {
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
};

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
  iconName: string;
  color: string;
}

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { label: 'Salary', iconName: 'Briefcase', color: 'text-emerald-500' },
  { label: 'Shop Income', iconName: 'Store', color: 'text-sky-500' },
  { label: 'Online Business', iconName: 'Globe', color: 'text-indigo-500' },
  { label: 'Freelance', iconName: 'Laptop', color: 'text-purple-500' },
  { label: 'Investment', iconName: 'TrendingUp', color: 'text-amber-500' },
  { label: 'Other', iconName: 'Plus', color: 'text-zinc-500' }
];

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { label: 'Food', iconName: 'Utensils', color: 'text-orange-500' },
  { label: 'Travel', iconName: 'Plane', color: 'text-blue-500' },
  { label: 'Bills', iconName: 'FileText', color: 'text-rose-500' },
  { label: 'Rent', iconName: 'Home', color: 'text-amber-600' },
  { label: 'Business Cost', iconName: 'Building', color: 'text-zinc-400' },
  { label: 'Employee Salary', iconName: 'Users', color: 'text-emerald-600' },
  { label: 'Entertainment', iconName: 'Gamepad', color: 'text-pink-500' },
  { label: 'Health', iconName: 'HeartPulse', color: 'text-red-500' },
  { label: 'Shopping', iconName: 'ShoppingBag', color: 'text-fuchsia-500' },
  { label: 'Other', iconName: 'Plus', color: 'text-zinc-500' }
];

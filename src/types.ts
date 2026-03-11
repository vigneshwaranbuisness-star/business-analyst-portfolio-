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

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export const INCOME_CATEGORIES = [
  'Salary',
  'Shop Income',
  'Online Business',
  'Freelance',
  'Investment',
  'Other'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Bills',
  'Rent',
  'Business Cost',
  'Entertainment',
  'Health',
  'Shopping',
  'Other'
];

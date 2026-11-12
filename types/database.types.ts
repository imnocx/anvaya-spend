export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Makanan'
  | 'Transportasi'
  | 'Belanja'
  | 'Pendidikan'
  | 'Hiburan'
  | 'Tagihan'
  | 'Kesehatan'
  | 'Gaji'
  | 'Investasi'
  | 'Uang Saku'
  | 'Bonus'
  | 'Lainnya';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM
  created_at: string;
  updated_at: string;
}

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

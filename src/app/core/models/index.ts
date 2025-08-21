export * from './transaction.interface';
export * from './budget.interface';
export * from './goal.interface';

// Common financial types
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  cashFlow: number;
  savingsRate: number; 
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface TimePeriod {
  start: string;
  end: string;
  label: string;
}

// Enums 
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum BudgetStatus {
  ON_TRACK = 'on-track',
  WARNING = 'warning',
  EXCEEDED = 'exceeded'
}
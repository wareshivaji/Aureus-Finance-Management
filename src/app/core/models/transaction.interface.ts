export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    description: string;
    paymentMethod: string;
    recurring: boolean;
    recurringId: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Dividends',
  'Rental Income',
  'Bonus',
  'Gift',
  'Refund',
  'Other Income'
] as const;

export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Dining',
  'Entertainment',
  'Transportation',
  'Car Payment',
  'Gas',
  'Utilities',
  'Rent',
  'Mortgage',
  'Insurance',
  'Healthcare',
  'Education',
  'Shopping',
  'Travel',
  'Subscriptions',
  'Debt Payment',
  'Gifts',
  'Donations',
  'Personal Care',
  'Home Maintenance',
  'Other Expense'
] as const;

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PayPal',
  'Venmo',
  'Check',
  'Digital Wallet',
  'Other'
] as const;

// Type guards and utilities
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export function isIncomeCategory(category: string): category is IncomeCategory {
  return (INCOME_CATEGORIES as readonly string[]).includes(category);
}

export function isExpenseCategory(category: string): category is ExpenseCategory {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(category);
}
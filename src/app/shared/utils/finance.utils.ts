import { Transaction, Budget, Goal } from 'src/app/core/models';

export class FinanceUtils {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static calculateNetWorth(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  }

  static getBudgetStatus(spent: number, budget: number): string {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'exceeded';
    if (percentage > 75) return 'warning';
    return 'on-track';
  }

  static getDaysUntilTarget(date: string): number {
    const target = new Date(date);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static generateMonthlyReport(transactions: Transaction[], budgets: Budget[], goals: Goal[]): any {
    const currentMonth = new Date().getMonth();
    const monthTransactions = transactions.filter(t => 
      new Date(t.date).getMonth() === currentMonth
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      income,
      expenses,
      net: income - expenses,
      transactions: monthTransactions.length,
      budgets: budgets.length,
      goals: goals.filter(g => !g.completed).length
    };
  }
}
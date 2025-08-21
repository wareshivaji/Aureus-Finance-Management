import { Injectable, signal } from '@angular/core';
import { Transaction, Budget, Goal } from '../models';

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  // Signals for reactive state management
  private transactions = signal<Transaction[]>([]);
  private budgets = signal<Budget[]>([]);
  private goals = signal<Goal[]>([]);

  // Public read-only signals
  readonly transactions$ = this.transactions.asReadonly();
  readonly budgets$ = this.budgets.asReadonly();
  readonly goals$ = this.goals.asReadonly();

  // Transaction methods
  addTransaction(transaction: Transaction) {
    this.transactions.update(items => [...items, transaction]);
  }

  updateTransaction(updatedTransaction: Transaction) {
    this.transactions.update(items => 
      items.map(item => item.id === updatedTransaction.id ? updatedTransaction : item)
    );
  }

  deleteTransaction(id: string) {
    this.transactions.update(items => items.filter(item => item.id !== id));
  }

  // Budget methods
  addBudget(budget: Budget) {
    this.budgets.update(items => [...items, budget]);
  }

  updateBudget(updatedBudget: Budget) {
    this.budgets.update(items => 
      items.map(item => item.id === updatedBudget.id ? updatedBudget : item)
    );
  }

  deleteBudget(id: string) {
    this.budgets.update(items => items.filter(item => item.id !== id));
  }

  // Goal methods
  addGoal(goal: Goal) {
    this.goals.update(items => [...items, goal]);
  }

  updateGoal(updatedGoal: Goal) {
    this.goals.update(items => 
      items.map(item => item.id === updatedGoal.id ? updatedGoal : item)
    );
  }

  deleteGoal(id: string) {
    this.goals.update(items => items.filter(item => item.id !== id));
  }

  // Initialize with some demo data
  initializeDemoData() {
    const demoTransactions: Transaction[] = [
      {
        id: '1',
        amount: 3000,
        type: 'income',
        category: 'Salary',
        date: new Date().toISOString(),
        description: 'Monthly salary',
        paymentMethod: 'Bank Transfer',
        recurring: true,
        recurringId: 'salary-1',
        tags: ['income', 'salary'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      // {
      //   id: '2',
      //   amount: 85.47,
      //   type: 'expense',
      //   category: 'Groceries',
      //   date: new Date().toISOString(),
      //   description: 'Weekly groceries',
      //   paymentMethod: 'Credit Card',
      //   recurring: false,
      //   tags: ['food', 'essential'],
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString()
      // }
    ];

    const demoBudgets: Budget[] = [
      {
        id: '1',
        category: 'Groceries',
        amount: 400,
        period: 'monthly',
        type: 'category',
        startDate: new Date().toISOString(),
        rollover: false,
        alerts: [{ type: 'percentage', threshold: 80, triggered: false }],
        createdAt: new Date().toISOString()
      }
    ];

    const demoGoals: Goal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 2500,
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'emergency-fund',
        autoDeduct: true,
        autoDeductAmount: 200,
        autoDeductFrequency: 'monthly',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    this.transactions.set(demoTransactions);
    this.budgets.set(demoBudgets);
    this.goals.set(demoGoals);
  }
}
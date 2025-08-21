import { Injectable, computed } from '@angular/core';
import { DataStoreService } from './data-store.service';
import { FinancialSummary, BudgetProgress, GoalProgress } from '../models';

@Injectable({ providedIn: 'root' })
export class CalculationsService {
  constructor(private dataStore: DataStoreService) {}

  // Financial Summary
  financialSummary = computed(() => {
    const transactions = this.dataStore.transactions$();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netWorth = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    const savingsRate = income > 0 ? (income - expenses) / income * 100 : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netWorth,
      cashFlow: income - expenses,
      savingsRate
    } as FinancialSummary;
  });

  // Recent Transactions
  recentTransactions = computed(() => {
    return this.dataStore.transactions$()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  // Budget Progress
  budgetProgress = computed(() => {
    const budgets = this.dataStore.budgets$();
    const transactions = this.dataStore.transactions$();
    const currentMonth = new Date().getMonth();
    
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && 
                    t.category === budget.category && 
                    new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const percentage = (spent / budget.amount) * 100;
      let status: 'on-track' | 'warning' | 'exceeded' = 'on-track';
      
      if (percentage > 100) status = 'exceeded';
      else if (percentage > 75) status = 'warning';
      
      return {
        budget,
        spent,
        remaining: budget.amount - spent,
        percentage,
        status,
        daysRemaining: 30 - new Date().getDate() 
      } as BudgetProgress;
    });
  });

  // Goal Progress
  goalProgress = computed(() => {
    const goals = this.dataStore.goals$();
    
    return goals.map(goal => {
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
      const amountRemaining = goal.targetAmount - goal.currentAmount;
      
      const today = new Date();
      const targetDate = new Date(goal.targetDate);
      const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const dailyAmountNeeded = amountRemaining / Math.max(daysRemaining, 1);
      
      let status: 'on-track' | 'behind' | 'ahead' = 'on-track';
      if (progressPercentage < (daysRemaining / 365 * 100)) status = 'behind';
      if (progressPercentage > (daysRemaining / 365 * 100)) status = 'ahead';
      
      const projectedDate = new Date();
      projectedDate.setDate(projectedDate.getDate() + (amountRemaining / dailyAmountNeeded));
      
      return {
        goal,
        progressPercentage,
        amountRemaining,
        dailyAmountNeeded,
        projectedDate: projectedDate.toISOString(),
        status
      } as GoalProgress;
    });
  });

  // Spending by Category
  spendingByCategory = computed(() => {
    const transactions = this.dataStore.transactions$();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryMap = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / this.financialSummary().totalExpenses) * 100,
      count: expenses.filter(t => t.category === category).length
    }));
  });
}
import { Component, inject, OnInit, computed } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { BudgetEditorComponent } from '../../components/budget-editor/budget-editor.component';
import { GoalTrackerComponent } from '../../components/goal-tracker/goal-tracker.component';
import { DataStoreService } from '../../../../core/services/data-store.service';
import { CalculationsService } from '../../../../core/services/calculations.service';
import { Transaction, Budget, Goal, GoalCategory } from '../../../../core/models';
import { GOAL_CATEGORIES } from '../../../../core/models';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private dataStore = inject(DataStoreService);
  private calculations = inject(CalculationsService);
  private dialog = inject(MatDialog);

  // Data signals
  transactions = this.dataStore.transactions$;
  budgets = this.dataStore.budgets$;
  goals = this.dataStore.goals$;

  // Computed values
  summary = this.calculations.financialSummary;
  recentTransactions = this.calculations.recentTransactions;
  budgetProgress = this.calculations.budgetProgress;
  goalProgress = this.calculations.goalProgress;

  // Calculate total goal deductions
  totalGoalDeductions = computed(() => {
    const goals = this.goals();
    return goals
      .filter(goal => goal.autoDeduct && goal.autoDeductAmount)
      .reduce((total, goal) => total + (goal.autoDeductAmount || 0), 0);
  });

  // Adjusted balance after goal deductions (prevents negative values)
  adjustedBalance = computed(() => {
    const netWorth = this.summary().netWorth;
    const deductions = this.totalGoalDeductions();
    return Math.max(0, netWorth - deductions);
  });

  ngOnInit() {
    // Data is loaded automatically from service
  }

  openTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Transaction) => {
      if (result) {
        this.dataStore.addTransaction(result);
      }
    });
  }

  openBudgetEditor(budget?: Budget): void {
    const dialogRef = this.dialog.open(BudgetEditorComponent, {
      width: '600px',
      disableClose: true,
      data: budget || null
    });

    dialogRef.afterClosed().subscribe((result: Budget) => {
      if (result) {
        if (budget) {
          this.dataStore.updateBudget({...result, id: budget.id});
        } else {
          this.dataStore.addBudget(result);
        }
      }
    });
  }

  openGoalTracker(goal?: Goal): void {
    const dialogRef = this.dialog.open(GoalTrackerComponent, {
      width: '600px',
      disableClose: true,
      data: goal || null
    });

    dialogRef.afterClosed().subscribe((result: Goal) => {
      if (result) {
        if (goal) {
          this.dataStore.updateGoal({...result, id: goal.id});
        } else {
          this.dataStore.addGoal(result);
        }
      }
    });
  }

  deleteBudget(id: string) {
    this.dataStore.deleteBudget(id);
  }

  deleteGoal(id: string) {
    this.dataStore.deleteGoal(id);
  }

  resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      this.dataStore.initializeDemoData();
    }
  }

  getGoalIcon(category: GoalCategory): string {
    return GOAL_CATEGORIES[category]?.icon || 'savings';
  }

  getGoalProgressColor(goal: Goal): string {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    if (progress >= 100) return 'primary';
    if (progress >= 75) return 'accent';
    return 'warn';
  }

  // Helper to get icon based on category
  getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'Groceries': 'shopping_cart',
      'Salary': 'work',
      'Netflix': 'movie',
      'Gas': 'local_gas_station',
      'Gift': 'card_giftcard',
      'Dining': 'restaurant',
      'Entertainment': 'sports_esports',
      'Transportation': 'directions_car',
      'Utilities': 'house',
      'Rent': 'apartment',
      'Healthcare': 'local_hospital',
      'Education': 'school'
    };
    
    return icons[category] || 'receipt';
  }
}
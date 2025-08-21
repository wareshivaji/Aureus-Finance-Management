import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget, BudgetPeriod, EXPENSE_CATEGORIES } from '../../../../core/models';

@Component({
  selector: 'app-budget-editor',
  templateUrl: './budget-editor.component.html',
  styleUrls: ['./budget-editor.component.css']
})
export class BudgetEditorComponent implements OnInit {
  budgetForm!: FormGroup;
  categories = EXPENSE_CATEGORIES;
  periods: BudgetPeriod[] = ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BudgetEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Budget
  ) {}

  ngOnInit() {
    this.budgetForm = this.fb.group({
      category: [this.data?.category || '', Validators.required],
      amount: [this.data?.amount || 0, [Validators.required, Validators.min(1)]],
      period: [this.data?.period || 'monthly', Validators.required],
      rollover: [this.data?.rollover || false]
    });
  }

  onSave(): void {
    if (this.budgetForm.valid) {
      const formValue = this.budgetForm.value;
      const budget: Budget = {
        id: this.data?.id || Date.now().toString(),
        category: formValue.category,
        amount: formValue.amount,
        period: formValue.period,
        type: 'category',
        startDate: this.data?.startDate || new Date().toISOString(),
        rollover: formValue.rollover,
        alerts: this.data?.alerts || [{ type: 'percentage', threshold: 80, triggered: false }],
        createdAt: this.data?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.dialogRef.close(budget);
    }
  }

  onCancel(): void {
    this.dialogRef.close();  
  }
}
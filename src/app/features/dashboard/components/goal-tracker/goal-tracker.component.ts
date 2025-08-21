import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Goal, GoalCategory, GoalPriority } from '../../../../core/models';
import { GOAL_CATEGORIES } from '../../../../core/models';

@Component({
  selector: 'app-goal-tracker',
  templateUrl: './goal-tracker.component.html',
  styleUrls: ['./goal-tracker.component.css']
})
export class GoalTrackerComponent implements OnInit {
  goalForm!: FormGroup;
  categories = Object.entries(GOAL_CATEGORIES).map(([value, config]) => ({
    value: value as GoalCategory,
    label: config.name,
    icon: config.icon
  }));
  priorities: GoalPriority[] = ['low', 'medium', 'high', 'critical'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GoalTrackerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Goal
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.goalForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      targetAmount: [this.data?.targetAmount || 0, [Validators.required, Validators.min(1)]],
      currentAmount: [this.data?.currentAmount || 0, [Validators.required, Validators.min(0)]],
      targetDate: [this.data?.targetDate ? new Date(this.data.targetDate) : new Date(), Validators.required],
      category: [this.data?.category || 'other', Validators.required],
      priority: [this.data?.priority || 'medium', Validators.required],
      autoDeduct: [this.data?.autoDeduct || false],
      autoDeductAmount: [this.data?.autoDeductAmount || 0],
      notes: [this.data?.notes || '']
    });

    // Enable/disable autoDeductAmount based on autoDeduct toggle
    this.goalForm.get('autoDeduct')?.valueChanges.subscribe(autoDeduct => {
      const autoDeductAmountControl = this.goalForm.get('autoDeductAmount');
      if (autoDeduct) {
        autoDeductAmountControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        autoDeductAmountControl?.clearValidators();
        autoDeductAmountControl?.setValue(0);
      }
      autoDeductAmountControl?.updateValueAndValidity();
    });
  }

  onSave(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      
      const goal: Goal = {
        id: this.data?.id || Date.now().toString(),
        name: formValue.name,
        targetAmount: formValue.targetAmount,
        currentAmount: formValue.currentAmount,
        targetDate: new Date(formValue.targetDate).toISOString(),
        category: formValue.category,
        priority: formValue.priority,
        autoDeduct: formValue.autoDeduct,
        autoDeductAmount: formValue.autoDeductAmount || 0,
        notes: formValue.notes,
        completed: this.data?.completed || false,
        createdAt: this.data?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.dialogRef.close(goal);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.goalForm);
    }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to check if field has error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.goalForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }
}
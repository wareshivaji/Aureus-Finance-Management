import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../../core/models';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  typeFormGroup!: FormGroup;
  amountFormGroup!: FormGroup;
  detailsFormGroup!: FormGroup;

  incomeCategories = [...INCOME_CATEGORIES]; // Convert to regular array
  expenseCategories = [...EXPENSE_CATEGORIES]; // Convert to regular array
  paymentMethods = PAYMENT_METHODS;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.typeFormGroup = this.fb.group({
      type: ['expense', Validators.required]
    });

    this.amountFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required]
    });

    this.detailsFormGroup = this.fb.group({
      date: [new Date(), Validators.required],
      description: [''],
      paymentMethod: ['Cash', Validators.required]
    });

    // Update categories when type changes
    this.typeFormGroup.get('type')?.valueChanges.subscribe(type => {
      this.amountFormGroup.patchValue({ category: '' });
    });
  }

  get categories(): string[] {
    const type = this.typeFormGroup.get('type')?.value;
    return type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.typeFormGroup.valid && this.amountFormGroup.valid && this.detailsFormGroup.valid) {
      const formData = {
        ...this.typeFormGroup.value,
        ...this.amountFormGroup.value,
        ...this.detailsFormGroup.value
      };

      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        recurring: false,
        recurringId: '',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.dialogRef.close(transaction);
    }
  }
}
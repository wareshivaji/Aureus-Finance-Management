import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEditorComponent } from './budget-editor.component';

describe('BudgetEditorComponent', () => {
  let component: BudgetEditorComponent;
  let fixture: ComponentFixture<BudgetEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetEditorComponent]
    });
    fixture = TestBed.createComponent(BudgetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

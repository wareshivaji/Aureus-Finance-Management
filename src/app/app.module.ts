import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { AnalysisComponent } from './features/dashboard/pages/analysis/analysis.component';
import { TransactionFormComponent } from './features/dashboard/components/transaction-form/transaction-form.component';
import { BudgetEditorComponent } from './features/dashboard/components/budget-editor/budget-editor.component';
import { GoalTrackerComponent } from './features/dashboard/components/goal-tracker/goal-tracker.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { FutureComponent } from './features/dashboard/pages/future/future.component';



@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    AnalysisComponent,
    TransactionFormComponent,
    BudgetEditorComponent,
    GoalTrackerComponent,
    NavbarComponent,
    FooterComponent,
    FutureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

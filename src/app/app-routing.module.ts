import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { AnalysisComponent } from './features/dashboard/pages/analysis/analysis.component';
import { FutureComponent } from './features/dashboard/pages/future/future.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/overview', pathMatch: 'full' },
  { path: 'dashboard/overview', component: OverviewComponent },
  { path: 'dashboard/analysis', component: AnalysisComponent },
  { path: 'dashboard/future', component: FutureComponent },
  // { path: 'settings', component: Setting },
  { path: '**', redirectTo: 'dashboard/overview' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

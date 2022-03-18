import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { content } from './shared/routes/content-routes';
const routes: Routes = [
  {
    path: 'main',
    component: ContentLayoutComponent,
    children: content
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }

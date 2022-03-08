import { BlogNoSidebarComponent } from './../pages/blog/blog-no-sidebar/blog-no-sidebar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { VegetableComponent } from './vegetable/vegetable.component';


const routes: Routes = [
  {
    path: 'main',
    component: VegetableComponent
  },
  {
    path: 'blog',
    component: BlogNoSidebarComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

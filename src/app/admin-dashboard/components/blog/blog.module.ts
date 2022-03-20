import { AddBlogComponent } from './add-blog/add-blog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminBlogRoutingModule } from './blog-routing.module';
import { AdminBlogList } from './blog-list/blog-list.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [AdminBlogList, AddBlogComponent],
  imports: [
    CommonModule,
    AdminBlogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgxDropzoneModule
  ]
})
export class AdminBlogModule { }

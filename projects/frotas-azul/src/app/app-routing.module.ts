import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

import { ListModule } from './list/list.module';
import { EditModule } from './edit/edit.module';
import { FileValueAccessorDirective } from './directives/file-control-value-accessor';

const ROUTES: Routes = [
  { path: '', component: ListComponent },
  { path: 'detail/:id', component: EditComponent },
];

@NgModule({
  imports: [
    CommonModule,
    EditModule,
    ListModule,
    RouterModule.forRoot(ROUTES)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

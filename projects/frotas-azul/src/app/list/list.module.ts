import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ListComponent } from './list.component';
import { FormModalModule } from '../form-modal/form-modal.module';
import { FilterPipe } from '../pipe/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    FormModalModule,
  ],
  declarations: [ListComponent, FilterPipe],
  exports: [ListComponent]
})
export class ListModule { }

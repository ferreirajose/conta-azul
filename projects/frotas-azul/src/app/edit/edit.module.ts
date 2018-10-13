import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EditComponent } from './edit.component';
import { FileValueAccessorDirective } from '../directives/file-control-value-accessor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ EditComponent],
  exports: [ EditComponent]
})
export class EditModule { }

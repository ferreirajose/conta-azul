import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VoxAlertModule } from '@voxtecnologia/alert';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormModalComponent } from './form-modal.component';
import { FileValueAccessorDirective } from '../directives/file-control-value-accessor';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    VoxAlertModule,
    ReactiveFormsModule
  ],
  declarations: [FormModalComponent, FileValueAccessorDirective],
  exports: [FormModalComponent]
})
export class FormModalModule { }

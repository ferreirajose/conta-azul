import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VoxAlertModule } from '@voxtecnologia/alert';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormModalComponent } from './form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    VoxAlertModule,
    ReactiveFormsModule
  ],
  declarations: [FormModalComponent],
  exports: [FormModalComponent]
})
export class FormModalModule { }

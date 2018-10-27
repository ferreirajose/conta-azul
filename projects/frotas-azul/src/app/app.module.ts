import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertModule } from '@voxtecnologia/alert';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { FilterPipe } from './pipe/filter.pipe';
import { routing, appRoutingProviders } from './app.routing';
import { FileValueAccessorDirective } from './directives/file-control-value-accessor';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    FormModalComponent,
    PageNotFoundComponent,
    FilterPipe,
    FileValueAccessorDirective
  ],
  imports: [
    BrowserModule,
    routing,
    NgbModule.forRoot(),
    VoxAlertModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import br from '@angular/common/locales/br';

import { AppComponent } from './app.component';

import { FormModalModule } from './form-modal/form-modal.module';
import { FilterPipe } from './pipe/filter.pipe';

registerLocaleData(br, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    FormModalModule
  ],
  providers: [{
      provide: LOCALE_ID,
      useValue: 'pt-BR'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

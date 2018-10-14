import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  template: `
              <div class="text-center">
                <h2>404 - Página não encontrada</h2>
                <a (click)="onVoltar()" class="btn btn-primary btn-lg">
                <i class="fa fa-home" aria-hidden="true"></i> Voltar
                </a>
              </div>
             `
})
export class PageNotFoundComponent {

  constructor(private router: Router) { }

  public onVoltar(): void {
    this.router.navigate(['']);
  }

}

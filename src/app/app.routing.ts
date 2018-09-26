import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: Array<any> = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

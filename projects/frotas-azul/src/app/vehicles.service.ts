import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarcaInterface } from './form-modal/marca.interface';
import { ModelosInterface } from './form-modal/modelos.interface';


@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private apiUrl = 'http://localhost:3000/v1';

  constructor(private http: HttpClient) {}

  public getAllVehicles(): Observable<any> {
    const apiUrl = 'http://www.mocky.io/v2/5bb001c93100001000fb60b9';
    return this.http.get(apiUrl, { withCredentials: true, responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public getAllMarcas(): Observable<Array<MarcaInterface>> {
    const apiUrl = 'http://fipeapi.appspot.com/api/1/carros/marcas.json';
    return this.http.get<Array<MarcaInterface>>(apiUrl, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public getVehiclesByMarcas(marcar: number): Observable<Array<ModelosInterface>> {
    const apiUrl = `http://fipeapi.appspot.com/api/1/carros/veiculos/${marcar}.json`;
    return this.http.get<Array<ModelosInterface>>(apiUrl, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public addNewVehicles(dados): Observable<any> {
    return this.http.post(this.apiUrl, dados, { withCredentials: true, responseType: 'json'})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    return throwError('Something bad happened; please try again later.');
  }

}

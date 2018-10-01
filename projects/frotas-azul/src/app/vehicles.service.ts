import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarcaInterface } from './interface/marca.interface';
import { ModelosInterface } from './interface/modelos.interface';
import { VeiculosInterface } from './interface/veiculos.interface';


@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private apiUrl = 'http://localhost:3000/v1';

  constructor(private http: HttpClient) {}

  public getAllVehicles(): Observable<Array<VeiculosInterface>> {
    const apiUrl = 'http://www.mocky.io/v2/5bb154432e00006200927148';
    return this.http.get<Array<VeiculosInterface>>(apiUrl, { responseType: 'json'})
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

  public addNewVehicles(dados): Observable<VeiculosInterface> {

    if (dados.foto === null) {
        dados.foto = '../assets/no_image_available.svg';
    }

    return this.http.post<VeiculosInterface>(this.apiUrl, dados, { responseType: 'json'})
      .pipe(
        catchError(this.handleError)
      );
  }

  public removeVehicles(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'json'})
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
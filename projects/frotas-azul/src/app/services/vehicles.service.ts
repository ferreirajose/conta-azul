import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, concatAll } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { VeiculosInterface } from '../interface/veiculos.interface';


@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private apiUrl = `${environment.APIEndpoint}/v1`;

  constructor(private http: HttpClient) {}

  public getAllVehicles(): Observable<Array<VeiculosInterface>> {

    return this.http.get<Array<VeiculosInterface>>(this.apiUrl, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public getAllVehiclesByID(id: string): Observable<VeiculosInterface> {
    return this.http.get<VeiculosInterface>(`${this.apiUrl}/${id}`, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public getAllMarcasByTipo(tipo: string): Observable<Array<MarcaInterface>> {
    const apiUrl = `http://fipeapi.appspot.com/api/1/${tipo}/marcas.json`;
    return this.http.get<Array<MarcaInterface>>(apiUrl, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public getVehiclesByMarcas(tipo: string, marcar: number): Observable<Array<ModelosInterface>> {
    const apiUrl = `http://fipeapi.appspot.com/api/1/${tipo}/veiculos/${marcar}.json`;
    return this.http.get<Array<ModelosInterface>>(apiUrl, { responseType: 'json'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }

  public addNewVehicles(dados: VeiculosInterface): Observable<VeiculosInterface> {
    delete dados._id;

    return this.http.post<VeiculosInterface>(this.apiUrl, dados, { responseType: 'json'})
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateVehicles(dados: VeiculosInterface): Observable<VeiculosInterface> {
    return this.http.put<VeiculosInterface>(`${this.apiUrl}/${dados._id}`, dados, { responseType: 'json'})
      .pipe(
        catchError(this.handleError)
      );
  }


  public removeVehicles(ids: Array<string>): Observable<Array<string>> {
    return <Observable<Array<string>>> forkJoin(
      ids.map(id => <Observable<Array<string>>> this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'json'}))
    ).pipe(
        concatAll(),
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

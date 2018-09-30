import { Component, OnInit, OnDestroy } from '@angular/core';

import { VehiclesService } from './vehicles.service';
import { VoxAlertService } from '@voxtecnologia/alert';
import { Subscription } from 'rxjs';
import { EventEmitterService } from './util/event-emitter.service';
import { VeiculosInterface } from './interface/veiculos.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public sub: Subscription;
  private _isVisible: boolean;
  private _vehicles: Array<VeiculosInterface>;
  private idVehicles: string;

  constructor(
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService
  ) {

  }

  ngOnInit() {
    this.init();

    EventEmitterService.get('addNewVehicles').subscribe(
      (res) => {
        this.init();
    }, (erro) => {
      this.alertService.openModal(erro, 'Erro', 'danger');
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  public get vehicles(): Array<VeiculosInterface> {
    return this._vehicles;
  }

  public get isVisible(): boolean {
    return this._isVisible = true;
  }

  public onChange(event) {
    this.idVehicles = event.value;
  }

  public removeItem(): void {
    this.sub = this.vehiclesService.removeVehicles(this.idVehicles).subscribe(
      (res) => {
        this.alertService.openModal(res.msn, 'Sucesso', 'success');
        this.init();
    }, (erro: Error) => {
      this.alertService.openModal(erro.message, 'Erro', 'danger');
    });
  }

  private init(): void {
    this.sub = this.vehiclesService.getAllVehicles().subscribe(
      (res) => {
        this._vehicles = res;
      },
      (erro) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

}

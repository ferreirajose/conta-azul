import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { VoxAlertService } from '@voxtecnologia/alert';

import { PagerService } from './pager.service';
import { VehiclesService } from './vehicles.service';
import { EventEmitterService } from './util/event-emitter.service';
import { VeiculosInterface } from './interface/veiculos.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public pager: any;

  private _isVisible: boolean;
  private _vehicles: Array<VeiculosInterface>;
  private _pagedItems: Array<VeiculosInterface>;
  private idVehicles: string;
  private _sub: Subscription;
  private _check: Array<string>;

  constructor(
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService,
    private pagerService: PagerService
  ) {
    this.pager = {};
    this._check = [];
  }

  ngOnInit(): void {
    this.init();

    EventEmitterService.get('addNewVehicles').subscribe(
      (res) => {
        this.init();
    }, (erro) => {
      this.alertService.openModal(erro, 'Erro', 'danger');
    });
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public get pagedItems(): Array<VeiculosInterface> {
    return this._pagedItems;
  }

  public get isVisible(): boolean {
    return this._isVisible = true;
  }

  public onChange(event): void {
    this.idVehicles = event.value;
  }

  public removeItem(): void {
    this._sub = this.vehiclesService.removeVehicles(this.idVehicles).subscribe(
      (res) => {
        this.alertService.openModal(res.msn, 'Sucesso', 'success');
    }, (erro: Error) => {
      this.alertService.openModal(erro.message, 'Erro', 'danger');
    });
  }

  public setPage(page: number): void {
    this.pager = this.pagerService.getPager(this._vehicles.length, page);
    this._pagedItems = this._vehicles.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  private init(): void {
    this._sub = this.vehiclesService.getAllVehicles().subscribe(
      (res) => {
        this._vehicles = res;
        this.setPage(1);
      },
      (erro) => {
        this.alertService.openModal(erro, 'Erro', 'danger');
      });
  }

}

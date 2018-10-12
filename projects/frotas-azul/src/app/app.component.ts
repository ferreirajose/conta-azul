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

  private _vehicles: Array<VeiculosInterface>;
  private _pagedItems: Array<VeiculosInterface>;
  private _sub: Subscription;
  private _check: Array<string>;
  private _msn: Object;
  private _msnVisible: boolean;

  constructor(
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService,
    private pagerService: PagerService
  ) {
    this.pager = {};
    this._msn = {};
    this._check = [];
    this._msnVisible = false;
  }

  ngOnInit(): void {
    this.init();

    // EventEmitterService.get('addNewVehicles').subscribe(
    //   (res) => {
    //     this.init();
    // }, (erro) => {
    //   this.alertService.openModal(erro, 'Erro', 'danger');
    // });
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public get pagedItems(): Array<VeiculosInterface> {
    return this._pagedItems;
  }

  public get msnVisible(): boolean {
    return this._msnVisible;
  }

  public get message(): Object {
    return this._msn;
  }

  public onChange(event): void {
    this._check.push(event.value);
  }

  public removeItem(): void {
    this._sub = this.vehiclesService.removeVehicles(this._check).subscribe(
      (res) => {
        this._msn['texto'] = res['msn'];
        this._msn['alert'] = 'success';
        this._msnVisible = true;
        this.init();
    }, (erro: Error) => {
        this._msn['texto'] = erro.message;
        this._msn['alert'] = 'danger';
        this._msnVisible = true;
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

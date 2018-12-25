import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { VoxAlertService } from '@voxtecnologia/alert';
import { PagerService } from '../services/pager.service';
import { VehiclesService } from '../services/vehicles.service';
import { VeiculosInterface } from '../interface/veiculos.interface';
import { TypeBtn } from '../shared/enum-btn';
import { EventEmitterService } from '../shared/event-emitter.service';
import { MessageInterface } from '../interface/message.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  public pager: any;
  public selectedAll: any;
  public default: string;
  public searchText: string;

  private _vehicles: Array<VeiculosInterface>;
  private _pagedItems: Array<VeiculosInterface>;
  private _sub: Subscription;
  private _msn: MessageInterface;

  private check: Array<string>;

  constructor(
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService,
    private pagerService: PagerService
  ) {
    this.pager = {};
    this._msn = {
      type: '',
      texto: '',
      visible: false
    };
    this.check = [];
    this._pagedItems = [];
    this.default = '../assets/no_image_available.svg';
  }

  ngOnInit(): void {
    this.init();
    this.updateView();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public get add(): TypeBtn {
    return TypeBtn.ADD;
  }

  public get edit(): TypeBtn {
    return TypeBtn.EDIT;
  }

  public get pagedItems(): Array<VeiculosInterface> {
    return this._pagedItems;
  }

  public get message(): MessageInterface {
    return this._msn;
  }


  public selectAll(): void {
    this._pagedItems.map(val => {
      val.selected = this.selectedAll;
    });
  }

  public checkIfAllSelected(): void {
    this.selectedAll = this._pagedItems.every(item => {
      return item.selected === true;
    });
  }

  public removeItem(): void {

    this.check = this.pagedItems.filter(item => {
      return item.selected === true;
    }).map(val => val._id);

    this.vehiclesService.removeVehicles(this.check).subscribe(
      (res) => {
        this._msn = {
          texto: res['msn'],
          type: 'success',
          visible: true
        };
        this.init();
    }, (erro: Error) => {
        this._msn = {
          texto: erro || erro.message,
          type: 'danger',
          visible: true
        };
    });
  }

  public setPage(page: number): void {
    this.pager = this.pagerService.getPager(this._vehicles.length, page);
    this._pagedItems = this._vehicles.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  private init(): void {
    this._sub = this.vehiclesService.getAllVehicles().subscribe(
      (res) => {

        res.map(vehicles => vehicles.valor = vehicles.valor.toLocaleString('pt-Br', { style: 'currency', currency: 'BRL' }));
        this._vehicles = res;
        this.setPage(1);
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

  private updateView(): void {
    EventEmitterService.get('updateView').subscribe(
      (res: any) => {
        this.init();
    }, (erro: Error) => {
      this.alertService.openModal(erro.message, 'Erro', 'danger');
    });

  }
}

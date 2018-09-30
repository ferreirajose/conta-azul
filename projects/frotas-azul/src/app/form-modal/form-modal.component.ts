import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../vehicles.service';
import { MarcaInterface } from './marca.interface';
import { ModelosInterface } from './modelos.interface';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit, OnDestroy {

  public formVehicles: FormGroup;
  public sub: Subscription;
  @Input() public isVisible: boolean;

  private _marcars: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;

  constructor(
      private formBuilder: FormBuilder,
      private modalService: NgbModal,
      private alertService: VoxAlertService,
      private vehiclesService: VehiclesService
  ) {
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.createForm();
    this.getMarcas();
    this.getModelos();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public get marcas(): Array<MarcaInterface> {
    return this._marcars;
  }

  public get modelos(): Array<ModelosInterface> {
    return this._modelos;
  }

  public open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  public submitForm(): void {

  }

  private getMarcas(): void {
    this.sub = this.vehiclesService.getAllMarcas().subscribe(
      (marca) => {
        this._marcars = marca;
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
        console.log(erro.message);
    });
  }

  private getModelos(): void {
    const marca = 1;
    this.sub = this.vehiclesService.getVehiclesByMarcas(marca).subscribe(
      (modelo) => {
        this._modelos = modelo;
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
        console.log(erro.message);
    });
  }

  private createForm() {
      this.formVehicles = this.formBuilder.group({
          marca: '',
          placa: '',
          modelo: '',
          foto: '',
          combustivel: '',
          valor: ''
      });
  }
}

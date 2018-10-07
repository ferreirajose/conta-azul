import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../vehicles.service';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { EventEmitterService } from '../util/event-emitter.service';
import { log } from 'util';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit, OnDestroy {

  public formVehicles: FormGroup;
  public sub: Subscription;

  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() public isVisible: boolean;

  private _marcars: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;
  private tipo: string;

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
    // this.getMarcas();
    // this.getModelos();

    this.formVehicles.get('tiposVeiculos').valueChanges.subscribe(val => {
      this.tipo = val;
      console.log(val);
      this.getMarcas(val);
    });


    this.formVehicles.get('marca').valueChanges.subscribe(val => {
      console.log(val.id);
      this.getModelos(this.tipo, val.id);
    });

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

  public open(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  public onFileChange(event) {
    const reader = new FileReader();
  }


  public submitForm(): void {
    const formDados = this.formVehicles.value;

    this.vehiclesService.addNewVehicles(formDados).subscribe(
      (res) => {
        this.alertService.openModal('Resgistro salvo com sucesso', 'Sucesso', 'success');
        EventEmitterService.get('addNewVehicles').emit(res);
        this.resetaDadosForm();
      }, (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

  public get tiposVeiculos() {
    return [
      {
        codigo: 1,
        nome: 'carros'
      },
      {
        codigo: 2,
        nome: 'motos'
      },
      {
        codigo: 3,
        nome: 'caminhoes'
      }
    ];
  }

  private getMarcas(tipo): void {
    this.sub = this.vehiclesService.getAllMarcasByTipo(tipo).subscribe(
      (marca) => {
        this._marcars = marca;
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

  private getModelos(tipo, marca): void {
    this.sub = this.vehiclesService.getVehiclesByMarcas(tipo, marca).subscribe(
      (modelo) => {
        this._modelos = modelo;
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

  private createForm() {
    this.formVehicles = this.formBuilder.group({
      tiposVeiculos: [null, Validators.required],
      marca: [null, Validators.required],
      placa: [null, Validators.required],
      modelo: [null, Validators.required],
      imagem: [null],
      combustivel: [null, Validators.required],
      valor: [null, Validators.required]
    });
  }

  private resetaDadosForm(): void {
    this.formVehicles.patchValue({
      tiposVeiculos: '',
        marca: '',
        placa: '',
        modelo: '',
        imagem: '',
        combustivel: '',
        valor: ''
    });
  }

}

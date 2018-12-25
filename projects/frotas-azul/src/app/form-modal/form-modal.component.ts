import { FormBuilder} from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

import { Subscription, from } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../services/vehicles.service';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { Upload } from '../shared/upload';
import { Form } from '../shared/form';
import { TypeBtn } from '../shared/enum-btn';
import { VeiculosInterface } from '../interface/veiculos.interface';
import { EventEmitterService } from '../shared/event-emitter.service';
import { MessageInterface } from '../interface/message.interface';
@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() public typeButton: Object;
  @Input() public idVehicles: string;

  public sub: Subscription;
  public url: any;

  private _formVehicles: Form;
  private _marcas: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;
  private tipo: string;
  private _msn: MessageInterface;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService
  ) {
    this._formVehicles = new Form(this.formBuilder);
    this._marcas = [];
    this._msn = {
      type: '',
      texto: '',
      visible: false
    };
  }

  ngOnInit(): void {

    this.sub = this._formVehicles.actionForm().get('tiposVeiculos').valueChanges.subscribe(val => {
        this.tipo = val;
        this.getMarcas(val);
    });

    this.sub = this._formVehicles.actionForm().get('marca').valueChanges.subscribe(val => {
      if (val) {
        this.getModelos(this.tipo, val.id);
      }
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public get marcas(): Array<MarcaInterface> {
    return this._marcas;
  }

  public get modelos(): Array<ModelosInterface> {
    return this._modelos;
  }

  public get message(): MessageInterface {
    return this._msn;
  }

  public open(content, id): void {
    if (id) {
      this.getVehiclesByID(id);
    }
    this.modalService.open(content, { size: 'lg' });
  }

  public get formVehicles() {
    return this._formVehicles.actionForm();
  }

  public async onFileChange(event): Promise<void> {
    if (!event.target || !event.target.files) {
      return;
    }

    const fileList = event.target.files;
    const latestUploadedFile = fileList.item(fileList.length - 1);

    try {
      const fileContents = await Upload.readUploadedFileAsText(latestUploadedFile);
      this._formVehicles.actionForm().patchValue({
        foto: fileContents
      });
      this.url = fileContents;
    } catch (erro) {
      this.alertService.openModal(erro, 'Erro', 'danger');
    }
  }

  public submitForm(): void {
    const formDados = this._formVehicles.actionForm().value;

    if (formDados._id) {
        this.vehiclesService.updateVehicles(formDados).subscribe(
          (res) => {
            this._msn = {
              texto: res['msn'],
              type: 'success',
              visible: true
            };
            EventEmitterService.get('updateView').emit();
        }, (erro: Error) => {
          this._msn = {
            texto: erro || erro.message,
            type: 'danger',
            visible: true
          };
        });

        return;
    }

    this.vehiclesService.addNewVehicles(formDados).subscribe(
      (res) => {
        this._msn = {
          texto: res['msn'],
          type: 'success',
          visible: true
        };
        EventEmitterService.get('updateView').emit();
        this.onReset();
      }, (erro: Error) => {
          this._msn = {
            texto: erro || erro.message,
            type: 'danger',
            visible: true
          };
    });
  }

  public get tiposVeiculos(): Array<Object> {
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

  public compareMarca(ob1, ob2): boolean {
    return ob1 && ob2 ? (ob1.id === ob2.id) : ob1 === ob2;
  }

  public compareModelo(ob1, ob2): boolean {
    return ob1 && ob2 ? (ob1.id === ob2.id) : ob1 === ob2;
  }

  public getVehiclesByID(id: string): void {
    this.vehiclesService.getAllVehiclesByID(id).subscribe(
      (res) => {
        this.setValueForms(res);
    }, (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
    });
  }

  private getMarcas(tipo): void {
      this.vehiclesService.getAllMarcasByTipo(tipo).subscribe(
        (marca) => {
          this._marcas = marca;
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

  private onReset(): void {
    this._formVehicles.actionForm().reset();
    this.url = '';
  }

  public get configBtn() {

    if (TypeBtn.ADD === this.typeButton) {
      return {
        type: 'btn btn-lg btn-success',
        icon: 'fa fa-plus-square',
        name: 'Adicionar'
      };
    }

    return {
        type: 'btn btn-link',
        icon: 'fa fa-pencil-square',
        name: 'Editar'
      };
  }

  private setValueForms(vehicles: VeiculosInterface): void {

    this._formVehicles.actionForm().patchValue({
        tiposVeiculos: vehicles.tiposVeiculos,
        placa: vehicles.placa,
        marca: vehicles.marca,
        modelo: vehicles.modelo,
        foto: vehicles.foto,
        combustivel: vehicles.combustivel,
        valor: vehicles.valor,
        _id: this.idVehicles
    });
  }

}

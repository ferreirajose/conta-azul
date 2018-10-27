import { FormBuilder} from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../services/vehicles.service';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { Upload } from '../shared/upload';
import { Form } from '../shared/form';
import { TypeBtn } from '../shared/enum-btn';
import { VeiculosInterface } from '../interface/veiculos.interface';

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
  public submitted: boolean;
  public url: any;

  private _formVehicles: Form;
  private _marcas: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;
  private tipo: string;
  private _msn: Object;
  private _msnVisible: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService
  ) {
    this._formVehicles = new Form(this.formBuilder);
    this.submitted = false;
    this._marcas = [];
    this._msn = {};
    this._msnVisible = false;
  }

  ngOnInit(): void {

    this.sub = this._formVehicles.actionForm().get('tiposVeiculos').valueChanges.subscribe(val => {
        this.tipo = val;
        this.getMarcas(val);
    });

    this.sub = this._formVehicles.actionForm().get('marca').valueChanges.subscribe(val => {
        this.getModelos(this.tipo, val.id);
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

  public get msnVisible(): boolean {
    return this._msnVisible;
  }

  public get message(): Object {
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
        imagem: fileContents
      });
      this.url = fileContents;
    } catch (erro) {
      this.alertService.openModal(erro, 'Erro', 'danger');
    }
  }

  public submitForm(): void {
    const formDados = this._formVehicles.actionForm().value;
    this.submitted = true;
    console.log(formDados);


    // if (this._formVehicles.actionForm().invalid) {
    //   return;
    // }

    if (formDados._id) {
      console.log('eidt');

      this.vehiclesService.updateVehicles(formDados).subscribe(
        (res) => {
          this._msn['texto'] = res['msn'];
          this._msn['alert'] = 'success';
          this._msnVisible = true;

          // this.alertService.openModal('Resgistro atualizado com sucesso', 'Sucesso', 'success');
      }, (erro: Error) => {
        this._msn['texto'] = erro.message;
        this._msn['alert'] = 'danger';
        this._msnVisible = true;
        //this.alertService.openModal(erro.message, 'Erro', 'danger');
      });

      return;
    }

    this.sub = this.vehiclesService.addNewVehicles(formDados).subscribe(
      (res) => {
        this._msn['texto'] = res['msn'];
          this._msn['alert'] = 'success';
          this._msnVisible = true;
        this.onReset();
      }, (erro: Error) => {
          this._msn['texto'] = erro.message;
          this._msn['alert'] = 'danger';
          this._msnVisible = true;
        //this.alertService.openModal(erro.message, 'Erro', 'danger');
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

  private getMarcas(tipo): void {
      this.vehiclesService.getAllMarcasByTipo(tipo).subscribe(
        (marca) => {
          this._marcas = marca;
        },
        (erro: Error) => {
          console.log(erro)
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

  public getVehiclesByID(id: string): void {
    this.vehiclesService.getAllVehiclesByID(id).subscribe(
      (res) => {
        this.setValueForms(res);
    }, (erro: Error) => {
      console.log(erro.message);
    });
  }

  private setValueForms(vehicles: VeiculosInterface): void {

    this._formVehicles.actionForm().patchValue({
        tiposVeiculos: vehicles.tiposVeiculos,
        placa: vehicles.placa,
        marca: vehicles.marca,
        modelo: vehicles.modelo,
        imagem: vehicles.foto,
        combustivel: vehicles.combustivel,
        valor: vehicles.valor,
        _id: this.idVehicles
    });
  }

}

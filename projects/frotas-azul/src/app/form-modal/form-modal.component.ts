import { FormBuilder} from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../services/vehicles.service';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { Upload } from '../shared/upload';
import { Form } from '../shared/form';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;

  private _formVehicles: Form;
  public sub: Subscription;
  public submitted: boolean;
  public url: any;

  private _marcars: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;
  private tipo: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService
  ) {
    this._formVehicles = new Form(this.formBuilder);
    this.submitted = false;
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
    return this._marcars;
  }

  public get modelos(): Array<ModelosInterface> {
    return this._modelos;
  }

  public open(content): void {
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
    } catch (e) {
      console.log(e);
    }
  }

  public submitForm(): void {
    const formDados = this._formVehicles.actionForm().value;
    this.submitted = true;

    if (this._formVehicles.actionForm().invalid) {
      return;
    }

    this.sub = this.vehiclesService.addNewVehicles(formDados).subscribe(
      (res) => {
        this.alertService.openModal('Resgistro salvo com sucesso', 'Sucesso', 'success');
        this.onReset();
      }, (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
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

  private onReset(): void {
    this._formVehicles.actionForm().reset();
  }

}

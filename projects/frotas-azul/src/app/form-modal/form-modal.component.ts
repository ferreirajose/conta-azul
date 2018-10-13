import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoxAlertService } from '@voxtecnologia/alert';

import { VehiclesService } from '../services/vehicles.service';

import { MarcaInterface } from '../interface/marca.interface';
import { ModelosInterface } from '../interface/modelos.interface';
import { Upload } from '../util/upload';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;

  public formVehicles: FormGroup;
  public sub: Subscription;

  private _marcars: Array<MarcaInterface>;
  private _modelos: Array<ModelosInterface>;
  private tipo: string;
  public url: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: VoxAlertService,
    private vehiclesService: VehiclesService
  ) {

  }

  ngOnInit(): void {
    this.createForm();

    this.formVehicles.get('tiposVeiculos').valueChanges.subscribe(val => {
      if (val) {
        this.tipo = val;
        this.getMarcas(val);
      }
    });

    this.formVehicles.get('marca').valueChanges.subscribe(val => {
      if (val) {
        this.getModelos(this.tipo, val.id);
      }
    });

  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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

  async onFileChange(event): Promise<void> {
    if (!event.target || !event.target.files) {
      return;
    }

    const fileList = event.target.files;
    const latestUploadedFile = fileList.item(fileList.length - 1);

    try {
      const fileContents = await Upload.readUploadedFileAsText(latestUploadedFile);
      this.formVehicles.patchValue({
        imagem: fileContents
      });
      this.url = fileContents;
    } catch (e) {
      console.log(e);
    }
  }

  public submitForm(): void {
    const formDados = this.formVehicles.value;
    this.vehiclesService.addNewVehicles(formDados).subscribe(
      (res) => {
        this.alertService.openModal('Resgistro salvo com sucesso', 'Sucesso', 'success');
        this.resetaDadosForm();
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

  private createForm(): void {
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

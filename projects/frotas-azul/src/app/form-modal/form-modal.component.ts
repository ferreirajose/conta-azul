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
        EventEmitterService.get('addNewVehicles').emit();
        this.resetaDadosForm();

      }, (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
      });
  }

  private getMarcas(): void {
    this.sub = this.vehiclesService.getAllMarcas().subscribe(
      (marca) => {
        this._marcars = marca;
      },
      (erro: Error) => {
        this.alertService.openModal(erro.message, 'Erro', 'danger');
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
      });
  }

  private createForm() {
    this.formVehicles = this.formBuilder.group({
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
        marca: '',
        placa: '',
        modelo: '',
        imagem: '',
        combustivel: '',
        valor: ''
    });
  }

}

import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { VeiculosInterface } from '../interface/veiculos.interface';
import { VehiclesService } from '../services/vehicles.service';
import { Upload } from '../shared/upload';
import { Form } from '../shared/form';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  private _formVehicles: Form;
  public sub: Subscription;
  public idVehicles: string;
  public url: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesService: VehiclesService
  ) {
    this._formVehicles = new Form(this.formBuilder);
  }

  ngOnInit(): void {
    this.getParams();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public onVoltar(): void {
    this.voltar();
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
    this.vehiclesService.updateVehicles(formDados).subscribe(
      (res) => {
        console.log(res);
    }, (erro: Error) => {
      console.log(erro.message);
    });
  }

  public getVehiclesByID(id: string): void {
    this.vehiclesService.getAllVehiclesByID(id).subscribe(
      (res) => {
        this.edit(res);
    }, (erro: Error) => {
      console.log(erro.message);
    });
  }

  private voltar(): void {
    this.router.navigate(['']);
  }

  private getParams(): void {
    this.sub = this.route.params.subscribe(params => {
      this.idVehicles = params.id;
      this.getVehiclesByID(params.id);
    });
  }

  private edit(vehicles: VeiculosInterface): void {
    this._formVehicles.actionForm().patchValue({
        tiposVeiculos: vehicles.tiposVeiculos,
        placa: vehicles.placa,
        marca: vehicles.marca,
        modelo: vehicles.modelo,
        imagem: '',
        combustivel: vehicles.combustivel,
        valor: vehicles.valor,
        _id: this.idVehicles
    });
  }

}

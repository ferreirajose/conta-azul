import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VeiculosInterface } from '../interface/veiculos.interface';
import { VehiclesService } from '../services/vehicles.service';
import { Upload } from '../util/upload';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  public formVehicles: FormGroup;
  public sub: Subscription;
  public idVehicles: string;
  public url: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesService: VehiclesService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getParams();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public onVoltar() {
    this.voltar();
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
    this.vehiclesService.updateVehicles(this.formVehicles.value).subscribe(
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

  private createForm() {
    this.formVehicles = this.formBuilder.group({
      tiposVeiculos: [null, Validators.required],
      marca: [null, Validators.required],
      placa: [null, Validators.required],
      modelo: [null, Validators.required],
      imagem: [null],
      combustivel: [null, Validators.required],
      valor: [null, Validators.required],
      _id: [null, Validators.required]
    });
  }

  private edit(vehicles: VeiculosInterface): void {
    this.formVehicles.patchValue({
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

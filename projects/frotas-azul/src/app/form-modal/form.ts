import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

export class FormVehicles {

  public formVehicles: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  private createForm() {
    this.formVehicles = this.formBuilder.group({
      tipoVeiculos: [null, Validators.required],
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
      tipoVeiculos: '',
        marca: '',
        placa: '',
        modelo: '',
        imagem: '',
        combustivel: '',
        valor: ''
    });
  }

}

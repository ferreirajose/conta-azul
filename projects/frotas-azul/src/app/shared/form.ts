import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class Form {

  private _actionForm: FormGroup;
  private builder: FormBuilder;

  constructor(
    formBuilder: FormBuilder
  ) {
    this.builder = formBuilder;
    this.createForm();
  }

  public actionForm(): FormGroup {
    return this._actionForm;
  }

  private createForm() {
    this._actionForm = this.builder.group({
      tiposVeiculos: [null, Validators.required],
      marca: [null, Validators.required],
      placa: [null, Validators.required],
      modelo: [null, Validators.required],
      foto: [null],
      combustivel: [null, Validators.required],
      valor: [null, Validators.required],
      _id: ''
    });
  }

}

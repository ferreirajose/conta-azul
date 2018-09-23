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
            marca: '',
            placa: '',
            modelo: '',
            foto: '',
            combustivel: '',
            valor: ''
        });
    }
}

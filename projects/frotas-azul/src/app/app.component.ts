import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isVisible: boolean;

  constructor() {
    this.isVisible = true;
  }

  ngOnInit() {
  }

  open() {
    return this.isVisible = !this.isVisible;
  }

  // public get formVehicles(): FormVehicles {
  //   return this._formVehicles;
  // }
}

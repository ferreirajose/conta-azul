import { Component, OnInit, OnDestroy } from '@angular/core';

import { VehiclesService } from './vehicles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public sub: Subscription;
  private _isVisible: boolean;
  private _vehicles: Array<any>;

  constructor(private vehiclesService: VehiclesService) {}

  ngOnInit() {
      this.sub = this.vehiclesService.getAllVehicles().subscribe(
      (res) => {
        this._vehicles = res;
      },
      (erro) => {
          console.log(erro);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  public get vehicles(): Array<any> {
    return this._vehicles;
  }

  public get isVisible(): boolean {
    return this._isVisible = true;
  }

}

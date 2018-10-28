import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input() public typeAlert: string;
  @Input() public text: string;
  @Input() public isVisible: boolean;

  constructor() {
    this.isVisible = false;
  }

  public close(): void {
    this.isVisible = false;
  }

}

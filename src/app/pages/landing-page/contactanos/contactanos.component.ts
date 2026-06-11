import { Component } from '@angular/core';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.scss']
})
export class ContactanosComponent {
  collapsedStates = [true, false, true];

  toggleCollapse(index: number): void {
    // Alternar el estado del acordeón
    this.collapsedStates[index] = !this.collapsedStates[index];
  }

}

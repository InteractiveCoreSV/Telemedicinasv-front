import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-text',
  templateUrl: './view-text.component.html',
  styleUrls: ['./view-text.component.scss']
})
export class ViewTextComponent {
  @Input() title:string = '';
  @Input() text:string = '';

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-history-changes-status',
  templateUrl: './view-history-changes-status.component.html',
  styleUrls: ['./view-history-changes-status.component.scss']
})
export class ViewHistoryChangesStatusComponent {
  history: any[] = [];
  status!:string
  typeCancel!:string
  commentCancel!:string
  motivoCancel!:string

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }

}

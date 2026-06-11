import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-answers-survey',
  templateUrl: './view-answers-survey.component.html',
  styleUrls: ['./view-answers-survey.component.scss']
})
export class ViewAnswersSurveyComponent {
  @Input() question: any

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }

}

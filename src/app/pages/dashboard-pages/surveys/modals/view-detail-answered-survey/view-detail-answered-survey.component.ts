import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnswerSurveysI } from 'src/app/interfaces/survey.interface';

@Component({
  selector: 'app-view-detail-answered-survey',
  templateUrl: './view-detail-answered-survey.component.html',
  styleUrls: ['./view-detail-answered-survey.component.scss']
})
export class ViewDetailAnsweredSurveyComponent implements OnInit {

  @Input() survey!:AnswerSurveysI


 constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
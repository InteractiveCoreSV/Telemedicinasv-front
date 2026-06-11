import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileAWSI } from 'src/app/interfaces/files.interface';

@Component({
  selector: 'app-preview-text-survey',
  templateUrl: './preview-text-survey.component.html',
  styleUrls: ['./preview-text-survey.component.scss']
})
export class PreviewTextSurveyComponent {
  @Input() banner!: FileAWSI;

  @Input() title!: string;
  @Input() subtitle!: string;

  @Input() textAgradecimiento!: boolean 

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }
}

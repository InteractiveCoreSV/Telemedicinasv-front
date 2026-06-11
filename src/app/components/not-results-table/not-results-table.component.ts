import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-results-table',
  templateUrl: './not-results-table.component.html',
  styleUrls: ['./not-results-table.component.css']
})
export class NotResultsTableComponent implements OnInit {
  @Input() title:string = '';
  @Input() description:string = 'No hay resultados';


  constructor() { }

  ngOnInit(): void {
  }

}

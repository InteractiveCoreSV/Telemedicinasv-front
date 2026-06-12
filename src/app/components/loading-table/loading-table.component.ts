import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.scss']
})
export class LoadingTableComponent {
  @Input() rows = 6;
  @Input() variant: 'table' | 'spinner' = 'table';
  get rowsArr(): null[] { return Array(this.rows).fill(null); }
}

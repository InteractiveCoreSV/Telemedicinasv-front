import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { customTooltip } from '../tooltipCustom';

interface ChartI {
  type: ChartType,
  datasets: ChartDataSets[],
  labels: Label[],
  options: ChartOptions
}
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styles: [
  ]
})
export class DoughnutChartComponent implements OnInit {
  chartOptions!: ChartI;
  @Input() datasets: ChartDataSets[] = [{
    data: [25, 25, 50],
    backgroundColor: ["#377dff", "rgba(26, 106, 255,.5)"],
    borderWidth: 4,
    hoverBorderColor: "#ffffff"
  }];
  @Input() prefix?: string;
  @Input() labels: string[] = ["label 1", "label 2", "label 3"];
  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      type: 'doughnut',
      labels: this.labels,
      datasets: this.datasets,
      options: {
        legend:{display:false},
        responsive:true,
        maintainAspectRatio:false,
        cutoutPercentage: 80,
        tooltips: {
            enabled: false,
            position: 'average',
            intersect: false,
            callbacks: {
              beforeBody: () => {
                return this.prefix || '';
              }
            },
            custom: customTooltip
          }
        }

      }
  }


  }

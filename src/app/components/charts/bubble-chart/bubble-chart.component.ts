import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
interface ChartI {
  type: ChartType,
  datasets: ChartDataSets[],
  options: ChartOptions
}

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styles: [
  ]
})
export class BubbleChartComponent implements OnInit {
  chartOptions!: ChartI;
  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      type:'bubble',
      datasets:[
        {
          data: [
            {"x": 55, "y": 65, "r": 99}
          ],
          backgroundColor: "rgba(48, 121, 255,0.8)",
          borderColor: "transparent"
        },
        {
          data: [
            {"x": 33, "y": 42, "r": 65}
          ],
          backgroundColor: "rgba(100, 0, 214, 0.8)",
          borderColor: "transparent"
        },
        {
          data: [
            {"x": 46, "y": 26, "r": 38}
          ],
          backgroundColor: "#00B6C7",
          borderColor: "transparent"
        }
      ],
      options:{
        responsive: true,
        maintainAspectRatio: false,
        legend:{display:false},
        scales: {
          yAxes: [{
            gridLines: {
              "display": false
            },
            ticks: {
              "display": false,
              "max": 100,
              "beginAtZero": true
            }
          }],
          xAxes: [{
          gridLines: {
              "display": false
            },
            ticks: {
              "display": false,
              "max": 100,
              "beginAtZero": true
            }
          }]
        },
        tooltips:{
          enabled:false
        }
      }
    }
  }

}

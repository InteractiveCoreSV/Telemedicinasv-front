import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { customTooltip } from '../tooltipCustom';

interface ChartI {
  type: ChartType,
  labels: Label[],
  datasets: ChartDataSets[],
  options: ChartOptions
}

@Component({
  selector: 'app-spark-line',
  templateUrl: './spark-line.component.html',
  styles: [
  ]
})
export class SparkLineComponent implements OnInit {

  chartOptions!: ChartI;
  @Input()labels:string[] = ["1 May", "2 May", "3 May", "4 May", "5 May", "6 May", "7 May", "8 May", "9 May", "10 May", "11 May", "12 May", "13 May", "14 May", "15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May", "22 May", "23 May", "24 May", "25 May", "26 May", "27 May", "28 May", "29 May", "30 May", "31 May"];
  @Input()data:number[] =[21, 20, 24, 20, 18, 17, 15, 17, 18, 30, 31, 30, 30, 35, 25, 35, 35, 40, 60, 90, 90, 90, 85, 70, 75, 70, 30, 30, 30, 50, 72];
  @Input()tooltips:boolean =true;
  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      type: 'line',
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: ["rgba(55, 125, 255, 0)", "rgba(255, 255, 255, 0)"],
          borderColor: "#377dff",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false
        }
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false
          }]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
      }
    };
    if(this.tooltips){
      this.chartOptions.options.tooltips={
        enabled: false,
        mode:'nearest',
        position:'average',
        intersect:false,
        callbacks:{
          beforeBody:()=>{
            return '$'
          }
        },
        custom:customTooltip
      }
    }else{
      this.chartOptions.options.tooltips = {
        enabled:false
      }
    }
  }
}



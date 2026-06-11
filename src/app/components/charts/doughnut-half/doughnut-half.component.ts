import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { customTooltip } from '../tooltipCustom';

interface ChartI {
  type: ChartType,
  datasets: any[],
  labels:any[],
  options: any
}
@Component({
  selector: 'app-doughnut-half',
  templateUrl: './doughnut-half.component.html',
  styles: [
  ]
})
export class DoughnutHalfComponent implements OnInit {
  chartOptions!: ChartI;
  @Input() datasets:any[] = [
    {
      data:[64, 35],
      backgroundColor: ["#377dff", "rgba(26, 106, 255,.5)"],
      borderWidth: 4,
      hoverBorderColor: "#ffffff"
    }
  ];
  @Input()labels:string[] =["Current status", "Goal"]
  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      type: 'doughnut',
      labels: this.labels,
      datasets: this.datasets,

      // cutoutPercentage: 85,
      // rotation: 1 * Math.PI,
      // circumference: 1 * Math.PI,
      // tooltips: {
      //   enabled: false,
      //   position: 'average',
      //   intersect: false,
      //   callbacks: {
      //     beforeBody: () => {
      //       return '%';
      //     },
      //   },
      //   custom: customTooltip,
      // },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right', // Coloca las leyendas a la izquierda
            labels: {
              boxWidth: 20, // Ajusta el tamaño del recuadro de color
              padding: 15,  // Espaciado entre las leyendas
            },
          },
        },
      },
    };
  }

}

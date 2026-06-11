import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';


interface ChartI {
  type: ChartType,
  labels: any[],
  datasets: any[],
  options: ChartOptions
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styles: [
  ]
})
export class BarChartComponent implements OnInit {
  chartOptions!: ChartI;
  @Input()prefix?:string;
  @Input() datasets:any[] =[]
  @Input()labels:any[] =[]
  @Input() stepSizeYTicks:number = 2;
  constructor() { }

  ngOnInit(): void {


    // Calcular la altura máxima de las barras
    const maxBarHeight = Math.max(...this.datasets.map((dataset:any) => Math.max(...dataset.data)));

    // Calcular el porcentaje de la altura máxima para el stepSizeYTicks (ajusta según tus necesidades)
    const percentage = 10; // Puedes ajustar este valor según tus preferencias

    // Calcular el stepSizeYTicks automáticamente basado en el porcentaje
    this.stepSizeYTicks = Math.ceil((maxBarHeight / 100) * percentage);

    this.chartOptions = {
      type: 'bar',
      labels: this.labels,
      datasets: this.datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            grid: {
              color: "#e7eaf3",
              drawBorder: false,
            },
            ticks: {
              stepSize: this.stepSizeYTicks,
              padding: 10,
              callback:(v:any,i:any,vs:any)=>{
                return `${this.prefix?this.prefix:''}${v}`
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },

            ticks: {
              padding: 5
            },

          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#000',  // Color de texto de la leyenda
              font: {
                size: 14,
                family: 'Arial'
              }
            }
          },
           tooltip: {
            enabled: true, // Asegúrate de que los tooltips están habilitados
            callbacks: {
              label: (context: any) => {
                const value = context.raw; // Obtiene el valor del punto
                // Aquí agregamos el signo '%' al valor mostrado en el tooltip
                return `${value}`; // Usa `${value}%` si prefieres solo el símbolo '%' 
              }
            }
          }
        },
        hover:{
          mode:'nearest',
          intersect:true
        }
      }
    }
  }

}

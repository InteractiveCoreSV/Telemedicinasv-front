import { Component, OnInit, Input, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';


interface ChartI {
  type: ChartType,
  labels: any[],
  datasets: any[],
  options: ChartOptions
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styles: [
  ]
})
export class LineChartComponent implements OnInit {
  chartOptions!: ChartI;
  @Input()prefixTicks:string = '';
  @Input()sufixTicks:string = '';

  @Input()datasets:any[] = [{
    backgroundColor: ["rgba(55, 125, 255, .4)"],
    data:[18, 51, 60, 38, 88, 50, 40, 52, 88, 80, 60, 70],
    borderColor: "#377dff",
    borderWidth: 2,
    pointRadius: 0,
    hoverBorderColor: "#377dff",
    pointBackgroundColor: "#377dff",
    pointBorderColor: "#fff",
    pointHoverRadius: 0
  },
  {
    backgroundColor: ["rgba(0, 201, 219, .7)"],
    data:[27, 38, 60, 77, 40, 50, 49, 29, 42, 27, 42, 50],
    borderColor: "#00c9db",
    borderWidth: 2,
    pointRadius: 0,
    hoverBorderColor: "#00c9db",
    pointBackgroundColor: "#00c9db",
    pointBorderColor: "#fff",
    pointHoverRadius: 0
  }
  ];
  @Input()labels:any[] =["Feb", "Jan", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  @Input()stepSizeYTicks:number =20;
  @Input()prefix?:string;
  constructor() { }

  ngOnInit(): void {
    // / Calcular la altura máxima de las barras
    const maxBarHeight = Math.max(...this.datasets.map((dataset:any) => Math.max(...dataset.data)));

    // Calcular el porcentaje de la altura máxima para el stepSizeYTicks (ajusta según tus necesidades)
    const percentage = 10; // Puedes ajustar este valor según tus preferencias

    // Calcular el stepSizeYTicks automáticamente basado en el porcentaje
    this.stepSizeYTicks = Math.ceil((maxBarHeight / 100) * percentage);

    this.chartOptions = {
      type: 'line',
      labels: this.labels,
      datasets: this.datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
              drawBorder: false,
            },
            ticks: {
              stepSize: this.stepSizeYTicks,
              padding: 10,
              callback: (t: any) => {
                // Agregar '%' a los valores en el eje Y
                return `${this.sufixTicks}${t}${this.prefixTicks}`; // `${t}%` si prefieres solo el signo '%' 
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
            }
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
                let otherValue;
                if(context.dataset?.otherData){
                  otherValue = context.dataset?.otherData[context.dataIndex]
                }
                // Aquí agregamos el signo '%' al valor mostrado en el tooltip
                return `${this.sufixTicks}${value}${this.prefixTicks} ${otherValue ? ` | ${otherValue} Pacientes` : ''}`; // Usa `${value}%` si prefieres solo el símbolo '%' 
              }
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    };
    
  }
}

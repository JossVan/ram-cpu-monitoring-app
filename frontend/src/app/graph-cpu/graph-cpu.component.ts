import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-graph-cpu',
  templateUrl: './graph-cpu.component.html',
  styleUrls: ['./graph-cpu.component.css']
})
export class GraphCPUComponent implements OnInit {

  constructor(public servicio:WebsocketService) { }
  /**
    * Interval to update the chart
    * @var {any} intervalUpdate
    */
    private intervalUpdate: any = null;

    /**
    * The ChartJS Object
    * @var {any} chart
    */
    public chart: any = null;

    /**
    * On component initialization
    * @function ngOnInit
    * @return {void}
    */
   total = ""
     ngOnInit(): void {
      this.chart = new Chart('realtime', {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
            label: '%CPU',
            fill: false,
            data: [],
            backgroundColor: '#168ede',
            borderColor: '#168ede'
            }
          ]
          },
          options: {
          tooltips: {
            enabled: false
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              fontColor: 'black'
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: "black"
              }
            }],
            xAxes: [{
            ticks: {
              fontColor: "black",
              beginAtZero: true
            }
            }]
          }
          }
      });

      this.showData();

     this.intervalUpdate = setInterval(function(this:GraphCPUComponent){
        this.showData();
      }.bind(this), 1000);
    }

    /**
    * On component destroy
    * @function ngOnDestroy
    * @return {void}
    */
     ngOnDestroy(): void {
      clearInterval(this.intervalUpdate);
    }

    /**
    * Print the data to the chart
    * @function showData
    * @return {void}
    */
     showData(): void {
      this.getFromAPI().subscribe(response => {

        if(response.error === false || response.error == undefined) {
          let chartTime: any = new Date();
          chartTime = chartTime.getHours() + ':' + ((chartTime.getMinutes() < 10) ? '0' + chartTime.getMinutes() : chartTime.getMinutes()) + ':' + ((chartTime.getSeconds() < 10) ? '0' + chartTime.getSeconds() : chartTime.getSeconds());
          if(this.chart.data.labels.length > 15) {
              this.chart.data.labels.shift();
              this.chart.data.datasets[0].data.shift();
          }
          this.chart.data.labels.push(chartTime);
          this.total = String((100-response.total).toFixed(2))
          this.chart.data.datasets[0].data.push(100-response.total);
          this.chart.update();
        } else {
          console.error("ERROR: The response had an error, retrying");
        }
      })
    }

    /**
    * Get the data from the API
    * @function getFromAPI
    * @return {Observable<any>}
    */
    private getFromAPI(){
      return this.servicio.cpu()
    }

}

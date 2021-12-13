import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as jQuery from 'jquery';
@Component({
  selector: 'app-listaprocesos',
  templateUrl: './listaprocesos.component.html',
  styleUrls: ['./listaprocesos.component.css']
})
export class ListaprocesosComponent implements OnInit {

  constructor(private servicio:WebsocketService) { }
  running:Number = 0
  sleeping:Number = 0
  stopped:Number = 0
  zombie:Number = 0
  unrunnable:Number =0
  total : Number = 0
  info : any[] = [];
  ngOnInit(): void {
    interval(1000)
    .pipe(takeWhile(() => true))
    .subscribe(() => {
    this.actualizar()
    let htmlinfo = "<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 yellow-bg\">"+
            "<div class=\"row\">"+
                "<div class=\"col-4 text-center\">"+
                   "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
                "</div>"+
                "<div class=\"col-8 text-right\">"+
                    "<span> Task running </span>"+
                    "<h2 class=\"font-bold\">"+this.running+"</h2>"+
                "</div>"+
            "</div>"+
    "</div>"+
"</div>"+
"<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 navy-bg\">"+
        "<div class=\"row\">"+
            "<div class=\"col-4\">"+
                "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
            "</div>"+
            "<div class=\"col-8 text-right\">"+
                "<span> Task sleeping  </span>"+
                "<h2 class=\"font-bold\">"+this.sleeping+"</h2>"+
            "</div>"+
        "</div>"+
    "</div>"+
"</div>"+
"<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 lazur-bg\">"+
        "<div class=\"row\">"+
            "<div class=\"col-4\">"+
                "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
            "</div>"+
            "<div class=\"col-8 text-right\">"+
                "<span> Task stopped  </span>"+
                "<h2 class=\"font-bold\">"+this.stopped+"</h2>"+
            "</div>"+
        "</div>"+
    "</div>"+
"</div>"+
"<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 yellow-bg\">"+
        "<div class=\"row\">"+
            "<div class=\"col-4\">"+
                "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
            "</div>"+
            "<div class=\"col-8 text-right\">"+
                "<span> Task zombie  </span>"+
                "<h2 class=\"font-bold\">"+this.zombie+"</h2>"+
            "</div>"+
        "</div>"+
    "</div>"+
"</div>"+
"<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 navy-bg\">"+
        "<div class=\"row\">"+
            "<div class=\"col-4\">"+
                "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
            "</div>"+
            "<div class=\"col-8 text-right\">"+
                "<span> Task interruptible </span>"+
                "<h2 class=\"font-bold\">"+this.unrunnable+"</h2>"+
            "</div>"+
        "</div>"+
    "</div>"+
"</div>"+
"<div class=\"col-lg-3\">"+
    "<div class=\"widget style1 lazur-bg\">"+
        "<div class=\"row\">"+
            "<div class=\"col-4\">"+
                "<i class=\"fa fa-envelope-o fa-5x\"></i>"+
            "</div>"+
            "<div class=\"col-8 text-right\">"+
                "<span> Total </span>"+
                "<h2 class=\"font-bold\">"+this.total+"</h2>"+
            "</div>"+
        "</div>"+
    "</div>"+
"</div>"
let codigo = "<table class=\"table table-striped\">"+
    "<thead>"+
    "<tr>"+

        "<th>PID</th>"+
        "<th>Nombre</th>"+
        "<th>Usuario</th>"+
        "<th> RAM utilizada</th>"+
        "<th>Estado</th>"+

    "</tr>"+
    "</thead>"+
    "<tbody>"

    this.info.forEach(item=>{
      codigo+="<tr>"
      codigo +="<td>"
      codigo += item.pid
      codigo +="</td>"
      codigo +="<td>"
      codigo += item.nombre
      codigo +="</td>"
      codigo +="<td>"
      codigo += "sopes1"
      codigo +="</td>"
      codigo +="<td>"
      codigo += item.ram+"%"
      codigo +="</td>"
      codigo += "<td>"+item.estado+"</td></tr>"
      codigo += "<td >"+
      "<button class=\"btn btn-outline btn-danger  dim \" type=\"button\"><i class=\"fa fa-warning\"></i></button>"
  "</td>"
    })

    codigo+="</tbody>"+
    "<tfoot>"+
    "<tr>"+
        "<td colspan=\"6\">"+
            "<ul class=\"pagination float-right\"></ul>"+
        "</td>"+
    "</tr>"+
    "</tfoot>"+
    "</table>"
    jQuery('#info').html(htmlinfo);
    jQuery("#tabla").html(codigo);
    this.info = []
})
  }

  actualizar(){
    this.servicio.getProcesos().subscribe(resultado=>{
      //console.log(resultado.procesos)
      let running = 0
      let sleeping = 0
      let stopped = 0
      let zombie = 0
      let unrunnable = 0
      let total = 0
      total = resultado.total_procesos;
      resultado.procesos.forEach((element:any) => {
        //#define TASK_INTERRUPTIBLE 1
        if (element.estado == 1){
          unrunnable = unrunnable+1
        }
        //#define TASK_RUNNING 0
        else if (element.estado == 0){
          running = running + 1
        }else if (element.estado ==1026){
          sleeping = sleeping+1
        }
        //#define TASK_ZOMBIE 4
        else if (element.estado == 4){
          zombie = zombie+1
        }
        //#define TASK_STOPPED 8
        else if (element.estado>0 && element.estado != 1026){
          stopped = stopped +1
        }

        let hh: { nombre: any; pid: any; }[] =[]
        element.hijos.forEach((hijitos) => {
          let hijos = {
            nombre:hijitos.nombre,
            pid:hijitos.pid
          }
          hh.push(hijos)
        });
        let rram = "-"
        if (element.ram!=undefined){
        let rram1 = Number(element.ram)/1000000
        rram1 = Number((rram1*100/2985.52).toFixed(3))
        rram = String(rram1)
        }

        let item  ={
          nombre : element.nombre,
          pid : element.pid,
          ram : rram,
          estado: element.estado,
          hijos : hh
        }
        this.info.push(item)
        this.unrunnable = unrunnable
        this.running = running
        this.stopped = stopped
        this.zombie = zombie
        this.sleeping = sleeping
        this.total = total
      });
    })
}
}

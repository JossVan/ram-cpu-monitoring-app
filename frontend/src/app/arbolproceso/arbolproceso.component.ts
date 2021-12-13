import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { interval } from 'rxjs';
import { flatMap, takeWhile } from 'rxjs/operators';
import * as jQuery from 'jquery';
declare var $: any;
@Component({
  selector: 'app-arbolproceso',
  templateUrl: './arbolproceso.component.html',
  styleUrls: ['./arbolproceso.component.css']
})
export class ArbolprocesoComponent implements OnInit {

  constructor(private servicio: WebsocketService) { }

  info : any[] = [];

  ngOnInit(): void {
    let html =""
    this.actualizar()
    interval(1000)
    .pipe(takeWhile(() => true))
    .subscribe(() => {
    html = "<table class=\"footable table table-stripped toggle-arrow-tiny\" data-page-size=\"15\">"+
    "<thead>"+
    "<tr>"+

        "<th data-toggle=\"true\">PID</th>"+
        "<th data-hide=\"phone\">Nombre</th>"+
        "<th data-hide=\"all\">Hijos</th>"+
        "<th data-hide=\"phone\">RAM</th>"+
        "<th data-hide=\"phone\">No.Hijos</th>"+
        "<th class=\"text-right\" data-sort-ignore=\"true\">Estado</th>"+

    "</tr>"+
    "</thead>"+
    "<tbody>"
    this.info.forEach(item=>{
      html+="<tr>\n"
      html+="<td>"+item.pid+"</td>\n"
      html+="<td>"+item.nombre+"</td>\n"
      html+="<td>\n"
      html+="<table class=\"table\">"+
      "<thead>"+
      "<tr>"+
          "<th>PID</th>"+
          "<th>Nombre</th>"+
      "</tr>"+
      "</thead>"+
      "<tbody>"
      item.hijos.forEach(hijo => {
        html+="<tr><td>"
        html+=hijo.pid+"</td>"
        html+="<td>"+hijo.nombre+"</td></tr>"
      });
      html+="</tbody>"+
      "</table>"+
      "</td><td><span class=\"label label-primary\">"+ item.ram+"%</span></td>"+
      "<td>"+item.num+"</td>"+"<td class=\"text-right\">"+item.estado+"</td></tr>"
    })
    html+="</tbody>"+
    "<tfoot>"+
    "<tr>"+
        "<td colspan=\"6\">"+
            "<ul class=\"pagination float-right\"></ul>"+
        "</td>"+
    "</tr>"+
    "</tfoot></table>"

    jQuery("#tabla").html(html);

    this.info = []
    this.actualizar()

    });
  }


  actualizar(){
      this.servicio.getProcesos().subscribe(resultado=>{
        //console.log(resultado.procesos)
        resultado.procesos.forEach((element:any) => {
          let hh: { nombre: any; pid: any; }[] =[]
          let num =0;
          element.hijos.forEach((hijitos) => {
            num = num+1;
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
            hijos : hh,
            num : num
          }
          this.info.push(item)
        });
      })
  }


}

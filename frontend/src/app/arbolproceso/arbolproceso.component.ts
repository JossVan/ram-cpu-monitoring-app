import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-arbolproceso',
  templateUrl: './arbolproceso.component.html',
  styleUrls: ['./arbolproceso.component.css']
})
export class ArbolprocesoComponent implements OnInit {

  constructor(private servicio: WebsocketService) { }
  info : any[] = [];
  ngOnInit(): void {
    interval(1000)
    .pipe(takeWhile(() => true))
    .subscribe(() => {
    this.actualizar()
    let codigo = "<table class=\"footable table table-stripped toggle-arrow-tiny\" data-page-size=\"15\">"+
    "<thead>"+
    "<tr>"+

        "<th data-toggle=\"true\">PID</th>"+
        "<th data-hide=<\"phone\">Nombre del proceso</th>"+
        "<th data-hide=\"all\">Procesos hijos</th>"+
        "<th data-hide=\"phone\">Usuario</th>"+
        "<th data-hide=\"phone\" > RAM utilizada</th>"+
        "<th data-hide=\"phone\">Estado</th>"+

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
      codigo += "<table class=\"table\"><thead><tr><td>PID</td><td>Nombre</td></tr></thead><tbody>"
      item.hijos.forEach(hijo => {
        codigo+="<tr>"
        codigo+="<td>"
        codigo+=hijo.pid
        codigo+="</td>"
        codigo+="<td>"
        codigo+=hijo.nombre
        codigo+="</td>"
        codigo+="</tr>"
      });
      codigo+="</tbody></table>"
      codigo +="<td>"
      codigo += "user"
      codigo +="</td>"
      codigo +="<td>"
      codigo += item.ram
      codigo +="</td>"
      codigo += "<td>"+item.estado+"</td></tr>"

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
    jQuery('#tabla').html(codigo);
    this.info = []
    })
  }


  actualizar(){
      this.servicio.getProcesos().subscribe(resultado=>{
        //console.log(resultado.procesos)
        resultado.procesos.forEach((element:any) => {
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
        });
      })
  }
}

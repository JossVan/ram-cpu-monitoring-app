import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
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

    this.actualizar()
    let codigo = "<div class=\"jstree1\">"
    codigo += "<ul><li class=\"jstree-open\">Procesos<ul>"

    this.info.forEach(item=>{
      codigo+="<li>"
      codigo+= item.pid+" - "+item.nombre
      codigo+="<ul>"
      item.hijos.forEach(hijo => {
        codigo+="<li data-jstree='\"type\":\"css\"}'>"+hijo.pid+" - "+hijo.nombre +"</li>"
      });
      codigo+="</ul>"
      codigo+="</li>"
    })
    codigo+="</ul></li></ul>"
    codigo+="</div>"
    jQuery('#tree').html(codigo);
    //this.info = []

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

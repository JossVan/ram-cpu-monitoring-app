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

    let tabla = document.createElement("table")
    tabla.setAttribute("class","footable table table-stripped toggle-arrow-tiny")
    tabla.setAttribute("data-page-size","15")
    let thead = document.createElement("thead")
    let encabezado = document.createElement("tr")
    let celdapid = document.createElement("th")
    let celdanombre = document.createElement("th")
    let celdahijos = document.createElement("th")
    let celdaram = document.createElement("th")
    let celdanumero = document.createElement("th")
    let celdaestado = document.createElement("th")
    celdapid.appendChild(document.createTextNode("PID"))
    celdanombre.appendChild(document.createTextNode("Nombre"))
    celdahijos.appendChild(document.createTextNode("Hijos"))
    celdaram.appendChild(document.createTextNode("RAM"))
    celdaestado.setAttribute("class","text-right")
    celdaestado.setAttribute("data-sort-ignore","true")
    celdaestado.appendChild(document.createTextNode("Estado"))
    celdanumero.appendChild(document.createTextNode("No.Hijos"))
    encabezado.appendChild(celdapid)
    encabezado.appendChild(celdanombre)
    encabezado.appendChild(celdahijos)
    encabezado.appendChild(celdaram)
    encabezado.appendChild(celdanumero)
    encabezado.appendChild(celdaestado)
    thead.appendChild(encabezado)
    tabla.appendChild(thead)
    let tbody = document.createElement("tbody")

    this.info.forEach(item=>{
      let fila = document.createElement("tr")
      let itempid = document.createElement("td")
      let itemnombre = document.createElement("td")
      itempid.appendChild(document.createTextNode(item.pid))
      itemnombre.appendChild(document.createTextNode(item.nombre))
      let itemHijos = document.createElement("td")
      let tablahijo = document.createElement("table")
      tablahijo.setAttribute("class","table")
      let theadhijo = document.createElement("thead")
      let encabezadohijo = document.createElement("tr")
      let celdapid = document.createElement("th")
      let celdanombre = document.createElement("th")
      celdapid.appendChild(document.createTextNode("PID"))
      celdanombre.appendChild(document.createTextNode("Nombre"))
      encabezadohijo.appendChild(celdapid)
      encabezadohijo.appendChild(celdanombre)
      theadhijo.appendChild(encabezadohijo)
      tablahijo.appendChild(theadhijo)
      let tbodyhijo = document.createElement("tbody")
      item.hijos.forEach(hijo => {
        let filahijo = document.createElement("tr")
        let celdapid = document.createElement("td")
        celdapid.appendChild(document.createTextNode(hijo.pid))
        let celdanombre = document.createElement("td")
        celdanombre.appendChild(document.createTextNode(hijo.nombre))
        filahijo.appendChild(celdapid)
        filahijo.appendChild(celdanombre)
        tbodyhijo.appendChild(filahijo)
      });
      tablahijo.appendChild(tbodyhijo)
      itemHijos.appendChild(tablahijo)
      let celdaram = document.createElement("td")
      let span = document.createElement("span")
      span.setAttribute("class","label label-primary")
      span.appendChild(document.createTextNode(item.ram))
      celdaram.appendChild(span)
      let celdanum = document.createElement("td")
      celdanum.appendChild(document.createTextNode(item.num))
      let celdaestado = document.createElement("td")
      celdaestado.setAttribute("class","text-right")
      celdaestado.appendChild(document.createTextNode(item.estado))
      fila.appendChild(itempid)
      fila.appendChild(itemnombre)
      fila.appendChild(itemHijos)
      fila.appendChild(celdaram)
      fila.appendChild(celdanum)
      fila.appendChild(celdaestado)
      tbody.appendChild(fila)
    })
    tabla.appendChild(tbody)
    document.getElementById("tabla").innerHTML=""
    document.getElementById("tabla").appendChild(tabla)
   // jQuery("#tabla").html(html);

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

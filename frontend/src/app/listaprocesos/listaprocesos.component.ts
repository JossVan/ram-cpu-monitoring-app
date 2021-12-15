import { ToastrService } from 'ngx-toastr';
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

  constructor(private servicio:WebsocketService, private toastr: ToastrService) { }
  running:Number = 0
  sleeping:Number = 0
  stopped:Number = 0
  zombie:Number = 0
  unrunnable:Number =0
  total : Number = 0
  info : any[] = [];
  usuarios :any[]=[];
  pid = "";
  ngOnInit(): void {

    this.llenar()
    console.log(this.usuarios)
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
document.getElementById("tabla").innerHTML=""
let tabla = document.createElement("table")
tabla.setAttribute("class","table table-striped")
tabla.setAttribute("id","tablita")
let thead = document.createElement("thead")
let tr = document.createElement("tr")
let th1 = document.createElement("th")
let th2 = document.createElement("th")
let th3 = document.createElement("th")
let th4 = document.createElement("th")
let th5 = document.createElement("th")
let th6 = document.createElement("th")
let pidtext = document.createTextNode("PID")
let nombretext = document.createTextNode("Nombre")
let usertext= document.createTextNode("Usuario")
let ramtext = document.createTextNode("RAM utilizada")
let estadotxt= document.createTextNode("Estado")
let kill= document.createTextNode("Kill")
th1.appendChild(pidtext)
th2.appendChild(nombretext)
th3.appendChild(usertext)
th4.appendChild(ramtext)
th5.appendChild(estadotxt)
th6.appendChild(kill)
tr.appendChild(th1)
tr.appendChild(th2)
tr.appendChild(th3)
tr.appendChild(th4)
tr.appendChild(th5)
tr.appendChild(th6)
thead.appendChild(tr)
tabla.appendChild(thead)
let tbody = document.createElement("tbody")
    this.info.forEach(item=>{
      let fila = document.createElement("tr")
      let colpid = document.createElement("td")
      let colnombre = document.createElement("td")
      let coluser = document.createElement("td")
      let colram = document.createElement("td")
      let colestado = document.createElement("td")
      let colkill = document.createElement("td")
      let pidt= document.createTextNode(item.pid)
      let nombret = document.createTextNode(item.nombre)
      let usert= document.createTextNode(item.user)
      let ramt= document.createTextNode(item.ram+"%")
      let estadot = document.createTextNode(item.estado)
      let boton = document.createElement("button")

      boton.setAttribute("class","btn btn-outline btn-danger  dim ")
      boton.setAttribute("type","button")
      boton.setAttribute("onclick","terminar("+item.pid+");")
      let li = document.createElement("li")
      li.setAttribute("class","fa fa-warning")
      boton.appendChild(li)
      colpid.appendChild(pidt)
      colnombre.appendChild(nombret)
      coluser.appendChild(usert)
      colram.appendChild(ramt)
      colestado.appendChild(estadot)
      colkill.appendChild(boton)
      fila.appendChild(colpid)
      fila.appendChild(colnombre)
      fila.appendChild(coluser)
      fila.appendChild(colram)
      fila.appendChild(colestado)
      fila.appendChild(boton)
      tbody.appendChild(fila)
    })
    tabla.appendChild(tbody)
    let tfoot = document.createElement("tfoot")
    let ftr = document.createElement("tr")
    let ftd = document.createElement("td")
    ftd.setAttribute("colspan","6")
    let ful = document.createElement("ul")
    ful.setAttribute("class","pagination float-right")
    ftd.appendChild(ful)
    ftr.appendChild(ftd)
    tfoot.appendChild(ftr)
    tabla.appendChild(tfoot)

    jQuery('#info').html(htmlinfo);
    document.getElementById("tabla").appendChild(tabla)
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
        let rram = "0"
        if (element.ram!=undefined){
        let rram1 = Number(element.ram)/1000000
        rram1 = Number((rram1*100/2985.52).toFixed(3))
        rram = String(rram1)
        }
        let usuario
        for(let i =0; i<this.usuarios.length;i++){
          if (this.usuarios[i].uid == element.user){
            usuario = this.usuarios[i].nombre
            break
          }
        }
        if (usuario == ""){
          usuario = this.getuser(element.user)
        }


        let item  ={
          nombre : element.nombre,
          pid : element.pid,
          ram : rram,
          estado: element.estado,
          hijos : hh,
          user : usuario
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

 async llenar(){
    this.servicio.getProcesos().subscribe(resultado=>{
      resultado.procesos.forEach(async element => {
        for(let i=0;i<this.usuarios.length;i++){
          if(element.user == this.usuarios[i].uid){
            return this.usuarios[i].nombre
          }
        }
        let valor = await this.getuser(element.user)
        const datos ={
          uid:element.user,
          nombre:valor
        }
         this.usuarios.push(datos)
      });
    })
  }

 async getuser(user:string){
  let val =await this.servicio.usuario(user)
  return val
}


}
async function  kill(pid){

  let val = await this.servicio.terminar(pid)
  if (val == true){
    this.toastr.success("El proceso "+pid+" se ha terminado","Success")
  }else{
   this.toastr.success("El proceso "+pid+" no existe","Failed")
  }
 }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class WebsocketService {

  constructor(private http:HttpClient) { }

  url = "http://192.168.0.16:8080/"
  cabecera = new HttpHeaders();
  getInfoRam():Observable<any>{
    return this.http.get(this.url+"RAM");
  }
  getProcesos():Observable<any>{
    return this.http.get(this.url+"procesos");
  }

  kill(pid:string):Observable<any>{
    this.cabecera.set('Content-Type','application/json')
    let datos = {
      "pid" : pid
    }

    return this.http.post(this.url+"kill",datos,{headers:this.cabecera})
  }
  cpu():Observable<any>{
    return this.http.get(this.url+"cpu")
  }

  async terminar(pid:string){
    let datos ={
      pid : pid
    }
    const respuestaRaw = await fetch("http://192.168.0.16:8080/kill", {
        body: JSON.stringify(datos), // <-- Aquí van los datos
        headers: {
          "Content-Type": "application/json", // <-- Importante el encabezado
        },
          method: "POST",
    })
    const resp = respuestaRaw.ok
    return resp
  }
}

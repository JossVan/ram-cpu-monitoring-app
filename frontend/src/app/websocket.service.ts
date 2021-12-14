import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class WebsocketService {

  constructor(private http:HttpClient) { }

  url = "http://192.168.0.16:8080/"

  getInfoRam():Observable<any>{
    return this.http.get(this.url+"RAM");
  }
  getProcesos():Observable<any>{
    return this.http.get(this.url+"procesos");
  }

  kill(pid:number):Observable<any>{
    return this.http.post(this.url+"kill",{
      pid : pid
    })
  }
}

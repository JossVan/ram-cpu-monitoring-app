import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class WebsocketService {
  
  constructor(private http:HttpClient) { }
  
  url = "http://localhost:8080/"

  getInfoRam():Observable<any>{
    return this.http.get(this.url+"RAM");
  }
}
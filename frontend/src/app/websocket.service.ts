import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx'
@Injectable()
export class WebsocketService {
  private subject:Rx.Subject<MessageEvent>;
  
  constructor() { }
 

}
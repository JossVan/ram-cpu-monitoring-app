import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { PrincipalComponent } from './principal/principal.component';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from './websocket.service';
import { ArbolprocesoComponent } from './arbolproceso/arbolproceso.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ListaprocesosComponent } from './listaprocesos/listaprocesos.component';
import { GraphRAMComponent } from './graph-ram/graph-ram.component';
import { GraphCPUComponent } from './graph-cpu/graph-cpu.component';
import { ChartModule } from 'angular2-chartjs';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MenuComponent,
    PrincipalComponent,
    ArbolprocesoComponent,
    ProcesosComponent,
    ListaprocesosComponent,
    GraphRAMComponent,
    GraphCPUComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ChartModule

  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

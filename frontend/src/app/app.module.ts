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

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MenuComponent,
    PrincipalComponent,
    ArbolprocesoComponent,
    ProcesosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

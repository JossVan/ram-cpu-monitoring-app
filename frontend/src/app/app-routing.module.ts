import { PrincipalComponent } from './principal/principal.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArbolprocesoComponent} from './arbolproceso/arbolproceso.component';

const routes: Routes = [
  {
    path:'principal',
    component: PrincipalComponent
  },
  {
    path:'arbolprocesos',
    component : ArbolprocesoComponent
  },
  {
    path: '',
    redirectTo: '/principal',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

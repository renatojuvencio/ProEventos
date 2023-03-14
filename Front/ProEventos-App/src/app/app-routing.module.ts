import { RegistrationComponent } from './componentes/user/registration/registration.component';
import { LoginComponent } from './componentes/user/login/login.component';
import { UserComponent } from './componentes/user/user.component';
import { EventosListagemComponent } from './componentes/eventos/eventos-listagem/eventos-listagem.component';
import { EventosDetalheComponent } from './componentes/eventos/eventos-detalhe/eventos-detalhe.component';
import { EventosComponent } from './componentes/eventos/eventos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ContatosComponent } from './componentes/contatos/contatos.component';
import { PalestrantesComponent } from './componentes/palestrantes/palestrantes.component';
import { PerfilComponent } from './componentes/user/perfil/perfil.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent }
      ]
  },
  {path : 'eventos', redirectTo: 'eventos/lista'},
  {path: 'eventos', component: EventosComponent,
  children: [
    { path: 'detalhe/:id', component: EventosDetalheComponent},
    { path: 'detalhe', component: EventosDetalheComponent},
    { path: 'lista', component: EventosListagemComponent}
  ]
},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contatos', component: ContatosComponent},
  {path: 'palestrantes', component: PalestrantesComponent},
  {path: 'user/perfil', component: PerfilComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

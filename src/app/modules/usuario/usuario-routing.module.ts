import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {errorInterceptor, requestInterceptor} from "../../core/interceptor/http.interceptor";
import {UsuarioComponent} from "./usuario.component";
import {UsuarioService} from "./services/usuario.service";
import {ListaDeUsuarioComponent} from "./components/lista-de-usuario/lista-de-usuario.component";

const routes: Routes = [
  {
    path: '',
    component: UsuarioComponent,
    children: [
      {path: '', redirectTo: 'lista', pathMatch: 'full'},
      {path: 'lista', component: ListaDeUsuarioComponent},
      {
        path: '**',
        loadChildren: () => import('../error/error.module').then((m) => m.ErrorModule),
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [
    UsuarioService,
    provideHttpClient(
      withInterceptors([
        requestInterceptor,
        errorInterceptor
      ]),
    ),
  ],
})
export class UsuarioRoutingModule {
}

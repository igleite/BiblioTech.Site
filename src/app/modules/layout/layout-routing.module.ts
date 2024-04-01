import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LivroComponent} from "../livro/livro.component";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {errorInterceptor, requestInterceptor} from "../../core/interceptor/http.interceptor";
import {UsuarioComponent} from "../usuario/usuario.component";


const routes: Routes = [
  {
    path: 'livro',
    component: LivroComponent,
    loadChildren: () => import('../livro/livro.module').then((m) => m.LivroModule),

  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    loadChildren: () => import('../usuario/usuario.module').then((m) => m.UsuarioModule),

  },
  {path: '', redirectTo: 'livro', pathMatch: 'full'},
  {
    path: '**',
    loadChildren: () => import('../error/error.module').then((m) => m.ErrorModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    provideHttpClient(
      withInterceptors([
        requestInterceptor,
        errorInterceptor
      ]),
    ),
  ],
})
export class LayoutRoutingModule {
}

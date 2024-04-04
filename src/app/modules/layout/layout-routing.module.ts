import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {errorInterceptor, requestInterceptor} from "../../core/interceptor/http.interceptor";
import {LayoutComponent} from "./layout.component";


const routes: Routes = [
  {
    path: 'livro',
    component: LayoutComponent,
    loadChildren: () => import('../livro/livro.module').then((m) => m.LivroModule),

  },
  {
    path: 'usuario',
    component: LayoutComponent,
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

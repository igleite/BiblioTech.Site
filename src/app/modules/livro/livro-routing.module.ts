import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {LivroService} from "./services/livro.service";
import {LivroComponent} from "./livro.component";
import {ListaDeLivroComponent} from "./components/lista-de-livro/lista-de-livro.component";
import {errorInterceptor, requestInterceptor} from "../../core/interceptor/http.interceptor";

const routes: Routes = [
  {
    path: '',
    component: LivroComponent,
    children: [
      {path: '', redirectTo: 'lista', pathMatch: 'full'},
      {path: 'lista', component: ListaDeLivroComponent},
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
    LivroService,
    provideHttpClient(
      withInterceptors([
        requestInterceptor,
        errorInterceptor
      ]),
    ),
  ],
})
export class LivroRoutingModule {
}

import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {LayoutRoutingModule} from "./layout-routing.module";
import {errorInterceptor, requestInterceptor} from "../../core/interceptor/http.interceptor";

@NgModule({
  imports: [LayoutRoutingModule, HttpClientModule],
  providers: [
    provideHttpClient(
      withInterceptors([
        requestInterceptor,
        errorInterceptor
      ]),
    ),
  ],
})
export class LayoutModule {
}

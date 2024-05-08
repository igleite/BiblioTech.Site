import { Injectable } from '@angular/core';
import {BaseServiceHelper} from "../../../core/utils/base-service-helper.service";
import {Observable} from "rxjs";
import {ICadastrarEmprestimo} from "../interfaces/IEmprestimo";

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService extends BaseServiceHelper {

  obterEmprestimo(id?: string): Observable<any> {

    let url: string = 'loans';
    if (id) {
      url = `${url}/${id}`
    }

    return this.get<any>(`${this.baseUrl}${url}`)
      .pipe((response: any) => {
        return response;
      });
  }

  criarEmprestimo(item: ICadastrarEmprestimo): Observable<any> {
    // const req = {
    //   IdClient: item.idClient,
    //   IdBook: item.idBook
    // }

    return this.post<any>(`${this.baseUrl}loans`, item)
      .pipe((response: any) => {
        return response;
      });
  }

  atualizarEmprestimo(item: ICadastrarEmprestimo, id: number): Observable<any> {
    return this.put<any>(`${this.baseUrl}loans/edit-loan/${id}`, item)
      .pipe((response: any) => {
        return response;
      });
  }

  deletarEmprestimo(id: number) {
    return this.delete<any>(`${this.baseUrl}loans/${id}`)
      .pipe((response: any) => {
        return response;
      });
  }

}

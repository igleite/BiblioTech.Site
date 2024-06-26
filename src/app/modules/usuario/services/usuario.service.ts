import {Injectable} from '@angular/core';
import {BaseServiceHelper} from "../../../core/utils/base-service-helper.service";
import {Observable} from "rxjs";
import {ICriarLivro} from "../../livro/interfaces/ILivro";
import {IBloquearusuario, ICriarusuario} from "../interfaces/IUsuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseServiceHelper {

  obterUsuario(id?: string): Observable<any> {

    let url: string = 'users';
    if (id) {
      url = `${url}/${id}`
    }

    return this.get<any>(`${this.baseUrl}${url}`)
      .pipe((response: any) => {
        return response;
      });
  }

  criarUsuario(book: ICriarusuario): Observable<any> {
    return this.post<any>(`${this.baseUrl}users`, book)
      .pipe((response: any) => {
        return response;
      });
  }

  atualizarUsuario(book: ICriarusuario, id: number): Observable<any> {
    return this.put<any>(`${this.baseUrl}users/${id}`, book)
      .pipe((response: any) => {
        return response;
      });
  }

  deletarUsuario(id: number) {
    return this.delete<any>(`${this.baseUrl}users/${id}`)
      .pipe((response: any) => {
        return response;
      });
  }

  obterUsuarioPorCpf(cpf: string): Observable<any> {
    return this.get<any>(`${this.baseUrl}users/getByCpf/${cpf}`)
      .pipe((response: any) => {
        return response;
      });
  }

  bloquearUsuario(book: IBloquearusuario): Observable<any> {
    return this.post<any>(`${this.baseUrl}Users/blockUser/${book.id}?days=${book.days}`)
      .pipe((response: any) => {
        return response;
      });
  }

  desbloquearUsuario(id: number): Observable<any> {
    return this.post<any>(`${this.baseUrl}Users/removeBlockUser/${id}`)
      .pipe((response: any) => {
        return response;
      });
  }
}

import {Injectable} from '@angular/core';
import {BaseServiceHelper} from "../../../core/utils/base-service-helper.service";
import {Observable} from "rxjs";
import {IAtualizarLivro, ICriarLivro, ILivro} from "../interfaces/ILivro";

@Injectable({
  providedIn: 'root'
})
export class LivroService extends BaseServiceHelper {
  obterLivro(id?: string): Observable<any> {

    let url: string = 'books';
    if (id) {
      url = `${url}/${id}`
    }

    return this.get<any>(`${this.baseUrl}${url}`)
      .pipe((response: any) => {
        return response;
      });
  }

  criarLivro(book: ICriarLivro): Observable<any> {
    return this.post<any>(`${this.baseUrl}books`, book)
      .pipe((response: any) => {
        return response;
      });
  }

  atualizarLivro(book: IAtualizarLivro, id: number): Observable<any> {
    return this.put<any>(`${this.baseUrl}books`, book)
      .pipe((response: any) => {
        return response;
      });
  }

  deletarLivro(id: number) {
    return this.delete<any>(`${this.baseUrl}books/${id}`)
      .pipe((response: any) => {
        return response;
      });
  }

  obterLivroPorNome(title: string): Observable<any> {
    return this.get<any>(`${this.baseUrl}books/GetByTitle/${title}`)
      .pipe((response: any) => {
        return response;
      });
  }
}

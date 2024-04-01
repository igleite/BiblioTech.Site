import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { FieldUtils } from "./field-utils";

/**
 * Classe abstrata base para serviços Angular que fornece funcionalidades comuns.
 * Esta classe é injetada em toda a aplicação (providedIn: 'root') e pode ser estendida por outros serviços para herdar seus métodos.
 */
@Injectable({
    providedIn: 'root'
})
export abstract class BaseServiceHelper {
    protected baseUrl: string = environment.baseUrl;

    constructor(private readonly _http: HttpClient) {
    }

  /**
   * Realiza uma solicitação HTTP GET para o servidor.
   *
   * @template T - O tipo de dados esperado na resposta.
   * @param {string} url - O URL para o qual a solicitação será enviada.
   * @param {any} [options] - As opções para a solicitação HTTP GET.
   * @returns {Observable<HttpEvent<T>>} - Um Observable que emite eventos HTTP.
   * @protected
   */
    protected get<T>(url: string, options?: any): Observable<HttpEvent<T>> {
        return this._http.get<T>(url, options);
    }

  /**
   * Realiza uma solicitação HTTP POST para o servidor.
   *
   * @template T - O tipo de dados esperado na resposta.
   * @param {string} url - O URL para o qual a solicitação será enviada.
   * @param {any} [options] - As opções para a solicitação HTTP POST.
   * @returns {Observable<T>} - Um Observable que emite a resposta da solicitação HTTP POST.
   * @protected
   */
    protected post<T>(url: string, options?: any): Observable<T> {
        return this._http.post<T>(url, options);
    }

  /**
   * Realiza uma solicitação HTTP PUT para o servidor.
   *
   * @template T - O tipo de dados esperado na resposta.
   * @param {string} url - O URL para o qual a solicitação será enviada.
   * @param {any} [options] - As opções para a solicitação HTTP PUT.
   * @returns {Observable<T>} - Um Observable que emite a resposta da solicitação HTTP PUT.
   * @protected
   */
    protected put<T>(url: string, options?: any): Observable<T> {
        return this._http.put<T>(url, options);
    }

  /**
   * Realiza uma solicitação HTTP DELETE para o servidor.
   *
   * @template T - O tipo de dados esperado na resposta.
   * @param {string} url - O URL para o qual a solicitação será enviada.
   * @param {any} [options] - As opções para a solicitação HTTP DELETE.
   * @returns {Observable<HttpEvent<T>>} - Um Observable que emite eventos HTTP.
   * @protected
   */
    protected delete<T>(url: string, options?: any): Observable<HttpEvent<T>> {
        return this._http.delete<T>(url, options);
    }

  /**
   * Realiza uma solicitação HTTP PATCH para o servidor.
   *
   * @template T - O tipo de dados esperado na resposta.
   * @param {string} url - O URL para o qual a solicitação será enviada.
   * @param {any} [options] - As opções para a solicitação HTTP PATCH.
   * @returns {Observable<T>} - Um Observable que emite a resposta da solicitação HTTP PATCH.
   * @protected
   */
    protected patch<T>(url: string, options?: any): Observable<T> {
      return this._http.patch<T>(url, options);
    }
}

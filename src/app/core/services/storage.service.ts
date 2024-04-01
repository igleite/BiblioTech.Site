import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth';
import { Router } from '@angular/router';
import {LocalStorageEnum} from "../../shared/enums/enums";

/**
 * Serviço para gerenciamento de armazenamento local.
 * Este serviço permite armazenar, recuperar e limpar dados do armazenamento local do navegador.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(private _router: Router) {
  }

  /**
   * Obtém os dados dados do usuário autenticado, armazenados no localStorage.
   * @returns Os dados dados do usuário autenticado,, se existirem, ou null se não houver.
   */
  public get auth(): AuthResponse | null {
    const aJSON: string | null = localStorage.getItem(LocalStorageEnum.AuthUser);

    if (aJSON) {
      return JSON.parse(aJSON);
    }

    return null;
  }

  /**
   * Define os dados do usuário autenticado no localStorage.
   * @param value Os dados do usuário autenticado a serem armazenados.
   */
  public set auth(value: string) {
    localStorage.removeItem(LocalStorageEnum.AuthUser);
    localStorage.setItem(LocalStorageEnum.AuthUser, value);
  }

  /**
   * Limpa os dados de autenticação do localStorage.
   */
  public clear() {
    localStorage.removeItem(LocalStorageEnum.AuthUser);
  }

  /**
   * Realiza o logout do usuário, limpando os dados do usuário autenticado e redirecionando para a página de autenticação.
   */
  public async logout() {
    this.clear();
    await this._router.navigate(['auth']);
  }

  /**
   * Obtém o valor de uma claim específica do usuário autenticado.
   * @param type O tipo da claim desejada.
   * @returns O valor da claim se existir, ou null se não existir.
   */
  public getClaims(type: string): string | null | undefined {
    const auth: AuthResponse | null = this.auth;
    if (auth !== null) {
      return auth?.usuarioToken.claims.find(claim => claim.type === type)?.value;
    }

    return null;
  }

  /**
   * Define um filtro no armazenamento local.
   * @param name O nome do filtro.
   * @param filter O filtro a ser armazenado.
   */
  public setFilter(name: string, filter: any) {
    localStorage.removeItem(name);
    localStorage.setItem(name, filter);
  }

  /**
   * Remove um filtro do armazenamento local.
   * @param name O nome do filtro a ser removido.
   */
  public removeFilter(name: string) {
    localStorage.removeItem(name);
  }

  /**
   * Obtém um filtro do armazenamento local.
   * @param name O nome do filtro a ser obtido.
   * @returns O filtro, se existir, ou null se não existir.
   */
  public getFilter(name: string): any | null {
    try {
      const aJSON: string | null = localStorage.getItem(name);

      if (aJSON) {
        return JSON.parse(aJSON);
      }

      return null;
    } catch {
      return null;
    }
  }

}

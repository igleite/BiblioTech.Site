import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {NavigationEnd, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {SubscriberSink} from './subscriber-sink';
import {ApiRequestHandlerUtil} from './api-request-handler-util';

/**
 * Classe abstrata base para componentes Angular que fornece funcionalidades comuns, implementando OnInit e OnDestroy.
 * Esta classe é injetada em toda a aplicação (providedIn: 'root') e pode ser estendida por outros componentes para herdar seus métodos.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class BaseComponentHelper implements OnInit, OnDestroy {
  private _loading: boolean = false;
  private _pageIndex: number = -1;
  private _pageSize: number = 10;
  private _form!: FormGroup;
  private _totalItemCount: number = 0;
  private _modalOpen: boolean = false;

  protected subs: SubscriberSink = new SubscriberSink();
  protected notificationService: NotificationService = new NotificationService();
  protected apiRequestHandlerUtil: ApiRequestHandlerUtil = new ApiRequestHandlerUtil();


  protected constructor(
    protected readonly _router: Router,
    protected readonly _formBuilder: FormBuilder,
  ) {
  }

  /**
   * Executa as inicializações necessárias quando o componente é inicializado.
   *
   * @returns {void}
   */
  ngOnInit(): void {
  }


  /**
   * Executa a limpeza necessária quando o componente está sendo destruído.
   * Isso inclui a desinscrição de todas as subscrições e a conclusão do subject `ngUnsubscribe`.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    // Desinscreve todas as subscrições
    this.subs.unsubscribe();
  }

  /**
   * Obtém o estado de carregamento.
   *
   * @returns {boolean} true se o componente estiver em um estado de carregamento, caso contrário false.
   */
  get isLoading(): boolean {
    return this._loading;
  }

  /**
   * Obtém o índice da página atual.
   *
   * @returns {number} O índice da página atual.
   */
  get pageIndex(): number {
    return this._pageIndex;
  }

  /**
   * Obtém o tamanho da página.
   *
   * @returns {number} O tamanho da página.
   */
  get pageSize(): number {
    return this._pageSize;
  }

  /**
   * Obtém o número total de itens.
   *
   * @returns {number} O número total de itens.
   */
  get totalItemCount(): number {
    return this._totalItemCount;
  }

  /**
   * Obtém o formulário FormGroup.
   *
   * @returns {FormGroup} O formulário FormGroup.
   */
  get getForm(): FormGroup {
    return this._form;
  }

  /**
   * Obtém o se o modal está aberto.
   *
   * @returns {boolean}
   */
  get modalOpen(): boolean {
    return this._modalOpen;
  }

  /**
   * Define o estado de carregamento, após um pequeno atraso..
   *
   * @param {boolean} value O novo estado de carregamento.
   */
  set isLoading(value: boolean) {
    setTimeout(() => {
      this._loading = value;
    });
  }

  /**
   * Define o índice da página atual.
   *
   * @param {number} value O novo índice da página atual.
   */
  set pageIndex(value: number) {
    this._pageIndex = value;
  }

  /**
   * Define o tamanho da página.
   *
   * @param {number} value O novo tamanho da página.
   */
  set pageSize(value: number) {
    this._pageSize = value;
  }

  /**
   * Define o número total de itens.
   *
   * @param {number} value O novo número total de itens.
   */
  set totalItemCount(value: number) {
    this._totalItemCount = value;
  }

  /**
   * Define o formulário FormGroup.
   *
   * @param {FormGroup<any>} form O novo formulário FormGroup.
   */
  set setForm(form: FormGroup<any>) {
    this._form = form;
  }

  /**
   * Define o estado do modal.
   *
   * @param {boolean} open O novo estado do modal.
   */
  set modalOpen(open: boolean) {
    this._modalOpen = open;
  }

  /**
   * Obtém o controle correspondente a um campo específico em um formulário.
   *
   * @param {string} fieldName - O nome do campo cujo controle está sendo buscado.
   * @returns {AbstractControl | null} - O controle correspondente ao campo especificado, ou null se o campo não for encontrado.
   */
  public getField(fieldName: string): AbstractControl | null {
    return this.getForm?.get(fieldName);
  }

  /**
   * Verifica se um campo específico de um formulário possui erro.
   * @param {string} fieldName - O nome do campo no formulário.
   * @param {string} [error] - O nome do erro específico a ser verificado. (Opcional)
   * @returns {boolean} - Retorna verdadeiro se o campo tiver o erro especificado (ou qualquer erro se nenhum erro for fornecido) e tiver sido tocado (touched), caso contrário, retorna falso.
   */
  public getHasError(fieldName: string, error?: string): boolean {
    const control = this.getField(fieldName);

    if (!control) {
      return false;
    }

    return !!error ? control.hasError(error) : control.invalid;
  }

  /**
   * @description
   * Itera sobre todos os controles de um formulário e retorna uma lista de objetos contendo o nome, o valor e os erros de cada controle.
   *
   * Para exibir o resultado formatado no HTML, chame desta forma:
   * ```html
   * <pre>
   *   {{ iterateFormControls() | json }}
   * </pre>
   * ```
   *
   * @returns {Array<{ ControlName: string, ControlValue: any, Errors: any }>} - Uma matriz de objetos, cada um representando um controle do formulário, seu valor atual e quaisquer erros associados.
   * @protected
   */
  protected iterateFormControls(): { ControlName: string, ControlValue: any, Errors: any }[] {
    const myControls: { ControlName: string, ControlValue: any, Errors: any }[] = [];
    const controles: { [p: string]: AbstractControl<any, any> } = this.getForm.controls;
    Object.keys(controles).forEach(controlName => {
      const controlValue = this.getField(controlName)?.value;
      const erros = this.getField(controlName)?.errors;
      myControls.push({ControlName: controlName, ControlValue: controlValue, Errors: erros});
    });

    return myControls;
  }
}

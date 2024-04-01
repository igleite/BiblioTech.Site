import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {


  /**
   * Retorna uma configuração padrão para exibição de toasts usando a biblioteca SweetAlert.
   *
   * @returns {typeof Swal} - Um objeto SweetAlert mixin configurado para exibição de toasts.
   */
  public get toastConfig(): typeof Swal {
    return Swal.mixin({
      toast: true,
      position: 'top-right',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    });
  }

  /**
   * Retorna uma configuração para diálogos usando a biblioteca SweetAlert, baseada no tema atual.
   *
   * @returns {SweetAlertOptions} - Um objeto contendo as opções de configuração para diálogos.
   */
  public get fireDialogConfig(): SweetAlertOptions {
    return {
      background: '#fff',
      color: '#545454',
      backdrop: true,
      allowOutsideClick: false,
    };
  }

  /**
   * Aplica as configurações de diálogo padrão a um conjunto de opções de diálogo fornecidas.
   *
   * @param {SweetAlertOptions} [options={}] - As opções de diálogo a serem modificadas. Se não forem fornecidas, um objeto vazio será usado.
   * @returns {SweetAlertOptions} - As opções de diálogo com as configurações padrão aplicadas.
   * @private
   */
  private _applyDialogConfig(options: SweetAlertOptions = {}): SweetAlertOptions {
    options.background = this.fireDialogConfig.background;
    options.color = this.fireDialogConfig.color;
    options.backdrop = this.fireDialogConfig.backdrop;
    options.allowOutsideClick = this.fireDialogConfig.allowOutsideClick;

    return options;
  }

  /**
   * Exibe um toast usando a biblioteca SweetAlert.
   * Aguarda um período de tempo antes de fechar outros SweetAlert que estejam executando.
   *
   * @param {SweetAlertIcon} icon - O ícone a ser exibido no toast.
   * @param {string} title - O título do toast.
   * @returns {Promise<void>} - Uma promessa vazia que resolve após a exibição do toast.
   * @protected
   */
  public async showToast(icon: SweetAlertIcon, title: string) {
    setTimeout(async () => {
      await this.toastConfig.fire({ icon: icon, title: title });
    }, 1000);
  }

  /**
   * Exibe um diálogo de confirmação usando a biblioteca SweetAlert.
   *
   * @param {SweetAlertOptions} [options={}] - As opções de configuração para o diálogo de confirmação. Se não fornecido, um objeto vazio será usado.
   * @returns {Promise<SweetAlertResult>} - Uma promessa que resolve com o resultado do diálogo de confirmação.
   * @protected
   */
  public async confirmDialog(options: SweetAlertOptions = {}): Promise<SweetAlertResult> {
    let sweetAlertOptions: SweetAlertOptions = this._applyDialogConfig(options);
    return await Swal.fire(sweetAlertOptions);
  }

  /**
   * Exibe um diálogo de alerta usando a biblioteca SweetAlert.
   *
   * @param {SweetAlertOptions} [options={}] - As opções de configuração para o diálogo de alerta. Se não fornecido, um objeto vazio será usado.
   * @returns {Promise<SweetAlertResult>} - Uma promessa que resolve com o resultado do diálogo de alerta.
   * @protected
   */
  public async alertDialog(options: SweetAlertOptions = {}): Promise<SweetAlertResult> {
    let sweetAlertOptions: SweetAlertOptions = this._applyDialogConfig(options);
    return await Swal.fire(sweetAlertOptions);
  }

  /**
   * Aguarda 1 segundo antes de fechar a janela modal do SweetAlert.
   * @function
   * @name swalCloseSetTimeout
   * @memberof NotificationService
   * @returns {void}
   */
  public swalCloseSetTimeout() {
    setTimeout(() => {
      Swal.close();
    }, 1000);
  }
}

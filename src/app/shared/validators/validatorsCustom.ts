import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';

/**
 * Classe que contém validadores customizados.
 */
export class ValidatorsCustom {

  /**
   * Validador de ano que verifica se o ano está dentro do intervalo permitido (1500-2100).
   * @param {AbstractControl} control - O controle do formulário que contém o valor a ser validado.
   * @returns {Observable<ValidationErrors | null>} Um observable que emite um objeto de erro se o valor for inválido, ou null se for válido.
   */
  public static yearValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control?.value as number;

    if (value != null && (value < 1500 || value > 2100)) {
      return of({'yearValidator': true});
    }

    return of(null);
  }
}

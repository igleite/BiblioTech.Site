import {Pipe, PipeTransform} from '@angular/core';

/**
 * Transforma uma string de inscrição federal (CNPJ ou CPF) em um formato legível.
 *
 * @example
 * {{ inscricaoFederal | formatCnpjCpf }}
 *
 * @param {string | undefined} inscricaoFederal - A string de inscrição federal (CNPJ ou CPF) a ser formatada.
 * @returns {string | undefined} - A string de inscrição federal formatada ou undefined se a entrada for undefined.
 */
@Pipe({
  name: 'formatCnpjCpf',
  standalone: true
})
export class FormatCnpjCpfPipe implements PipeTransform {

  transform(inscricaoFederal: string | undefined): string | undefined {
    if (inscricaoFederal === undefined) {
      return undefined;
    }

    const cnpjCpf: string = inscricaoFederal.replace(/\D/g, '');

    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }

    return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  }

}

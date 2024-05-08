export class FieldUtils {
    // getEmptyFields(...fields: { name: any; value: any }[]): { name: string; filled: boolean }[] {
    //     return fields.map(field => ({
    //         name: field.name,
    //         filled: field.value !== null && field.value !== undefined && field.value !== '',
    //     }));
    // }

  /**
   * Verifica se algum dos campos passados como argumento está vazio, nulo ou indefinido.
   *
   * @param {...any[]} fields - Os campos a serem verificados.
   * @returns {boolean} - True se algum dos campos estiver vazio, nulo ou indefinido; false caso contrário.
   */
    public static isNotFieldFilled(...fields: any[]): boolean {
        for (const field of fields) {
            if (field === null || field === undefined || field === '') {
                return true;
            }
        }
        return false;
    }

    // areFieldsNotEqual(...fields: { firstValue: any; secondaryValue: any }[]): boolean {
    //     for (let i = 0; i < fields.length; i++) {
    //         if (fields[i].firstValue !== fields[i].secondaryValue) {
    //             return false;
    //         }
    //     }
    //
    //     return true;
    // }

  /**
   * Remove caracteres não numéricos de uma string.
   *
   * @param {string} inputString A string que será sanitizada.
   * @returns {string} A string resultante após a remoção dos caracteres não numéricos.
   */
  public static sanitizeString(inputString: string): string {
    const numericChars = inputString.split('').filter(char => !isNaN(Number(char)));
    return numericChars.join('');
  }

}

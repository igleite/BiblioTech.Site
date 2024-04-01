/**
 * Expressão regular para validar UUIDs.
 * Esta expressão regular verifica se uma string corresponde ao formato de UUID.
 */
const UUID_REGEX: RegExp = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

/**
 * Classe para manipulação de UUIDs.
 * Copiado do repositório https://www.npmjs.com/package/uuid para não ter que instalar o pacote
 */
export class UUID {
  /**
   * Valida um UUID.
   * @param uuid A string a ser validada como UUID.
   * @returns Verdadeiro se a string for um UUID válido, falso caso contrário.
   */
  public static validateUUID(uuid: string): boolean {
    try {
      return typeof uuid === 'string' && UUID_REGEX.test(uuid);
    } catch {
      return false;
    }
  }

  /**
   * Retorna a versão UUID de um UUID válido.
   * @param uuid O UUID a partir do qual a versão será extraída.
   * @returns A versão UUID.
   * @throws {TypeError} Se o UUID fornecido for inválido.
   */
  public static version(uuid: string): number {
    try {
      if (!UUID.validateUUID(uuid)) {
        throw new TypeError('Invalid UUID');
      }

      return parseInt(uuid.slice(14, 15), 16);
    } catch {
      throw new TypeError('Invalid UUID');
    }
  }
}


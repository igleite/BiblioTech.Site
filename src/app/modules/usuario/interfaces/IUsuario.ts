export interface IUsuario {
  id: number;
  cpf: string,
  name: string,
  email: string,
  blockedDate: Date | null,
  days: number | null,
}

export interface ICriarusuario extends Omit<IUsuario, 'id' | 'blockedDate' | 'days'> {
}

export interface IBloquearusuario extends Pick<IUsuario, 'id' | 'days'> {
}

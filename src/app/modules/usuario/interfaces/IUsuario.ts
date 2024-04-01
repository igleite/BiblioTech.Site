export interface IUsuario {
  id: number;
  cpf: string,
  name: string,
  email: string
}

export interface ICriarusuario extends Omit<IUsuario, 'id'> {
}

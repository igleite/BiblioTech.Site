import {IUsuario} from "../../usuario/interfaces/IUsuario";

export interface ILivro {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  emprestado: boolean;
  emprestadoPara?: IUsuario;
}

export interface IAtualizarLivro extends Omit<ILivro, 'emprestado' | 'emprestadoPara'> {}
export interface ICriarLivro extends Omit<ILivro, 'id' | 'emprestado' | 'emprestadoPara'> {}


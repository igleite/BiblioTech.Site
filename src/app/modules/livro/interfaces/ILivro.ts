export interface ILivro {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
}

export interface ICriarLivro extends Omit<ILivro, 'id'> {}


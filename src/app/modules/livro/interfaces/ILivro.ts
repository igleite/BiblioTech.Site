export interface ILivro {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  emprestado: boolean;
}

export interface IAtualizarLivro extends Omit<ILivro, 'emprestado'> {}
export interface ICriarLivro extends Omit<ILivro, 'id' | 'emprestado'> {}


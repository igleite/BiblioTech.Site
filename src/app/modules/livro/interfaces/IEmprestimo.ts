export interface IEmprestimo {
  clientName: string,
  bookName: string,
  loanDate: string,
  devolution: string
}

export interface ICadastrarEmprestimo {
  IdClient: number,
  IdBook: number
}

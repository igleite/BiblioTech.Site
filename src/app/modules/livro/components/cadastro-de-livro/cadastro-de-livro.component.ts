import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {ICriarLivro, ILivro} from "../../interfaces/ILivro";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LivroService} from "../../services/livro.service";
import {JsonPipe, NgIf} from "@angular/common";
import Swal, {SweetAlertResult} from "sweetalert2";

@Component({
  selector: 'app-cadastro-de-livros',
  standalone: true,
  templateUrl: './cadastro-de-livro.component.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgIf
  ],
})
export class CadastroDeLivroComponent extends BaseComponentHelper implements OnInit {
  public edicao: boolean = false;
  public item!: ILivro;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _livroService: LivroService,
    private _route: ActivatedRoute,
  ) {
    super(_router, _formBuilder);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    const id = Number(this._route?.snapshot?.params['id']);
    this.edicao = !!id;

    this._buildForm();

    if (!isNaN(id))
      this._load(id);
  }

  private _buildForm() {
    this.setForm = this._formBuilder.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      author: [null, [Validators.required, Validators.maxLength(100)]],
      isbn: [null, [Validators.required, Validators.maxLength(100)]],
      publicationYear: [null, [Validators.required, Validators.maxLength(4)]],
    });
  }

  private _fillData(): void {
    this.getForm.patchValue({
      'title': this.item.title,
      'author': this.item.author,
      'isbn': this.item.isbn,
      'publicationYear': this.item.publicationYear,
    });
  }

  private _load(id: number) {
    if (this.isLoading && !this.edicao) {
      return;
    }

    this.isLoading = true;

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._livroService.obterLivro(id.toString())
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: ILivro) => {
        if (data) {
          this.item = data;
          this._fillData();
        }
      },
    });
  }


  async ngSubmit() {
    if (this.isLoading || this.getForm.invalid) {
      return;
    }

    const livro: ICriarLivro = {
      title: this.getField('title')?.value,
      author: this.getField('author')?.value,
      isbn: this.getField('isbn')?.value,
      publicationYear: this.getField('publicationYear')?.value,
    }

    if (this.edicao) {
      await this._editar(livro)
    } else {
      await this._cadastrar(livro);
    }


  }

  private async _editar(livro: ICriarLivro) {
    try {

      await this.notificationService.confirmDialog({
        title: 'Aguarde!',
        html: 'Salvando...',
        didOpen: async () => {
          Swal.showLoading();

          this.isLoading = true;
          this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
            this._livroService.atualizarLivro(livro, this.item.id)
          ).subscribe({
            complete: async () => {
              this.isLoading = false;
              await this._router.navigate(['app/livro/lista']);
              await this.notificationService.showToast('success', 'Livro atualizado com sucesso!');
            },
            error: async (error: any): Promise<void> => {
              this.isLoading = false;
              await this.notificationService.showToast('error', error.message);
            },
            next: async () => {
            },
          });

          this.isLoading = false;
          this.notificationService.swalCloseSetTimeout();

        },
      });

    } catch {
      this.isLoading = false;
    }
  }

  private async _cadastrar(livro: ICriarLivro) {
    try {

      await this.notificationService.confirmDialog({
        title: 'Aguarde!',
        html: 'Cadastrando...',
        didOpen: async () => {
          Swal.showLoading();


          this.isLoading = true;
          this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
            this._livroService.criarLivro(livro)
          ).subscribe({
            complete: async () => {
              this.isLoading = false;
              await this._router.navigate(['app/livro/lista']);
              await this.notificationService.showToast('success', 'Livro criado com sucesso!');
            },
            error: async (error: any): Promise<void> => {
              this.isLoading = false;
              await this.notificationService.showToast('error', error.message);
            },
            next: async () => {
            },
          });

          this.isLoading = false;
          this.notificationService.swalCloseSetTimeout();

        },
      });

    } catch {
      this.isLoading = false;
    }
  }

  async excluir(id: number) {
    if (this.isLoading) {
      return;
    }

    const result: SweetAlertResult<any> = await this.notificationService.confirmDialog({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {

      await this.notificationService.confirmDialog({
        title: 'Aguarde!',
        html: 'Excluindo...',
        didOpen: async () => {
          Swal.showLoading();

          this.isLoading = true;

          this.isLoading = true;
          this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
            this._livroService.deletarLivro(id)
          ).subscribe({
            complete: async () => {
              this.isLoading = false;
              await this._router.navigate(['app/livro/lista']);
              await this.notificationService.showToast('success', 'Livro excluído com sucesso!');
            },
            error: async (error: any): Promise<void> => {
              this.isLoading = false;
              await this.notificationService.showToast('error', error.message);
            },
            next: async () => {
            },
          });


          this.isLoading = false;
          this.notificationService.swalCloseSetTimeout();

        },
      });

    } catch {
      this.isLoading = false;
    }
  }
}

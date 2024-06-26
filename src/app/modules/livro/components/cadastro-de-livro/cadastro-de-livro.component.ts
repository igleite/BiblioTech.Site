import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {IAtualizarLivro, ICriarLivro, ILivro} from "../../interfaces/ILivro";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LivroService} from "../../services/livro.service";
import {JsonPipe, NgIf} from "@angular/common";
import Swal, {SweetAlertResult} from "sweetalert2";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import {ValidatorsCustom} from "../../../../shared/validators/validatorsCustom";
import {FormatCnpjCpfPipe} from "../../../../shared/pipes/format-cnpj-cpf.pipe";

@Component({
  selector: 'app-cadastro-de-livros',
  standalone: true,
  templateUrl: './cadastro-de-livro.component.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgIf,
    NgxMaskDirective,
    NgxMaskPipe,
    FormatCnpjCpfPipe
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
    public activeModal: NgbActiveModal
  ) {
    super(_router, _formBuilder);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    if (this.edicao) {
      this._buildForm();
      this._fillData();
    }
  }

  private _buildForm() {
    this.setForm = this._formBuilder.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      author: [null, [Validators.required, Validators.maxLength(100)]],
      isbn: [null, [Validators.required, Validators.maxLength(100)]],
      publicationYear: [null, [Validators.required, Validators.maxLength(4)], ValidatorsCustom.yearValidator],
    });
  }

  private _fillData(): void {
    this.getForm.patchValue({
      'title': this.item?.title,
      'author': this.item?.author,
      'isbn': this.item?.isbn,
      'publicationYear': this.item?.publicationYear,
    });
  }

  async ngSubmit() {
    if (this.isLoading || this.getForm.invalid) {
      return;
    }

    if (this.edicao && this.item) {
      const livro: IAtualizarLivro = {
        id: this.item.id,
        title: this.getField('title')?.value,
        author: this.getField('author')?.value,
        isbn: this.getField('isbn')?.value,
        publicationYear: this.getField('publicationYear')?.value,
      }

      await this._editar(livro)
    } else {

      const livro: ICriarLivro = {
        title: this.getField('title')?.value,
        author: this.getField('author')?.value,
        isbn: this.getField('isbn')?.value,
        publicationYear: this.getField('publicationYear')?.value,
      }

      await this._cadastrar(livro);
    }

  }

  private async _editar(livro: IAtualizarLivro) {
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
              this.activeModal.dismiss();
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
              this.activeModal.dismiss();
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

  clickEdicao() {
    this.edicao = !this.edicao

    if (!this.edicao)
      this._fillData();
  }
}

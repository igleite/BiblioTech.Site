import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LivroService} from "../../services/livro.service";
import {ILivro} from "../../interfaces/ILivro";
import {DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import Swal, {SweetAlertResult} from "sweetalert2";
import {FieldUtils} from "../../../../core/utils/field-utils";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CadastroDeLivroComponent} from "../cadastro-de-livro/cadastro-de-livro.component";
import {FormatCnpjCpfPipe} from "../../../../shared/pipes/format-cnpj-cpf.pipe";
import {EmprestimoComponent} from "../emprestimo/emprestimo.component";
import {EmprestimoService} from "../../services/emprestimo.service";

@Component({
  selector: 'app-lista-de-livro',
  standalone: true,
  templateUrl: './lista-de-livro.component.html',
  imports: [
    JsonPipe,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    FormatCnpjCpfPipe,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgClass
  ],
})
export class ListaDeLivroComponent extends BaseComponentHelper implements OnInit {

  public items: ILivro[] = []

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _livroService: LivroService,
    private modalService: NgbModal,
    private _emprestimo: EmprestimoService
  ) {
    super(_router, _formBuilder);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._buildForm();
    this._load();
  }

  private _buildForm() {
    this.setForm = this._formBuilder.group({
      pesquisa: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }


  private _load() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._livroService.obterLivro()
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: ILivro[]) => {
        this.items = data;
      },
    });
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
              this._load();
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


  pesquisar() {
    if (this.isLoading) {
      return;
    }

    if (FieldUtils.isNotFieldFilled(this.getField('pesquisa')?.value)) {
      this._load();
      return;
    }

    this.isLoading = true;

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._livroService.obterLivroPorNome(this.getField('pesquisa')?.value ?? '')
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: ILivro[]) => {
        if (data.length > 0)
          this.items = data;
        else
          await this.notificationService.showToast('warning', 'Livro não encontrado para o NOME fornecido.');
      },
    });
  }

  async cadastrar() {
    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;

    const modalRef = this.modalService.open(CadastroDeLivroComponent);
    modalRef.componentInstance.edicao = true;

    modalRef.result.then(
      onfulfilledData => {


        this.modalOpen = false;
        this._load();
      },
      onRejected => {


        this.modalOpen = false;
      }
    );
  }

  editar(item: ILivro) {
    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;

    const modalRef = this.modalService.open(CadastroDeLivroComponent);
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.edicao = true;

    modalRef.result.then(
      onfulfilledData => {


        this.modalOpen = false;
        this._load();
      },
      onRejected => {


        this.modalOpen = false;
      }
    );
  }

  verDetalhes(item: ILivro) {
    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;

    const modalRef = this.modalService.open(CadastroDeLivroComponent);
    modalRef.componentInstance.edicao = false;
    modalRef.componentInstance.item = item;

    modalRef.result.then(
      onfulfilledData => {


        this.modalOpen = false;
      },
      onRejected => {


        this.modalOpen = false;
      }
    );
  }

  emprestar(item: ILivro) {
    if (this.modalOpen) {
      return;
    }

    this.modalOpen = true;
    const modalRef = this.modalService.open(EmprestimoComponent, {size: "xl"});
    modalRef.componentInstance.livroSelecionado = item;

    modalRef.result.then(
      onfulfilledData => {


        this.modalOpen = false;
        this._load();
      },
      onRejected => {


        this.modalOpen = false;
        this._load();
      }
    );
  }

  async devolver(item: ILivro) {
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
      confirmButtonText: 'Sim, devolver!',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {

      await this.notificationService.confirmDialog({
        title: 'Aguarde!',
        html: 'Devolvendo...',
        didOpen: async () => {
          Swal.showLoading();

          this.isLoading = true;

          this.isLoading = true;
          this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
            this._emprestimo.deletarEmprestimo(item.id)
          ).subscribe({
            complete: async () => {
              this.isLoading = false;
              await this.notificationService.showToast('success', 'Livro devolvido com sucesso!');
              this._load();
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

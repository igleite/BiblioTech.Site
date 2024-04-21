import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IUsuario} from "../../interfaces/IUsuario";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {UsuarioService} from "../../services/usuario.service";
import Swal, {SweetAlertResult} from "sweetalert2";
import {FormatCnpjCpfPipe} from "../../../../shared/pipes/format-cnpj-cpf.pipe";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FieldUtils} from "../../../../core/utils/field-utils";
import {CadastroDeUsuarioComponent} from "../cadastro-de-usuario/cadastro-de-usuario.component";
import {BloqueioDeUsuarioComponent} from "../bloqueio-de-usuario/bloqueio-de-usuario.component";

@Component({
  selector: 'app-lista-de-usuario',
  standalone: true,
  templateUrl: './lista-de-usuario.component.html',
  imports: [
    JsonPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    FormatCnpjCpfPipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem
  ],
})
export class ListaDeUsuarioComponent extends BaseComponentHelper implements OnInit {

  public items: IUsuario[] = []

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal
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
      this._usuarioService.obterUsuario()
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: IUsuario[]) => {
        this.items = data;
      },
    });
  }

  async deletar(id: number) {
    const result: SweetAlertResult<any> = await this.notificationService.confirmDialog({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    await this.notificationService.confirmDialog({
      title: 'Aguarde!',
      html: 'Cancelando...',
      didOpen: async () => {
        Swal.showLoading();

        this.isLoading = true;
        this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
          this._usuarioService.deletarUsuario(id)
        ).subscribe({
          complete: async () => {
            this.isLoading = false;
            this._load();
            await this.notificationService.showToast('success', 'Usuário deletado com sucesso!');
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
  }

  pesquisarPorCpf() {
    if (this.isLoading) {
      return;
    }

    if (FieldUtils.isNotFieldFilled(this.getField('pesquisa')?.value)) {
      this._load();
      return;
    }

    this.isLoading = true;

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._usuarioService.obterUsuarioPorCpf(this.sanitizeString(this.getField('pesquisa')?.value))
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: IUsuario[]) => {
        if (data.length > 0)
          this.items = data;
        else
          await this.notificationService.showToast('warning', 'Usuário não encontrado para o CPF fornecido.');
      },
    });
  }


  sanitizeString(inputString: string): string {
    const numericChars = inputString.split('').filter(char => !isNaN(Number(char)));
    return numericChars.join('');
  }

  cadastrar() {
    const modalRef = this.modalService.open(CadastroDeUsuarioComponent);
    modalRef.componentInstance.edicao = false;

    modalRef.result.then(
      onfulfilledData => {
        this._load();
      },
      onRejected => {
        this._load();
      }
    );

  }

  editar(item: IUsuario) {
    const modalRef = this.modalService.open(CadastroDeUsuarioComponent);
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.edicao = true;

    modalRef.result.then(
      onfulfilledData => {
        this._load();
      },
      onRejected => {
        this._load();
      }
    );

  }

  bloquear(item: IUsuario) {
    const modalRef = this.modalService.open(BloqueioDeUsuarioComponent);
    modalRef.componentInstance.item = item;

    modalRef.result.then(
      onfulfilledData => {
        this._load();
      },
      onRejected => {
        this._load();
      }
    );
  }

  async desbloquear(item: IUsuario) {
    if (this.isLoading || FieldUtils.isNotFieldFilled(item.blockedDate)) {
      return;
    }

    const result: SweetAlertResult<any> = await this.notificationService.confirmDialog({
      title: 'Tem certeza?',
      // text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, desbloquear!',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    await this.notificationService.confirmDialog({
      title: 'Aguarde!',
      html: 'Desbloqueando...',
      didOpen: async () => {
        Swal.showLoading();

        this.isLoading = true;


        this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
          this._usuarioService.desbloquearUsuario(item.id)
        ).subscribe({
          complete: async () => {
            this.isLoading = false;
            await this.notificationService.showToast('success', 'Usuário desbloqueado com sucesso!')
          },
          error: async (error: any): Promise<void> => {
            this.isLoading = false;
            await this.notificationService.showToast('error', error.message);
          },
          next: async (data: IUsuario) => {
            this._load();
          },
        });

        this.isLoading = false;
        this.notificationService.swalCloseSetTimeout();

      },
    });
  }

  protected readonly FieldUtils = FieldUtils;
}

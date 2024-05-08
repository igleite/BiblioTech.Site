import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {Router} from "@angular/router";
import {ListaDeUsuarioComponent} from "../../../usuario/components/lista-de-usuario/lista-de-usuario.component";
import {IUsuario} from "../../../usuario/interfaces/IUsuario";
import Swal, {SweetAlertResult} from "sweetalert2";
import {EmprestimoService} from "../../services/emprestimo.service";
import {ILivro} from "../../interfaces/ILivro";
import {FieldUtils} from "../../../../core/utils/field-utils";

@Component({
  selector: 'app-emprestimo',
  standalone: true,
  imports: [
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    ListaDeUsuarioComponent,
    JsonPipe
  ],
  templateUrl: './emprestimo.component.html'
})
export class EmprestimoComponent extends BaseComponentHelper implements OnInit {

  usuarioSelecionado!: IUsuario | null;
  livroSelecionado!: ILivro;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _emprestimo: EmprestimoService
  ) {
    super(_router, _formBuilder);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
  }

  changeUsuario(event: IUsuario | null) {
    this.usuarioSelecionado = event;
  }

  async fecharModal() {
    if (this.usuarioSelecionado) {
      const result: SweetAlertResult<any> = await this.notificationService.confirmDialog({
        title: 'Tem certeza?',
        text: 'Deseja cancelar o processo de empréstimo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    this.activeModal.dismiss()
  }

  async emprestar() {
    if (!this.usuarioSelecionado || !this.livroSelecionado) {
      return;
    }

    if (this.usuarioSelecionado.blockedDate) {
      const blockedDate = new Date(this.usuarioSelecionado.blockedDate);
      const dateNow = new Date();

      if (blockedDate.getTime() >= dateNow.getTime()) {
        await this.notificationService.showToast('warning', `Usuario possui um bloqueio por alguma pendencia`);
        return;
      }
    }

    const result: SweetAlertResult<any> = await this.notificationService.confirmDialog({
      title: 'Tem certeza?',
      text: 'Deseja fazer o empréstimo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.notificationService.confirmDialog({
        title: 'Aguarde!',
        html: 'Cadastrando...',
        didOpen: async () => {
          Swal.showLoading();

          this.isLoading = true;
          this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
            this._emprestimo.criarEmprestimo({IdBook: this.livroSelecionado.id, IdClient: Number(this.usuarioSelecionado?.id)})
          ).subscribe({
            complete: async () => {
              this.isLoading = false;
              await this.notificationService.showToast('success', 'Empréstimo criado com sucesso!');
              this.activeModal.dismiss()
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

    protected readonly FieldUtils = FieldUtils;
}

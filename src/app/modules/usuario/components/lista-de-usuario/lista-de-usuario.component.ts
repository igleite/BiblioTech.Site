import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {IUsuario} from "../../interfaces/IUsuario";
import {JsonPipe, NgForOf} from "@angular/common";
import {UsuarioService} from "../../services/usuario.service";
import Swal, {SweetAlertResult} from "sweetalert2";

@Component({
  selector: 'app-lista-de-usuario',
  standalone: true,
  templateUrl: './lista-de-usuario.component.html',
  imports: [
    JsonPipe,
    NgForOf
  ],
})
export class ListaDeUsuarioComponent extends BaseComponentHelper implements OnInit {

  public items: IUsuario[] = []

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService
  ) {
    super(_router, _formBuilder);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._load();
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

  async verDetalhes(id: number) {
    await this._router.navigate([`app/usuario/detalhar/${id}`])
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
}

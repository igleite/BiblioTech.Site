import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {LivroService} from "../../services/livro.service";
import {ILivro} from "../../interfaces/ILivro";
import {JsonPipe, NgForOf} from "@angular/common";
import Swal, {SweetAlertResult} from "sweetalert2";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-lista-de-livro',
  standalone: true,
  templateUrl: './lista-de-livro.component.html',
  imports: [
    JsonPipe,
    NgForOf
  ],
})
export class ListaDeLivroComponent extends BaseComponentHelper implements OnInit {

  public items: ILivro[] = []

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _livroService: LivroService,
    private readonly _notificationService: NotificationService,
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
    this.pageIndex += 1;


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

  async verDetalhes(id: number) {
    await this._router.navigate([`/app/livro/detalhar/${id}`])
  }

  async deletar(id: number) {
    const result: SweetAlertResult<any> = await this._notificationService.confirmDialog({
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
          this._livroService.deletarLivro(id)
        ).subscribe({
          complete: async () => {
            this.isLoading = false;
            this._load();
            await this.notificationService.showToast('success', 'Livro deletado com sucesso!');
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

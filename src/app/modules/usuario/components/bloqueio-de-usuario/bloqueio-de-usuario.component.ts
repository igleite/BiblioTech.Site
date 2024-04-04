import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {IBloquearusuario, IUsuario} from "../../interfaces/IUsuario";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsuarioService} from "../../services/usuario.service";
import {FieldUtils} from "../../../../core/utils/field-utils";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-bloqueio-de-usuario',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './bloqueio-de-usuario.component.html',
})
export class BloqueioDeUsuarioComponent extends BaseComponentHelper implements OnInit {
  public item!: IUsuario;
  public numeroDias: number | null = 0;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    public activeModal: NgbActiveModal
  ) {
    super(_router, _formBuilder);
  }

  bloquear() {
    if (this.isLoading || this.numeroDias === 0 || !FieldUtils.isNotFieldFilled(this.item.blockedDate)) {
      return;
    }

    this.isLoading = true;

    const bloqueio: IBloquearusuario = {
      id: this.item.id,
      days: Number(this.numeroDias)
    }

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._usuarioService.bloquearUsuario(bloqueio)
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
        await this.notificationService.showToast('success', 'Usuário bloqueado com sucesso!');
        this.activeModal.dismiss();
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: IUsuario) => {
        this.numeroDias = null;
        this.item = data;
      },
    });
  }

  protected readonly FieldUtils = FieldUtils;
}

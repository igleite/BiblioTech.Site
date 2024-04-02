import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsuarioService} from "../../services/usuario.service";
import {IBloquearusuario, IUsuario} from "../../interfaces/IUsuario";
import {DatePipe, JsonPipe} from "@angular/common";
import {FieldUtils} from "../../../../core/utils/field-utils";

@Component({
  selector: 'app-detalhar-usuario',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './detalhar-usuario.component.html'
})
export class DetalharUsuarioComponent extends BaseComponentHelper implements OnInit {
  public item!: IUsuario;
  numeroDias: number | null = 0;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
  ) {
    super(_router, _formBuilder);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    const id = Number(this._route?.snapshot?.params['id']);

    if (!id) {
      await this._router.navigate(['app/livro/lista']);
      return;
    }

    this._load(id);


  }

  private _load(id: number) {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;


    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._usuarioService.obterUsuario(id.toString())
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: IUsuario) => {
        this.item = data;
      },
    });
  }

  bloquear() {
    if (this.isLoading || this.numeroDias === 0 || !FieldUtils.isNotFieldFilled(this.item.blockedDate)) {
      return;
    }

    this.isLoading = true;

    const bloqueio: IBloquearusuario = {
      id: this.item.id,
      days: this.numeroDias
    }

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._usuarioService.bloquearUsuario(bloqueio)
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
        this.notificationService.showToast('success', 'Usuário bloqueado com sucesso!')
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

  desbloquear() {
    if (this.isLoading || FieldUtils.isNotFieldFilled(this.item.blockedDate)) {
      return;
    }

    this.numeroDias = null;
    this.isLoading = true;

    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._usuarioService.desbloquearUsuario(this.item.id)
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
        this.notificationService.showToast('success', 'Usuário desbloqueado com sucesso!')
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: IUsuario) => {
        this.item = data;
      },
    });
  }

  protected readonly FieldUtils = FieldUtils;
}

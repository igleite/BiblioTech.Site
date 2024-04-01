import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {UsuarioService} from "../../services/usuario.service";
import {IUsuario} from "../../interfaces/IUsuario";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-detalhar-usuario',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './detalhar-usuario.component.html'
})
export class DetalharUsuarioComponent extends BaseComponentHelper implements OnInit {
  public item!: IUsuario;

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

}

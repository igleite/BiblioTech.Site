import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {ICriarusuario, IUsuario} from "../../interfaces/IUsuario";
import {Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {UsuarioService} from "../../services/usuario.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cadastro-de-usuario',
  standalone: true,
  templateUrl: './cadastro-de-usuario.component.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgIf
  ],
})
export class CadastroDeUsuarioComponent extends BaseComponentHelper implements OnInit {
  public edicao: boolean = false;
  public item!: IUsuario;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    public activeModal: NgbActiveModal
  ) {
    super(_router, _formBuilder);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this._buildForm();
    this._fillData();
  }


  private _buildForm() {
    this.setForm = this._formBuilder.group({
      cpf: [null, [Validators.required, Validators.maxLength(11)]],
      name: [null, [Validators.required, Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }

  private _fillData(): void {
    this.getForm.patchValue({
      'cpf': this.item.cpf,
      'name': this.item.name,
      'email': this.item.email,
    });
  }

  ngSubmit() {
    if (this.isLoading || this.getForm.invalid) {
      return;
    }

    const usuario: ICriarusuario = {
      cpf: this.getField('cpf')?.value,
      name: this.getField('name')?.value,
      email: this.getField('email')?.value,
    }

    if (this.edicao) {
      this._editar(usuario)
    } else {
      this._cadastrar(usuario);
    }


  }

  private _editar(usuario: ICriarusuario) {
    try {
      this.isLoading = true;
      this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
        this._usuarioService.atualizarUsuario(usuario, this.item.id)
      ).subscribe({
        complete: async () => {
          this.isLoading = false;
          await this.notificationService.showToast('success', 'Usuário atualizado com sucesso!');
          this.activeModal.dismiss();
        },
        error: async (error: any): Promise<void> => {
          this.isLoading = false;
          await this.notificationService.showToast('error', error.message);
        },
        next: async () => {
        },
      });
    } catch {
      this.isLoading = false;
    }
  }

  private _cadastrar(usuario: ICriarusuario) {
    try {
      this.isLoading = true;
      this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
        this._usuarioService.criarUsuario(usuario)
      ).subscribe({
        complete: async () => {
          this.isLoading = false;
          await this.notificationService.showToast('success', 'Usuário criado com sucesso!');
          this.activeModal.dismiss();
        },
        error: async (error: any): Promise<void> => {
          this.isLoading = false;
          await this.notificationService.showToast('error', error.message);
        },
        next: async () => {
        },
      });
    } catch {
      this.isLoading = false;
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {BaseComponentHelper} from "../../../../core/utils/base-component-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {LivroService} from "../../services/livro.service";
import {ILivro} from "../../interfaces/ILivro";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-detalhar-livro',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './detalhar-livro.component.html'
})
export class DetalharLivroComponent extends BaseComponentHelper implements OnInit {
  public item!: ILivro;

  constructor(
    _router: Router,
    _formBuilder: FormBuilder,
    private _livroService: LivroService,
    private _route: ActivatedRoute,
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
    this.pageIndex += 1;


    this.apiRequestHandlerUtil.handleApiRequest<any>(() =>
      this._livroService.obterLivro(id.toString())
    ).subscribe({
      complete: async () => {
        this.isLoading = false;
      },
      error: async (error: any): Promise<void> => {
        this.isLoading = false;
        await this.notificationService.showToast('error', error.message);
      },
      next: async (data: ILivro) => {
        this.item = data;
      },
    });
  }
}

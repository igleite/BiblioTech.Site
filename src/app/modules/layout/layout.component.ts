import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import packageJson from '../../../../package.json';
import {NgForOf} from "@angular/common";
import {MenuItem} from "../../core/models/menu.model";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf,
    RouterLink
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(private _router: Router) {
  }

  public appJson: any = packageJson;


  menus: MenuItem[] = [
    {label: 'Livros', route: 'app/livro'},
    {label: 'Usuários', route: 'app/usuario'},
    {label: 'Emprestimo', route: ''}
  ]

  async acessarRota(route: string | undefined) {
    if (!route) return;


    await this._router.navigate([route])
  }
}
